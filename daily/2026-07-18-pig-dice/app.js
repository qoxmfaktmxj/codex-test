const scoreNodes = Array.from(document.querySelectorAll('[data-score]'));
const playerCards = Array.from(document.querySelectorAll('[data-player-card]'));
const turnTotalNode = document.querySelector('[data-turn-total]');
const dieNode = document.querySelector('[data-die]');
const messageNode = document.querySelector('[data-message]');
const rollButton = document.querySelector('[data-roll]');
const holdButton = document.querySelector('[data-hold]');
const resetButton = document.querySelector('[data-reset]');

let game = PigDice.createGame();

function render() {
  scoreNodes.forEach((node, index) => {
    node.textContent = game.scores[index];
  });
  playerCards.forEach((card, index) => {
    card.classList.toggle('active', game.currentPlayer === index && game.status === '진행 중');
    card.classList.toggle('winner', game.winner === index);
  });
  turnTotalNode.textContent = game.turnTotal;
  dieNode.textContent = game.lastRoll || '?';
  dieNode.classList.toggle('danger', game.lastRoll === 1);
  messageNode.textContent = game.message;
  rollButton.disabled = game.status !== '진행 중';
  holdButton.disabled = game.status !== '진행 중' || game.turnTotal === 0;
}

rollButton.addEventListener('click', () => {
  game = PigDice.rollDie(game);
  render();
});

holdButton.addEventListener('click', () => {
  game = PigDice.holdTurn(game);
  render();
});

resetButton.addEventListener('click', () => {
  game = PigDice.createGame();
  render();
});

render();
