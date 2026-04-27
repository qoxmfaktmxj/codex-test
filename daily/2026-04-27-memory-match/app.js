const {
  createGame,
  flipCard,
  hideUnmatched,
  shuffledValues,
} = window.gameLogic;

const board = document.querySelector('[data-board]');
const statusText = document.querySelector('[data-status]');
const resetButton = document.querySelector('[data-reset]');

let game = createGame(shuffledValues());
let hideTimer = null;

function getStatusMessage() {
  if (game.status === 'won') {
    return `Cleared in ${game.moves} moves`;
  }

  if (game.flippedIds.length === 2) {
    return 'No match';
  }

  return `Moves: ${game.moves}`;
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
    button.setAttribute('aria-label', card.isFaceUp || card.isMatched ? `Card ${card.value}` : 'Hidden card');
    board.append(button);
  }
}

function scheduleHide() {
  clearTimeout(hideTimer);
  if (game.flippedIds.length !== 2) {
    return;
  }

  hideTimer = setTimeout(() => {
    game = hideUnmatched(game);
    render();
  }, 700);
}

board.addEventListener('click', (event) => {
  const button = event.target.closest('[data-card-id]');
  if (!button) {
    return;
  }

  game = hideUnmatched(game);
  game = flipCard(game, Number(button.dataset.cardId));
  render();
  scheduleHide();
});

resetButton.addEventListener('click', () => {
  clearTimeout(hideTimer);
  game = createGame(shuffledValues());
  render();
});

render();
