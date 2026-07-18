const boardElement = document.getElementById('board');
const revealedElement = document.getElementById('revealed');
const currentElement = document.getElementById('current');
const statusElement = document.getElementById('status');
const messageElement = document.getElementById('message');
const turnButton = document.getElementById('turn');
const resetButton = document.getElementById('reset');

let game = ClockSolitaire.createGame();

const suitSymbols = {
  스페이드: '♠',
  하트: '♥',
  다이아몬드: '♦',
  클럽: '♣',
};

function cardText(card) {
  return card ? `${suitSymbols[card.suit]} ${card.rank}` : '빈 카드';
}

function renderPile(index, pile) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'pile';
  button.style.setProperty('--slot', String(index));
  button.disabled = game.status !== '진행 중' || index !== game.currentPile;
  button.setAttribute(
    'aria-label',
    `${ClockSolitaire.pileLabel(index)} 더미, 남은 카드 ${pile.faceDown.length}장, 열린 카드 ${pile.faceUp.length}장`,
  );

  if (index === game.currentPile) {
    button.classList.add('current');
  }

  const latest = pile.faceUp[pile.faceUp.length - 1];
  const card = document.createElement('span');
  card.className = 'card';
  if (latest && (latest.suit === '하트' || latest.suit === '다이아몬드')) {
    card.classList.add('red');
  }
  card.textContent = latest ? cardText(latest) : ClockSolitaire.pileLabel(index);

  const count = document.createElement('span');
  count.className = 'count';
  count.textContent = `남은 ${pile.faceDown.length}장`;

  button.append(card, count);
  button.addEventListener('click', () => {
    if (index === game.currentPile) {
      game = ClockSolitaire.turnCard(game);
      render();
    }
  });
  return button;
}

function render() {
  revealedElement.textContent = `${game.revealedCount}장`;
  currentElement.textContent = ClockSolitaire.pileLabel(game.currentPile);
  statusElement.textContent = game.status;
  messageElement.textContent = game.message;
  turnButton.disabled = game.status !== '진행 중';
  boardElement.innerHTML = '';

  game.piles.forEach((pile, index) => {
    boardElement.appendChild(renderPile(index, pile));
  });
}

turnButton.addEventListener('click', () => {
  game = ClockSolitaire.turnCard(game);
  render();
});

resetButton.addEventListener('click', () => {
  game = ClockSolitaire.createGame();
  render();
});

render();
