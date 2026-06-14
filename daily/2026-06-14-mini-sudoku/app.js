const {
  SIZE: BOARD_SIZE,
  createGame: makeGame,
  getCellState: readCellState,
  selectCell: chooseCell,
  setCellValue: writeCellValue,
  clearCell: eraseCell,
} = window.MiniSudokuLogic;

const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const movesEl = document.getElementById('moves');
const errorsEl = document.getElementById('errors');
const messageEl = document.getElementById('message');
const clearButton = document.getElementById('clear-button');
const resetButton = document.getElementById('reset-button');
const numberButtons = document.querySelectorAll('[data-number]');

let game = makeGame();

function renderBoard() {
  boardEl.innerHTML = '';
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const cell = readCellState(game, row, col);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = [
        'cell',
        cell.fixed ? 'fixed' : '',
        cell.selected ? 'selected' : '',
        cell.conflicted ? 'conflicted' : '',
      ]
        .filter(Boolean)
        .join(' ');
      button.textContent = cell.value === 0 ? '' : String(cell.value);
      button.setAttribute('aria-label', `${row + 1}행 ${col + 1}열`);
      button.addEventListener('click', () => {
        game = chooseCell(game, row, col);
        render();
      });
      boardEl.appendChild(button);
    }
  }
}

function render() {
  statusEl.textContent = game.status;
  movesEl.textContent = String(game.moves);
  errorsEl.textContent = String(game.errors);
  messageEl.textContent = game.message;
  numberButtons.forEach((button) => {
    button.disabled = game.status !== '진행 중';
  });
  clearButton.disabled = game.status !== '진행 중';
  renderBoard();
}

numberButtons.forEach((button) => {
  button.addEventListener('click', () => {
    game = writeCellValue(game, Number(button.dataset.number));
    render();
  });
});

clearButton.addEventListener('click', () => {
  game = eraseCell(game);
  render();
});

resetButton.addEventListener('click', () => {
  game = makeGame();
  render();
});

render();
