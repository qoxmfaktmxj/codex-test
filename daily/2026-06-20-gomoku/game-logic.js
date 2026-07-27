const BOARD_SIZE = 9;
const PLAYERS = ['흑', '백'];
const DIRECTIONS = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
];

function createEmptyBoard() {
  return Array.from({ length: BOARD_SIZE }, () => Array.from({ length: BOARD_SIZE }, () => null));
}

function cloneBoard(board) {
  const source = Array.isArray(board) ? board : createEmptyBoard();
  return Array.from({ length: BOARD_SIZE }, (_, row) =>
    Array.from({ length: BOARD_SIZE }, (_, col) => {
      const value = source[row] && source[row][col];
      return PLAYERS.includes(value) ? value : null;
    }),
  );
}

function normalizePlayer(player) {
  return PLAYERS.includes(player) ? player : '흑';
}

function getPlayerLabel(player) {
  return player === '백' ? '백돌' : '흑돌';
}

function createGame(options = {}) {
  const currentPlayer = normalizePlayer(options.currentPlayer);
  return {
    board: cloneBoard(options.board),
    currentPlayer,
    status: options.status || '진행 중',
    winner: options.winner || null,
    message: options.message || `${getPlayerLabel(currentPlayer)} 차례입니다.`,
  };
}

function isInside(row, col) {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

function getCell(board, row, col) {
  if (!isInside(row, col)) {
    return null;
  }
  return board[row][col];
}

function countDirection(board, row, col, rowStep, colStep) {
  const player = getCell(board, row, col);
  let count = 0;
  let nextRow = row;
  let nextCol = col;

  while (getCell(board, nextRow, nextCol) === player) {
    count += 1;
    nextRow += rowStep;
    nextCol += colStep;
  }

  return count;
}

function getWinner(board) {
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const player = getCell(board, row, col);
      if (!player) {
        continue;
      }

      const hasFive = DIRECTIONS.some(([rowStep, colStep]) => {
        const previousSame = getCell(board, row - rowStep, col - colStep) === player;
        return !previousSame && countDirection(board, row, col, rowStep, colStep) >= 5;
      });

      if (hasFive) {
        return player;
      }
    }
  }

  return null;
}

function isBoardFull(board) {
  return cloneBoard(board).every((row) => row.every(Boolean));
}

function getNextPlayer(player) {
  return player === '흑' ? '백' : '흑';
}

function placeStone(game, row, col) {
  const current = createGame(game);
  const targetRow = Math.floor(Number(row));
  const targetCol = Math.floor(Number(col));

  if (current.status !== '진행 중') {
    return current;
  }

  if (!isInside(targetRow, targetCol) || getCell(current.board, targetRow, targetCol)) {
    return {
      ...current,
      message: '그 칸에는 둘 수 없습니다.',
    };
  }

  const board = cloneBoard(current.board);
  board[targetRow][targetCol] = current.currentPlayer;
  const winner = getWinner(board);

  if (winner) {
    return {
      board,
      currentPlayer: current.currentPlayer,
      status: '승리',
      winner,
      message: `${getPlayerLabel(winner)}이 오목을 완성했습니다!`,
    };
  }

  if (isBoardFull(board)) {
    return {
      board,
      currentPlayer: current.currentPlayer,
      status: '무승부',
      winner: null,
      message: '빈 칸이 없어 무승부입니다.',
    };
  }

  const nextPlayer = getNextPlayer(current.currentPlayer);
  return {
    board,
    currentPlayer: nextPlayer,
    status: '진행 중',
    winner: null,
    message: `${getPlayerLabel(nextPlayer)} 차례입니다.`,
  };
}

function resetGame() {
  return createGame();
}

const GomokuLogic = {
  BOARD_SIZE,
  PLAYERS,
  createEmptyBoard,
  createGame,
  getCell,
  getNextPlayer,
  getPlayerLabel,
  getWinner,
  isBoardFull,
  placeStone,
  resetGame,
};

if (typeof module !== 'undefined') {
  module.exports = GomokuLogic;
}

if (typeof window !== 'undefined') {
  window.GomokuLogic = GomokuLogic;
}
