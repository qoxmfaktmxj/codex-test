const ROWS = 6;
const COLUMNS = 7;
const PLAYERS = {
  YELLOW: '노랑',
  RED: '빨강',
};

function createEmptyBoard() {
  return Array.from({ length: ROWS }, () => Array(COLUMNS).fill(null));
}

function cloneBoard(board) {
  return board.map((row) => row.slice());
}

function otherPlayer(player) {
  return player === PLAYERS.YELLOW ? PLAYERS.RED : PLAYERS.YELLOW;
}

function getAvailableRow(board, column) {
  if (!Number.isInteger(column) || column < 0 || column >= COLUMNS) {
    throw new Error('없는 열입니다.');
  }

  for (let row = ROWS - 1; row >= 0; row -= 1) {
    if (board[row][column] === null) {
      return row;
    }
  }

  return -1;
}

function cellsMatch(board, row, column, rowStep, columnStep) {
  const player = board[row][column];
  if (!player) {
    return null;
  }

  const cells = [];
  for (let index = 0; index < 4; index += 1) {
    const nextRow = row + rowStep * index;
    const nextColumn = column + columnStep * index;
    if (
      nextRow < 0 ||
      nextRow >= ROWS ||
      nextColumn < 0 ||
      nextColumn >= COLUMNS ||
      board[nextRow][nextColumn] !== player
    ) {
      return null;
    }
    cells.push([nextRow, nextColumn]);
  }

  return { player, cells };
}

function checkWinner(board) {
  const directions = [
    [0, 1],
    [1, 0],
    [-1, 1],
    [1, 1],
  ];

  for (let row = 0; row < ROWS; row += 1) {
    for (let column = 0; column < COLUMNS; column += 1) {
      for (const [rowStep, columnStep] of directions) {
        const result = cellsMatch(board, row, column, rowStep, columnStep);
        if (result) {
          return result;
        }
      }
    }
  }

  return null;
}

function isBoardFull(board) {
  return board[0].every((cell) => cell !== null);
}

function createGame(options = {}) {
  const board = options.board ? cloneBoard(options.board) : createEmptyBoard();
  const currentPlayer = options.currentPlayer || PLAYERS.YELLOW;
  const winningLine = checkWinner(board);
  const status = winningLine ? 'won' : isBoardFull(board) ? 'draw' : 'playing';

  return {
    board,
    currentPlayer,
    status,
    winner: winningLine ? winningLine.player : null,
    winningCells: winningLine ? winningLine.cells : [],
  };
}

function dropDisc(game, column) {
  if (game.status !== 'playing') {
    throw new Error('이미 끝난 게임입니다.');
  }

  const row = getAvailableRow(game.board, column);
  if (row === -1) {
    throw new Error('가득 찬 열입니다.');
  }

  const board = cloneBoard(game.board);
  board[row][column] = game.currentPlayer;
  const winningLine = checkWinner(board);
  const status = winningLine ? 'won' : isBoardFull(board) ? 'draw' : 'playing';

  return {
    board,
    currentPlayer: status === 'playing' ? otherPlayer(game.currentPlayer) : game.currentPlayer,
    status,
    winner: winningLine ? winningLine.player : null,
    winningCells: winningLine ? winningLine.cells : [],
  };
}

function playerAdjective(player) {
  return player === PLAYERS.YELLOW ? '노란' : '빨간';
}

function statusText(game) {
  if (game.status === 'won') {
    return `${playerAdjective(game.winner)} 말이 네 줄을 완성했습니다!`;
  }
  if (game.status === 'draw') {
    return '빈칸이 없어 무승부입니다.';
  }
  return `${playerAdjective(game.currentPlayer)} 말 차례입니다.`;
}

const api = {
  ROWS,
  COLUMNS,
  PLAYERS,
  createEmptyBoard,
  createGame,
  dropDisc,
  getAvailableRow,
  checkWinner,
  isBoardFull,
  statusText,
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = api;
}

if (typeof window !== 'undefined') {
  window.ConnectFourLogic = api;
}
