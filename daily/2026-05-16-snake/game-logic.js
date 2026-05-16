const BOARD_SIZE = 8;
const WIN_LENGTH = 8;

const DIRECTIONS = {
  up: { row: -1, col: 0, label: '위' },
  down: { row: 1, col: 0, label: '아래' },
  left: { row: 0, col: -1, label: '왼쪽' },
  right: { row: 0, col: 1, label: '오른쪽' },
};

const OPPOSITE_DIRECTIONS = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

function cellKey(cell) {
  return `${cell.row}-${cell.col}`;
}

function sameCell(a, b) {
  return a.row === b.row && a.col === b.col;
}

function isInsideBoard(cell) {
  return (
    cell.row >= 0 &&
    cell.row < BOARD_SIZE &&
    cell.col >= 0 &&
    cell.col < BOARD_SIZE
  );
}

function boardCells() {
  const cells = [];
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      cells.push({ row, col });
    }
  }
  return cells;
}

function normalizeCell(cell) {
  if (!cell || !Number.isInteger(cell.row) || !Number.isInteger(cell.col)) {
    return { row: 1, col: 1 };
  }

  return {
    row: Math.min(BOARD_SIZE - 1, Math.max(0, cell.row)),
    col: Math.min(BOARD_SIZE - 1, Math.max(0, cell.col)),
  };
}

function randomFoodCell(random = Math.random) {
  const value = typeof random === 'function' ? random() : Math.random();
  const safeValue = Number.isFinite(value) ? value : 0;
  const index = Math.min(
    BOARD_SIZE * BOARD_SIZE - 1,
    Math.max(0, Math.floor(safeValue * BOARD_SIZE * BOARD_SIZE)),
  );

  return {
    row: Math.floor(index / BOARD_SIZE),
    col: index % BOARD_SIZE,
  };
}

function findFoodCell(snake, picker = randomFoodCell) {
  const occupied = new Set(snake.map(cellKey));

  for (let attempt = 0; attempt < BOARD_SIZE * BOARD_SIZE; attempt += 1) {
    const candidate = normalizeCell(picker());
    if (!occupied.has(cellKey(candidate))) {
      return candidate;
    }
  }

  return boardCells().find((cell) => !occupied.has(cellKey(cell))) || null;
}

function createGame(options = {}) {
  const snake = [
    { row: 4, col: 3 },
    { row: 4, col: 2 },
    { row: 4, col: 1 },
  ];
  const food = options.food ? normalizeCell(options.food) : findFoodCell(snake);

  return {
    snake,
    food,
    direction: 'right',
    status: 'playing',
    score: 0,
    message: '방향을 정하고 먹이를 모으세요.',
  };
}

function turnSnake(game, direction) {
  if (
    game.status !== 'playing' ||
    !DIRECTIONS[direction] ||
    OPPOSITE_DIRECTIONS[game.direction] === direction
  ) {
    return game;
  }

  return {
    ...game,
    direction,
    message: `${directionLabel(direction)}으로 이동합니다.`,
  };
}

function moveSnake(game, foodPicker = randomFoodCell) {
  if (game.status !== 'playing') {
    return game;
  }

  const delta = DIRECTIONS[game.direction];
  const head = game.snake[0];
  const nextHead = {
    row: head.row + delta.row,
    col: head.col + delta.col,
  };

  if (!isInsideBoard(nextHead)) {
    return {
      ...game,
      status: 'lost',
      message: '벽에 부딪혔습니다. 다시 도전하세요.',
    };
  }

  const ateFood = sameCell(nextHead, game.food);
  const bodyToCheck = ateFood ? game.snake : game.snake.slice(0, -1);
  if (bodyToCheck.some((cell) => sameCell(cell, nextHead))) {
    return {
      ...game,
      status: 'lost',
      message: '몸에 부딪혔습니다. 다시 도전하세요.',
    };
  }

  const snake = [nextHead].concat(ateFood ? game.snake : game.snake.slice(0, -1));

  if (ateFood && snake.length >= WIN_LENGTH) {
    return {
      ...game,
      snake,
      status: 'won',
      score: game.score + 1,
      message: `성공! 뱀이 ${WIN_LENGTH}칸까지 자랐습니다.`,
    };
  }

  if (ateFood) {
    return {
      ...game,
      snake,
      food: findFoodCell(snake, foodPicker),
      score: game.score + 1,
      message: `먹이를 먹었습니다. 길이 ${snake.length}입니다.`,
    };
  }

  return {
    ...game,
    snake,
    message: `좋아요. 길이 ${snake.length}입니다.`,
  };
}

function directionLabel(direction) {
  return DIRECTIONS[direction] ? DIRECTIONS[direction].label : '알 수 없음';
}

const gameLogic = {
  BOARD_SIZE,
  WIN_LENGTH,
  DIRECTIONS,
  createGame,
  turnSnake,
  moveSnake,
  cellKey,
  boardCells,
  directionLabel,
};

if (typeof module !== 'undefined') {
  module.exports = gameLogic;
}

if (typeof window !== 'undefined') {
  window.gameLogic = gameLogic;
}
