(function () {
const ConnectFourFallback = (() => {
  const ROWS = 6;
  const COLUMNS = 7;
  const PLAYERS = { YELLOW: '노랑', RED: '빨강' };
  const createEmptyBoard = () => Array.from({ length: ROWS }, () => Array(COLUMNS).fill(null));
  const cloneBoard = (board) => board.map((row) => row.slice());
  const otherPlayer = (player) => (player === PLAYERS.YELLOW ? PLAYERS.RED : PLAYERS.YELLOW);
  const getAvailableRow = (board, column) => {
    for (let row = ROWS - 1; row >= 0; row -= 1) {
      if (board[row][column] === null) return row;
    }
    return -1;
  };
  const checkWinner = (board) => {
    const directions = [[0, 1], [1, 0], [-1, 1], [1, 1]];
    for (let row = 0; row < ROWS; row += 1) {
      for (let column = 0; column < COLUMNS; column += 1) {
        const player = board[row][column];
        if (!player) continue;
        for (const [rowStep, columnStep] of directions) {
          const cells = [];
          let matched = true;
          for (let index = 0; index < 4; index += 1) {
            const nextRow = row + rowStep * index;
            const nextColumn = column + columnStep * index;
            if (
              nextRow < 0 || nextRow >= ROWS ||
              nextColumn < 0 || nextColumn >= COLUMNS ||
              board[nextRow][nextColumn] !== player
            ) {
              matched = false;
              break;
            }
            cells.push([nextRow, nextColumn]);
          }
          if (matched) return { player, cells };
        }
      }
    }
    return null;
  };
  const isBoardFull = (board) => board[0].every((cell) => cell !== null);
  const createGame = (options = {}) => {
    const board = options.board ? cloneBoard(options.board) : createEmptyBoard();
    const currentPlayer = options.currentPlayer || PLAYERS.YELLOW;
    const winningLine = checkWinner(board);
    const status = winningLine ? 'won' : isBoardFull(board) ? 'draw' : 'playing';
    return { board, currentPlayer, status, winner: winningLine ? winningLine.player : null, winningCells: winningLine ? winningLine.cells : [] };
  };
  const dropDisc = (game, column) => {
    if (game.status !== 'playing') throw new Error('이미 끝난 게임입니다.');
    const row = getAvailableRow(game.board, column);
    if (row === -1) throw new Error('가득 찬 열입니다.');
    const board = cloneBoard(game.board);
    board[row][column] = game.currentPlayer;
    const winningLine = checkWinner(board);
    const status = winningLine ? 'won' : isBoardFull(board) ? 'draw' : 'playing';
    return { board, currentPlayer: status === 'playing' ? otherPlayer(game.currentPlayer) : game.currentPlayer, status, winner: winningLine ? winningLine.player : null, winningCells: winningLine ? winningLine.cells : [] };
  };
  const playerAdjective = (player) => (player === PLAYERS.YELLOW ? '노란' : '빨간');
  const statusText = (game) => {
    if (game.status === 'won') return `${playerAdjective(game.winner)} 말이 네 줄을 완성했습니다!`;
    if (game.status === 'draw') return '빈칸이 없어 무승부입니다.';
    return `${playerAdjective(game.currentPlayer)} 말 차례입니다.`;
  };
  return { ROWS, COLUMNS, PLAYERS, createGame, dropDisc, statusText };
})();

const {
  ROWS,
  COLUMNS,
  PLAYERS,
  createGame,
  dropDisc,
  statusText,
} = window.ConnectFourLogic || ConnectFourFallback;

const boardElement = document.querySelector('#board');
const buttonsElement = document.querySelector('#column-buttons');
const messageElement = document.querySelector('#message');
const turnLabelElement = document.querySelector('#turn-label');
const resetButton = document.querySelector('#reset-button');

let game = createGame();

function playerClass(player) {
  if (player === PLAYERS.YELLOW) return 'yellow';
  if (player === PLAYERS.RED) return 'red';
  return 'empty';
}

function cellKey(row, column) {
  return `${row}-${column}`;
}

function renderBoard() {
  const winningSet = new Set(game.winningCells.map(([row, column]) => cellKey(row, column)));
  boardElement.innerHTML = '';

  for (let row = 0; row < ROWS; row += 1) {
    for (let column = 0; column < COLUMNS; column += 1) {
      const cell = document.createElement('div');
      const disc = document.createElement('span');
      const player = game.board[row][column];

      cell.className = 'cell';
      disc.className = `disc ${playerClass(player)}`;
      if (winningSet.has(cellKey(row, column))) {
        disc.classList.add('winner');
      }
      disc.setAttribute('aria-label', player ? `${player} 말` : '빈칸');
      cell.appendChild(disc);
      boardElement.appendChild(cell);
    }
  }
}

function renderButtons() {
  buttonsElement.innerHTML = '';
  for (let column = 0; column < COLUMNS; column += 1) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = `${column + 1}열`;
    button.disabled = game.status !== 'playing' || game.board[0][column] !== null;
    button.addEventListener('click', () => {
      try {
        game = dropDisc(game, column);
        render();
      } catch (error) {
        messageElement.textContent = error.message;
      }
    });
    buttonsElement.appendChild(button);
  }
}

function render() {
  renderBoard();
  renderButtons();
  messageElement.textContent = statusText(game);
  turnLabelElement.textContent = game.status === 'playing' ? game.currentPlayer : '종료';
  turnLabelElement.className = playerClass(game.currentPlayer);
}

resetButton.addEventListener('click', () => {
  game = createGame();
  render();
});

render();

})();
