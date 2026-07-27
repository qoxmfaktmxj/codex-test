const boardNode = document.querySelector('[data-board]');
const numbersNode = document.querySelector('[data-numbers]');
const filledNode = document.querySelector('[data-filled]');
const messageNode = document.querySelector('[data-message]');
const clearButton = document.querySelector('[data-clear]');
const resetButton = document.querySelector('[data-reset]');

let game = LatinSquare.createGame();
let selectedCell = null;

function renderBoard() {
  boardNode.innerHTML = '';
  game.board.forEach((row, rowIndex) => {
    row.forEach((number, colIndex) => {
      const button = document.createElement('button');
      const fixed = game.fixedCells.some(([fixedRow, fixedCol]) => fixedRow === rowIndex && fixedCol === colIndex);
      const selected = selectedCell && selectedCell.row === rowIndex && selectedCell.col === colIndex;
      const conflict = LatinSquare.cellHasConflict(game, rowIndex, colIndex);

      button.type = 'button';
      button.className = [
        'cell',
        fixed ? 'fixed' : '',
        selected ? 'selected' : '',
        conflict ? 'conflict' : '',
      ].filter(Boolean).join(' ');
      button.textContent = number || '';
      button.setAttribute('aria-label', number ? `${rowIndex + 1}행 ${colIndex + 1}열 숫자 ${number}` : `${rowIndex + 1}행 ${colIndex + 1}열 빈칸`);
      button.addEventListener('click', () => handleCellClick(rowIndex, colIndex, fixed));
      boardNode.appendChild(button);
    });
  });
}

function handleCellClick(row, col, fixed) {
  selectedCell = { row, col };

  if (!fixed && game.selectedNumber && game.status === '진행 중') {
    game = LatinSquare.placeNumber(game, row, col);
  }

  render();
}

function renderNumbers() {
  numbersNode.innerHTML = '';
  game.symbols.forEach((number) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = game.selectedNumber === number ? 'number selected' : 'number';
    button.disabled = game.status !== '진행 중';
    button.textContent = number;
    button.setAttribute('aria-label', `${number} 선택`);
    button.addEventListener('click', () => {
      game = LatinSquare.selectNumber(game, number);
      render();
    });
    numbersNode.appendChild(button);
  });
}

function render() {
  renderBoard();
  renderNumbers();
  filledNode.textContent = game.filledCount;
  messageNode.textContent = game.message;
  messageNode.className = `message ${game.status === '성공' ? 'win' : ''} ${game.conflicts.length ? 'warn' : ''}`;
  clearButton.disabled = !selectedCell || isSelectedCellFixed() || game.status === '성공';
}

clearButton.addEventListener('click', () => {
  if (!selectedCell || isSelectedCellFixed()) {
    return;
  }
  game = LatinSquare.clearCell(game, selectedCell.row, selectedCell.col);
  render();
});

resetButton.addEventListener('click', () => {
  game = LatinSquare.createGame();
  selectedCell = null;
  render();
});

render();

function isSelectedCellFixed() {
  return selectedCell && game.fixedCells.some(([row, col]) => row === selectedCell.row && col === selectedCell.col);
}
