const boardNode = document.querySelector('[data-board]');
const whiteCapturedNode = document.querySelector('[data-white-captured]');
const blackCapturedNode = document.querySelector('[data-black-captured]');
const turnNode = document.querySelector('[data-turn]');
const messageNode = document.querySelector('[data-message]');
const resetButton = document.querySelector('[data-reset]');

let game = Alquerque.createGame();
let selected = null;

function addBoardLines() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('lines');
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.setAttribute('aria-hidden', 'true');
  const addLine = (x1, y1, x2, y2) => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    svg.appendChild(line);
  };
  [10, 30, 50, 70, 90].forEach((point) => {
    addLine(10, point, 90, point);
    addLine(point, 10, point, 90);
  });
  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 5; col += 1) {
      if ((row + col) % 2 !== 0) continue;
      const x = 10 + col * 20;
      const y = 10 + row * 20;
      if (col < 4) addLine(x, y, x + 20, y + 20);
      if (col > 0) addLine(x, y, x - 20, y + 20);
    }
  }
  boardNode.appendChild(svg);
}

function render() {
  boardNode.innerHTML = '';
  addBoardLines();
  game.board.forEach((row, rowIndex) => {
    row.forEach((piece, colIndex) => {
      const button = document.createElement('button');
      const isSelected = selected && selected.row === rowIndex && selected.col === colIndex;
      button.type = 'button';
      button.className = `point${piece ? ` ${piece === Alquerque.WHITE ? 'white' : 'black'}` : ''}${isSelected ? ' selected' : ''}`;
      button.setAttribute('aria-label', `${rowIndex + 1}행 ${colIndex + 1}열 ${piece || '빈칸'}`);
      button.addEventListener('click', () => handlePoint(rowIndex, colIndex));
      boardNode.appendChild(button);
    });
  });
  whiteCapturedNode.textContent = game.captured.white;
  blackCapturedNode.textContent = game.captured.black;
  turnNode.textContent = game.status === '진행 중' ? `${game.turn} 차례` : game.status;
  messageNode.textContent = game.message;
}

function handlePoint(row, col) {
  if (game.status !== '진행 중') return;
  if (!selected && game.board[row][col] === game.turn) {
    selected = { row, col };
  } else if (selected) {
    try {
      game = Alquerque.movePiece(game, selected.row, selected.col, row, col);
      selected = game.forcedPiece || null;
    } catch (error) {
      if (game.board[row][col] === game.turn) selected = { row, col };
      else game = { ...game, message: error.message };
    }
  }
  render();
}

resetButton.addEventListener('click', () => {
  game = Alquerque.createGame();
  selected = null;
  render();
});

render();
