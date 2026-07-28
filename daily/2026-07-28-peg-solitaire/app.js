const boardNode = document.querySelector('[data-board]');
const remainingNode = document.querySelector('[data-remaining]');
const statusNode = document.querySelector('[data-status]');
const messageNode = document.querySelector('[data-message]');
const resetButton = document.querySelector('[data-reset]');

let game = PegSolitaire.createGame();
let selected = null;

function render() {
  boardNode.innerHTML = '';
  game.board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const slot = document.createElement('div');
      slot.className = 'slot';
      if (cell === PegSolitaire.INVALID) {
        slot.classList.add('invalid');
      } else {
        const button = document.createElement('button');
        const isSelected = selected && selected.row === rowIndex && selected.col === colIndex;
        button.type = 'button';
        button.className = `cell${cell === PegSolitaire.PEG ? ' peg' : ' empty'}${isSelected ? ' selected' : ''}`;
        button.setAttribute('aria-label', `${rowIndex + 1}행 ${colIndex + 1}열 ${cell === PegSolitaire.PEG ? '말' : '빈칸'}`);
        button.addEventListener('click', () => handleCell(rowIndex, colIndex));
        slot.appendChild(button);
      }
      boardNode.appendChild(slot);
    });
  });
  remainingNode.textContent = game.remaining;
  statusNode.textContent = game.status;
  messageNode.textContent = game.message;
}

function handleCell(row, col) {
  if (game.status !== '진행 중') return;
  if (!selected && game.board[row][col] === PegSolitaire.PEG) {
    selected = { row, col };
  } else if (selected) {
    try {
      game = PegSolitaire.movePeg(game, selected.row, selected.col, row, col);
      selected = null;
    } catch (error) {
      if (game.board[row][col] === PegSolitaire.PEG) selected = { row, col };
      else game = { ...game, message: error.message };
    }
  }
  render();
}

resetButton.addEventListener('click', () => {
  game = PegSolitaire.createGame();
  selected = null;
  render();
});

render();
