const { createGame, guessNext } = window.HighLowCardLogic;

const currentCardEl = document.getElementById('current-card');
const streakEl = document.getElementById('streak');
const bestStreakEl = document.getElementById('best-streak');
const livesEl = document.getElementById('lives');
const remainingEl = document.getElementById('remaining');
const messageEl = document.getElementById('message');
const guessButtons = document.querySelectorAll('[data-guess]');
const resetButton = document.getElementById('reset-button');

let game = createGame();

function cardText(card) {
  if (card === 1) {
    return '에이스';
  }
  if (card === 11) {
    return '잭';
  }
  if (card === 12) {
    return '퀸';
  }
  if (card === 13) {
    return '킹';
  }
  return String(card);
}

function render() {
  currentCardEl.textContent = cardText(game.currentCard);
  streakEl.textContent = `${game.streak} / ${game.targetStreak}`;
  bestStreakEl.textContent = String(game.bestStreak);
  livesEl.textContent = String(game.lives);
  remainingEl.textContent = String(game.deck.length);
  messageEl.textContent = game.message;

  const isPlaying = game.status === '진행 중';
  guessButtons.forEach((button) => {
    button.disabled = !isPlaying;
  });
}

guessButtons.forEach((button) => {
  button.addEventListener('click', () => {
    game = guessNext(game, button.dataset.guess);
    render();
  });
});

resetButton.addEventListener('click', () => {
  game = createGame();
  render();
});

render();
