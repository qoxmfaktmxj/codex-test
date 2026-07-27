const BOARD_SIZE = 9;
const STONES = ['흑', '백'];
const DIRECTIONS = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
];

function createBoard(board) {
  if (Array.isArray(board) && board.length === BOARD_SIZE) {
    return board.map((row) => row.slice(0, BOARD_SIZE));
  }
  return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));
}

function normalizeStone(stone) {
  return STONES.includes(stone) ? stone : STONES[0];
}

function nextStone(stone) {
  return stone === STONES[0] ? STONES[1] : STONES[0];
}

function createGame(options = {}) {
  return {
    board: createBoard(options.board),
    currentStone: normalizeStone(options.currentStone),
    status: options.status || '진행 중',
    winner: options.winner || null,
    message: options.message || '흑돌을 놓을 칸을 고르세요.',
  };
}

function isInside(row, col) {
  return Number.isInteger(row)
    && Number.isInteger(col)
    && row >= 0
    && row < BOARD_SIZE
    && col >= 0
    && col < BOARD_SIZE;
}

function isValidMove(game, row, col) {
  return game.status === '진행 중'
    && isInside(row, col)
    && game.board[row][col] === null;
}

function countLine(board, row, col, rowStep, colStep) {
  const stone = board[row][col];
  let count = 0;
  let nextRow = row;
  let nextCol = col;

  while (isInside(nextRow, nextCol) && board[nextRow][nextCol] === stone) {
    count += 1;
    nextRow += rowStep;
    nextCol += colStep;
  }

  return count;
}

function getWinner(board) {
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      if (!board[row][col]) {
        continue;
      }

      for (const [rowStep, colStep] of DIRECTIONS) {
        if (countLine(board, row, col, rowStep, colStep) >= 5) {
          return board[row][col];
        }
      }
    }
  }

  return null;
}

function isBoardFull(board) {
  return board.every((row) => row.every(Boolean));
}

function placeStone(game, row, col) {
  if (!isValidMove(game, row, col)) {
    return game;
  }

  const board = createBoard(game.board);
  board[row][col] = game.currentStone;
  const winner = getWinner(board);

  if (winner) {
    return {
      ...game,
      board,
      status: '승리',
      winner,
      message: `${winner}돌이 다섯 줄을 완성했습니다.`,
    };
  }

  if (isBoardFull(board)) {
    return {
      ...game,
      board,
      status: '무승부',
      message: '빈 칸이 없어 무승부입니다.',
    };
  }

  const currentStone = nextStone(game.currentStone);
  return {
    ...game,
    board,
    currentStone,
    message: `${currentStone}돌 차례입니다.`,
  };
}

const gameLogic = {
  BOARD_SIZE,
  createGame,
  isValidMove,
  placeStone,
  getWinner,
};

if (typeof module !== 'undefined') {
  module.exports = gameLogic;
}

if (typeof window !== 'undefined') {
  window.gameLogic = gameLogic;
}
