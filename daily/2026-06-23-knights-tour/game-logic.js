const DEFAULT_SIZE = 5;
const KNIGHT_DELTAS = [
  [1, 2],
  [2, 1],
  [2, -1],
  [1, -2],
  [-1, -2],
  [-2, -1],
  [-2, 1],
  [-1, 2],
];

function toBoardSize(value) {
  const size = Math.floor(Number(value));
  if (size >= 4 && size <= 8) {
    return size;
  }
  return DEFAULT_SIZE;
}

function toCoordinate(value, size, fallback) {
  const coordinate = Math.floor(Number(value));
  if (coordinate >= 0 && coordinate < size) {
    return coordinate;
  }
  return fallback;
}

function createVisited(size, input, knight) {
  const visited = Array.from({ length: size }, (_, y) => (
    Array.from({ length: size }, (_, x) => Boolean(Array.isArray(input?.[y]) && input[y][x]))
  ));
  visited[knight.y][knight.x] = true;
  return visited;
}

function createPath(size, input, knight) {
  const seen = new Set();
  const path = [];

  if (Array.isArray(input)) {
    input.forEach((point) => {
      const x = toCoordinate(point?.x, size, null);
      const y = toCoordinate(point?.y, size, null);
      const key = `${x},${y}`;

      if (x !== null && y !== null && !seen.has(key)) {
        seen.add(key);
        path.push({ x, y });
      }
    });
  }

  const currentKey = `${knight.x},${knight.y}`;
  if (!seen.has(currentKey)) {
    path.push({ ...knight });
  }

  return path;
}

function cloneVisited(visited) {
  return visited.map((row) => [...row]);
}

function countVisited(gameInput) {
  const game = createGame(gameInput);
  return game.visited.flat().filter(Boolean).length;
}

function createGame(options = {}) {
  const size = toBoardSize(options.size);
  const knight = {
    x: toCoordinate(options.startX ?? options.knight?.x, size, 0),
    y: toCoordinate(options.startY ?? options.knight?.y, size, 0),
  };
  const visited = createVisited(size, options.visited, knight);
  const path = createPath(size, options.path, knight);
  const moves = Math.max(0, Math.floor(Number(options.moves)) || 0);
  const status = options.status || '진행 중';

  return {
    size,
    knight,
    visited,
    path,
    moves,
    status,
    message: options.message || '기사를 움직여 모든 칸을 한 번씩 방문하세요.',
  };
}

function isInside(game, x, y) {
  return x >= 0 && x < game.size && y >= 0 && y < game.size;
}

function getLegalMoves(gameInput) {
  const game = createGame(gameInput);

  return KNIGHT_DELTAS
    .map(([dx, dy]) => ({
      x: game.knight.x + dx,
      y: game.knight.y + dy,
    }))
    .filter(({ x, y }) => isInside(game, x, y) && !game.visited[y][x]);
}

function isLegalMove(gameInput, xInput, yInput) {
  const x = Math.floor(Number(xInput));
  const y = Math.floor(Number(yInput));
  return getLegalMoves(gameInput).some((move) => move.x === x && move.y === y);
}

function getVisitNumber(gameInput, xInput, yInput) {
  const game = createGame(gameInput);
  const x = Math.floor(Number(xInput));
  const y = Math.floor(Number(yInput));
  const index = game.path.findIndex((point) => point.x === x && point.y === y);

  return index >= 0 ? index + 1 : '';
}

function finishIfNeeded(gameInput) {
  const game = createGame(gameInput);
  const visitedCount = countVisited(game);
  const total = game.size * game.size;

  if (game.status !== '진행 중') {
    return game;
  }

  if (visitedCount === total) {
    return {
      ...game,
      status: '성공',
      message: '성공입니다. 모든 칸을 한 번씩 방문했습니다!',
    };
  }

  if (getLegalMoves(game).length === 0) {
    return {
      ...game,
      status: '실패',
      message: `더 이동할 곳이 없습니다. ${total}칸 중 ${visitedCount}칸을 방문했습니다.`,
    };
  }

  return game;
}

function moveKnight(gameInput, xInput, yInput) {
  const game = createGame(gameInput);
  const x = Math.floor(Number(xInput));
  const y = Math.floor(Number(yInput));

  if (game.status !== '진행 중') {
    return game;
  }

  if (!isLegalMove(game, x, y)) {
    return {
      ...game,
      message: '기사는 ㄱ자 모양으로만 이동할 수 있습니다.',
    };
  }

  const visited = cloneVisited(game.visited);
  visited[y][x] = true;

  return finishIfNeeded({
    ...game,
    knight: { x, y },
    startX: x,
    startY: y,
    visited,
    path: [...game.path, { x, y }],
    moves: game.moves + 1,
    message: `좋습니다. ${countVisited({ ...game, visited, startX: x, startY: y })}칸을 방문했습니다.`,
  });
}

const KnightsTour = {
  createGame,
  countVisited,
  finishIfNeeded,
  getLegalMoves,
  getVisitNumber,
  isLegalMove,
  moveKnight,
};

if (typeof module !== 'undefined') {
  module.exports = KnightsTour;
}

if (typeof window !== 'undefined') {
  window.KnightsTour = KnightsTour;
}
