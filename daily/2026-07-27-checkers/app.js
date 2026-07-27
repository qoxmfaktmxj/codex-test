const boardNode = document.querySelector('[data-board]');
const blackCountNode = document.querySelector('[data-black-count]');
const whiteCountNode = document.querySelector('[data-white-count]');
const messageNode = document.querySelector('[data-message]');
const resetButton = document.querySelector('[data-reset]');

let game = Checkers.createGame();
let selected = null;

function render() {
  boardNode.innerHTML = '';
  game.board.forEach((row, rowIndex) => {
    row.forEach((piece, colIndex) => {
      const button = document.createElement('button');
      const isSelected = selected && selected.row === rowIndex && selected.col === colIndex;
      button.type = 'button';
      button.className = `cell ${(rowIndex + colIndex) % 2 ? 'dark' : 'light'}${isSelected ? ' selected' : ''}`;
      button.setAttribute('aria-label', `${rowIndex + 1}행 ${colIndex + 1}열${piece ? ` ${piece}돌` : ' 빈칸'}`);
      if (piece) {
        const stone = document.createElement('span');
        stone.className = `stone ${piece === Checkers.BLACK ? 'black' : 'white'}`;
        stone.textContent = piece;
        button.appendChild(stone);
      }
      button.addEventListener('click', () => handleCell(rowIndex, colIndex));
      boardNode.appendChild(button);
    });
  });
  blackCountNode.textContent = game.blackCount;
  whiteCountNode.textContent = game.whiteCount;
  messageNode.textContent = game.message;
}

function handleCell(row, col) {
  if (game.status !== '진행 중') {
    return;
  }
  if (!selected && game.board[row][col] === game.current) {
    selected = { row, col };
  } else if (selected) {
    try {
      game = Checkers.movePiece(game, selected.row, selected.col, row, col);
      selected = null;
    } catch (error) {
      if (game.board[row][col] === game.current) {
        selected = { row, col };
      } else {
        game = { ...game, message: error.message };
      }
    }
  }
  render();
}

resetButton.addEventListener('click', () => {
  game = Checkers.createGame();
  selected = null;
  render();
});

render();
