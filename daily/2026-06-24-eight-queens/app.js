const boardElement = document.querySelector('#board');
const queenCountElement = document.querySelector('#queen-count');
const statusElement = document.querySelector('#game-status');
const messageElement = document.querySelector('#message');
const restartButton = document.querySelector('#restart-button');

let game = EightQueens.createGame();

function renderBoard() {
  const conflicts = new Set(EightQueens.getConflicts(game));
  boardElement.innerHTML = '';

  for (let y = 0; y < game.size; y += 1) {
    for (let x = 0; x < game.size; x += 1) {
      const button = document.createElement('button');
      const hasQueen = EightQueens.hasQueen(game, x, y);
      const key = `${x},${y}`;

      button.type = 'button';
      button.className = [
        'cell',
        (x + y) % 2 === 0 ? 'light' : 'dark',
        hasQueen ? 'queen' : '',
        conflicts.has(key) ? 'conflict' : '',
      ].filter(Boolean).join(' ');
      button.dataset.x = x;
      button.dataset.y = y;
      button.setAttribute('aria-label', `${y + 1}행 ${x + 1}열`);
      button.textContent = hasQueen ? '♛' : '';

      boardElement.appendChild(button);
    }
  }
}

function render() {
  queenCountElement.textContent = `${EightQueens.countQueens(game)} / 8`;
  statusElement.textContent = game.status;
  messageElement.textContent = game.message;
  renderBoard();
}

boardElement.addEventListener('click', (event) => {
  const cell = event.target.closest('.cell');
  if (!cell) {
    return;
  }

  game = EightQueens.toggleQueen(game, cell.dataset.x, cell.dataset.y);
  render();
});

restartButton.addEventListener('click', () => {
  game = EightQueens.createGame();
  render();
});

render();
