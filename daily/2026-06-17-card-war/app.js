const {
  createGame,
  drawRound,
  formatCard,
  resetGame,
} = window.CardWarLogic;

const roundEl = document.getElementById('round');
const roundLimitEl = document.getElementById('round-limit');
const playerScoreEl = document.getElementById('player-score');
const computerScoreEl = document.getElementById('computer-score');
const remainingCardsEl = document.getElementById('remaining-cards');
const playerCardEl = document.getElementById('player-card');
const computerCardEl = document.getElementById('computer-card');
const messageEl = document.getElementById('message');
const historyListEl = document.getElementById('history-list');
const drawButton = document.getElementById('draw-button');
const resetButton = document.getElementById('reset-button');

let game = createGame();

function getCardColor(card) {
  return card && (card.suit === '하트' || card.suit === '다이아몬드') ? 'red' : 'black';
}

function renderCard(element, card) {
  element.className = 'card';
  if (!card) {
    element.classList.add('back');
    element.textContent = '?';
    return;
  }
  element.classList.add(getCardColor(card));
  element.textContent = formatCard(card);
}

function renderHistory() {
  historyListEl.innerHTML = '';
  if (game.history.length === 0) {
    const item = document.createElement('li');
    item.textContent = '아직 열린 라운드가 없습니다.';
    historyListEl.appendChild(item);
    return;
  }

  game.history.forEach((round) => {
    const item = document.createElement('li');
    const resultText = round.result === '무승부' ? '무승부' : `${round.result} 승`;
    item.textContent = `${formatCard(round.playerCard)} 대 ${formatCard(round.computerCard)} - ${resultText}`;
    historyListEl.appendChild(item);
  });
}

function render() {
  roundEl.textContent = String(game.round);
  roundLimitEl.textContent = String(game.roundLimit);
  playerScoreEl.textContent = String(game.scores['나']);
  computerScoreEl.textContent = String(game.scores['컴퓨터']);
  remainingCardsEl.textContent = String(game.deck.length);
  messageEl.textContent = game.message;
  drawButton.disabled = game.status === '완료';
  drawButton.textContent = game.status === '완료' ? '게임 완료' : '카드 뽑기';
  renderCard(playerCardEl, game.lastRound && game.lastRound.playerCard);
  renderCard(computerCardEl, game.lastRound && game.lastRound.computerCard);
  renderHistory();
}

drawButton.addEventListener('click', () => {
  game = drawRound(game);
  render();
});

resetButton.addEventListener('click', () => {
  game = resetGame();
  render();
});

render();
