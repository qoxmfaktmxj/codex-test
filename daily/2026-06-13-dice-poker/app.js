const {
  CATEGORIES: CATEGORY_LABELS,
  bestCategory: getBestCategory,
  chooseCategory: selectCategory,
  createGame: makeGame,
  rollDice: rollGameDice,
  scoreCategory: getCategoryScore,
  toggleHold: toggleDieHold,
} = window.DicePokerLogic;

const dieFaces = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
const categoryHelp = {
  pair: '같은 눈 두 개',
  three: '같은 눈 세 개',
  fullHouse: '세 개와 두 개',
  smallStraight: '연속 네 눈',
  largeStraight: '연속 다섯 눈',
  yacht: '모두 같은 눈',
  chance: '눈의 합계',
};

const rollsLeftEl = document.getElementById('rolls-left');
const bestCategoryEl = document.getElementById('best-category');
const bestScoreEl = document.getElementById('best-score');
const scoreEl = document.getElementById('score');
const diceGridEl = document.getElementById('dice-grid');
const messageEl = document.getElementById('message');
const rollButton = document.getElementById('roll-button');
const resetButton = document.getElementById('reset-button');
const categoryListEl = document.getElementById('category-list');

let game = makeGame();

function renderDice() {
  diceGridEl.innerHTML = '';
  game.dice.forEach((die, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = game.holds[index] ? 'die held' : 'die';
    button.setAttribute('aria-pressed', String(game.holds[index]));
    button.textContent = game.hasRolled ? dieFaces[die - 1] : '?';
    button.addEventListener('click', () => {
      game = toggleDieHold(game, index);
      render();
    });
    diceGridEl.appendChild(button);
  });
}

function renderCategories() {
  categoryListEl.innerHTML = '';
  Object.entries(CATEGORY_LABELS).forEach(([key, label]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = game.selectedCategory === key ? 'category selected' : 'category';
    button.disabled = !game.hasRolled || game.status !== '진행 중';
    button.innerHTML = `
      <span>
        <strong>${label}</strong>
        <small>${categoryHelp[key]}</small>
      </span>
      <b>${getCategoryScore(game.dice, key)}</b>
    `;
    button.addEventListener('click', () => {
      game = selectCategory(game, key);
      render();
    });
    categoryListEl.appendChild(button);
  });
}

function render() {
  const best = getBestCategory(game.dice);
  rollsLeftEl.textContent = String(game.rollsLeft);
  bestCategoryEl.textContent = game.hasRolled ? best.label : '대기';
  bestScoreEl.textContent = game.hasRolled ? String(best.score) : '0';
  scoreEl.textContent = String(game.score);
  messageEl.textContent = game.message;
  rollButton.disabled = game.status !== '진행 중' || game.rollsLeft === 0;

  renderDice();
  renderCategories();
}

rollButton.addEventListener('click', () => {
  game = rollGameDice(game);
  render();
});

resetButton.addEventListener('click', () => {
  game = makeGame();
  render();
});

render();
