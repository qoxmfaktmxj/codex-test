const DEFAULT_WIDTH = 8;
const DEFAULT_HEIGHT = 8;
const DEFAULT_COLORS = ['빨강', '파랑', '노랑', '초록'];

function toPositiveInteger(value, fallback) {
  const number = Math.floor(Number(value));
  return number > 0 ? number : fallback;
}

function createColors(colors) {
  if (!Array.isArray(colors) || colors.length === 0) {
    return [...DEFAULT_COLORS];
  }

  const normalized = colors
    .map((color) => String(color || '').trim())
    .filter(Boolean);

  return normalized.length > 0 ? normalized : [...DEFAULT_COLORS];
}

function cloneBoard(board) {
  return board.map((row) => [...row]);
}

function createRandomBoard(width, height, colors, randomValues = []) {
  return Array.from({ length: height }, (_, y) => (
    Array.from({ length: width }, (_, x) => {
      const randomValue = randomValues[y * width + x];
      const roll = randomValue === undefined ? Math.random() : Number(randomValue);
      const index = Math.abs(Math.floor(roll * colors.length)) % colors.length;
      return colors[index];
    })
  ));
}

function normalizeBoard(width, height, colors, board, randomValues) {
  if (!Array.isArray(board)) {
    return createRandomBoard(width, height, colors, randomValues);
  }

  return Array.from({ length: height }, (_, y) => (
    Array.from({ length: width }, (_, x) => {
      const value = Array.isArray(board[y]) ? board[y][x] : null;
      if (value === null || value === undefined || value === '') {
        return null;
      }
      return colors.includes(value) ? value : colors[0];
    })
  ));
}

function createGame(options = {}) {
  const width = toPositiveInteger(options.width, DEFAULT_WIDTH);
  const height = toPositiveInteger(options.height, DEFAULT_HEIGHT);
  const colors = createColors(options.colors);
  const board = normalizeBoard(width, height, colors, options.board, options.randomValues);
  const score = Math.max(0, Math.floor(Number(options.score)) || 0);
  const status = options.status || '진행 중';

  return {
    width,
    height,
    colors,
    board,
    score,
    removed: Math.max(0, Math.floor(Number(options.removed)) || 0),
    status,
    message: options.message || (status === '완료'
      ? `더 지울 블록이 없습니다. 최종 점수는 ${score}점입니다.`
      : '붙어 있는 같은 색 블록을 지우세요.'),
  };
}

function isInside(game, x, y) {
  return x >= 0 && x < game.width && y >= 0 && y < game.height;
}

function findGroup(gameInput, xInput, yInput) {
  const game = createGame(gameInput);
  const x = Math.floor(Number(xInput));
  const y = Math.floor(Number(yInput));

  if (!isInside(game, x, y)) {
    return [];
  }

  const target = game.board[y][x];
  if (!target) {
    return [];
  }

  const group = [];
  const visited = new Set();
  const stack = [[x, y]];

  while (stack.length > 0) {
    const [currentX, currentY] = stack.pop();
    const key = `${currentX},${currentY}`;
    if (visited.has(key) || !isInside(game, currentX, currentY)) {
      continue;
    }
    visited.add(key);

    if (game.board[currentY][currentX] !== target) {
      continue;
    }

    group.push([currentX, currentY]);
    stack.push(
      [currentX + 1, currentY],
      [currentX, currentY + 1],
      [currentX - 1, currentY],
      [currentX, currentY - 1],
    );
  }

  return group;
}

function dropCells(board, width, height) {
  const next = Array.from({ length: height }, () => Array(width).fill(null));

  for (let x = 0; x < width; x += 1) {
    const cells = [];
    for (let y = height - 1; y >= 0; y -= 1) {
      if (board[y][x]) {
        cells.push(board[y][x]);
      }
    }

    cells.forEach((cell, index) => {
      next[height - 1 - index][x] = cell;
    });
  }

  return next;
}

function compactColumns(board, width, height) {
  const columns = [];

  for (let x = 0; x < width; x += 1) {
    const column = Array.from({ length: height }, (_, y) => board[y][x]);
    if (column.some(Boolean)) {
      columns.push(column);
    }
  }

  const next = Array.from({ length: height }, () => Array(width).fill(null));
  columns.forEach((column, x) => {
    column.forEach((cell, y) => {
      next[y][x] = cell;
    });
  });

  return next;
}

function hasMoves(gameInput) {
  const game = createGame(gameInput);

  for (let y = 0; y < game.height; y += 1) {
    for (let x = 0; x < game.width; x += 1) {
      if (findGroup(game, x, y).length >= 2) {
        return true;
      }
    }
  }

  return false;
}

function finishIfNoMoves(gameInput) {
  const game = createGame(gameInput);
  if (game.status === '완료' || hasMoves(game)) {
    return game;
  }

  return {
    ...game,
    status: '완료',
    message: `더 지울 블록이 없습니다. 최종 점수는 ${game.score}점입니다.`,
  };
}

function removeGroup(gameInput, x, y) {
  const game = createGame(gameInput);
  if (game.status === '완료') {
    return game;
  }

  const group = findGroup(game, x, y);
  if (group.length < 2) {
    return {
      ...game,
      removed: 0,
      message: '붙어 있는 같은 색 블록 2개 이상을 고르세요.',
    };
  }

  const nextBoard = cloneBoard(game.board);
  group.forEach(([cellX, cellY]) => {
    nextBoard[cellY][cellX] = null;
  });

  const dropped = dropCells(nextBoard, game.width, game.height);
  const compacted = compactColumns(dropped, game.width, game.height);
  const nextGame = {
    ...game,
    board: compacted,
    score: game.score + (group.length * group.length),
    removed: group.length,
    message: `블록 ${group.length}개를 지웠습니다.`,
  };

  return finishIfNoMoves(nextGame);
}

const SameGame = {
  DEFAULT_COLORS,
  DEFAULT_HEIGHT,
  DEFAULT_WIDTH,
  compactColumns,
  createGame,
  dropCells,
  findGroup,
  finishIfNoMoves,
  hasMoves,
  removeGroup,
};

if (typeof module !== 'undefined') {
  module.exports = SameGame;
}

if (typeof window !== 'undefined') {
  window.SameGame = SameGame;
}
