const boardElement = document.querySelector('[data-board]');
const statusElement = document.querySelector('[data-status]');
const resetButton = document.querySelector('[data-reset]');

let game = window.gameLogic.createGame();
const cells = Array.from({ length: 9 }, (_, index) => {
  const button = document.createElement('button');
  button.className = 'cell';
  button.type = 'button';
  button.addEventListener('click', () => {
    game = window.gameLogic.applyMove(game, index);
    render();
  });
  boardElement.appendChild(button);
  return button;
});

function statusText() {
  if (game.status === 'won') {
    return `${game.winner} wins`;
  }

  if (game.status === 'draw') {
    return 'Draw';
  }

  return `${game.currentPlayer} turn`;
}

function render() {
  statusElement.textContent = statusText();

  game.board.forEach((cell, index) => {
    const button = cells[index];
    button.textContent = cell || '';
    button.setAttribute('aria-label', cell ? `Cell ${index + 1}: ${cell}` : `Cell ${index + 1}`);
    button.disabled = Boolean(cell) || game.status !== 'playing';
  });
}

resetButton.addEventListener('click', () => {
  game = window.gameLogic.createGame();
  render();
});

render();
