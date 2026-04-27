const board = document.querySelector('[data-board]');
const statusText = document.querySelector('[data-status]');
const resetButton = document.querySelector('[data-reset]');

let game = window.gameLogic.createGame(window.gameLogic.shuffledValues());
let hideTimer = null;

function getStatusMessage() {
  if (game.status === 'won') {
    return `${game.moves}번 만에 완료`;
  }

  if (game.flippedIds.length === 2) {
    return '짝이 아닙니다';
  }

  return `이동 횟수: ${game.moves}`;
}

function render() {
  board.innerHTML = '';
  statusText.textContent = getStatusMessage();

  for (const card of game.cards) {
    const button = document.createElement('button');
    button.className = 'card';
    button.type = 'button';
    button.dataset.cardId = String(card.id);
    button.textContent = card.isFaceUp || card.isMatched ? card.value : '?';
    button.disabled = game.status === 'won' || card.isMatched;
    button.setAttribute('aria-label', card.isFaceUp || card.isMatched ? `카드 ${card.value}` : '숨겨진 카드');
    board.append(button);
  }
}

function scheduleHide() {
  clearTimeout(hideTimer);
  if (game.flippedIds.length !== 2) {
    return;
  }

  hideTimer = setTimeout(() => {
    game = window.gameLogic.hideUnmatched(game);
    render();
  }, 700);
}

board.addEventListener('click', (event) => {
  const button = event.target.closest('[data-card-id]');
  if (!button) {
    return;
  }

  game = window.gameLogic.hideUnmatched(game);
  game = window.gameLogic.flipCard(game, Number(button.dataset.cardId));
  render();
  scheduleHide();
});

resetButton.addEventListener('click', () => {
  clearTimeout(hideTimer);
  game = window.gameLogic.createGame(window.gameLogic.shuffledValues());
  render();
});

render();
