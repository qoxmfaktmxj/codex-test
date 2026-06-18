const COLORS = ['빨강', '주황', '노랑', '초록', '파랑', '보라'];
const DEFAULT_SIZE = 7;
const DEFAULT_MOVE_LIMIT = 14;

function clampSize(size) {
  return Math.max(2, Math.min(10, Math.floor(Number(size) || DEFAULT_SIZE)));
}

function cloneBoard(board) {
  return board.map((row) => row.slice());
}

function normalizeBoard(board, size = DEFAULT_SIZE) {
  if (!Array.isArray(board) || board.length === 0) {
    return createBoard(size);
  }

  const normalized = board
    .filter((row) => Array.isArray(row) && row.length > 0)
    .map((row) => row.map((color) => (COLORS.includes(color) ? color : COLORS[0])));

  if (normalized.length === 0) {
    return createBoard(size);
  }

  const width = normalized[0].length;
  return normalized.map((row) => {
    const next = row.slice(0, width);
    while (next.length < width) {
      next.push(COLORS[0]);
    }
    return next;
  });
}

function createBoard(size = DEFAULT_SIZE, random = Math.random) {
  const boardSize = clampSize(size);
  return Array.from({ length: boardSize }, () =>
    Array.from({ length: boardSize }, () => {
      const index = Math.min(COLORS.length - 1, Math.floor(random() * COLORS.length));
      return COLORS[index];
    }),
  );
}

function getFloodedCells(board) {
  const normalized = normalizeBoard(board);
  const targetColor = normalized[0][0];
  const height = normalized.length;
  const width = normalized[0].length;
  const visited = Array.from({ length: height }, () => Array(width).fill(false));
  const queue = [[0, 0]];
  const cells = [];
  visited[0][0] = true;

  while (queue.length > 0) {
    const [row, col] = queue.shift();
    cells.push([row, col]);

    [
      [row - 1, col],
      [row + 1, col],
      [row, col - 1],
      [row, col + 1],
    ].forEach(([nextRow, nextCol]) => {
      const inBounds = nextRow >= 0 && nextRow < height && nextCol >= 0 && nextCol < width;
      if (!inBounds || visited[nextRow][nextCol] || normalized[nextRow][nextCol] !== targetColor) {
        return;
      }
      visited[nextRow][nextCol] = true;
      queue.push([nextRow, nextCol]);
    });
  }

  return cells;
}

function floodBoard(board, color) {
  const normalized = normalizeBoard(board);
  if (!COLORS.includes(color)) {
    return normalized;
  }

  const next = cloneBoard(normalized);
  getFloodedCells(normalized).forEach(([row, col]) => {
    next[row][col] = color;
  });
  return next;
}

function isComplete(board) {
  const normalized = normalizeBoard(board);
  const first = normalized[0][0];
  return normalized.every((row) => row.every((color) => color === first));
}

function createGame(options = {}) {
  const board = normalizeBoard(
    Array.isArray(options.board) ? options.board : createBoard(options.size, options.random || Math.random),
    options.size,
  );
  const moveLimit = Math.max(1, Math.floor(Number(options.moveLimit) || DEFAULT_MOVE_LIMIT));
  const moves = Math.max(0, Math.floor(Number(options.moves) || 0));
  const complete = isComplete(board);
  return {
    board,
    size: board.length,
    moveLimit,
    moves,
    currentColor: board[0][0],
    status: options.status || (complete ? '승리' : '진행 중'),
    message: options.message || '왼쪽 위와 이어진 영역을 한 가지 색으로 채우세요.',
  };
}

function cloneGame(game) {
  return {
    ...game,
    board: cloneBoard(normalizeBoard(game.board)),
  };
}

function pickColor(game, color) {
  const next = cloneGame(game);
  if (next.status !== '진행 중') {
    return next;
  }

  if (!COLORS.includes(color)) {
    next.message = '없는 색입니다. 다른 색을 고르세요.';
    return next;
  }

  if (color === next.currentColor) {
    next.message = '이미 선택된 색입니다. 다른 색을 고르세요.';
    return next;
  }

  next.board = floodBoard(next.board, color);
  next.moves += 1;
  next.currentColor = color;

  if (isComplete(next.board)) {
    next.status = '승리';
    next.message = `성공! 모든 칸을 ${color}으로 채웠습니다.`;
    return next;
  }

  const remainingMoves = next.moveLimit - next.moves;
  if (remainingMoves <= 0) {
    next.status = '실패';
    next.message = '이동을 모두 사용했습니다. 다시 도전하세요.';
    return next;
  }

  next.message = `${color}으로 넓혔습니다. 남은 이동은 ${remainingMoves}회입니다.`;
  return next;
}

function resetGame(random = Math.random) {
  return createGame({ random });
}

const ColorFloodLogic = {
  COLORS,
  DEFAULT_MOVE_LIMIT,
  DEFAULT_SIZE,
  createBoard,
  createGame,
  floodBoard,
  getFloodedCells,
  isComplete,
  pickColor,
  resetGame,
};

if (typeof module !== 'undefined') {
  module.exports = ColorFloodLogic;
}

if (typeof window !== 'undefined') {
  window.ColorFloodLogic = ColorFloodLogic;
}
