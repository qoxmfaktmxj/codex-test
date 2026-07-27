const BOARD_SIZE = 8;

function toCoordinate(value) {
  const coordinate = Math.floor(Number(value));
  if (coordinate >= 0 && coordinate < BOARD_SIZE) {
    return coordinate;
  }
  return null;
}

function normalizeQueens(input) {
  if (!Array.isArray(input)) {
    return [];
  }

  const seen = new Set();
  const queens = [];

  input.forEach((queen) => {
    const x = toCoordinate(queen?.x);
    const y = toCoordinate(queen?.y);
    const key = `${x},${y}`;

    if (x !== null && y !== null && !seen.has(key)) {
      seen.add(key);
      queens.push({ x, y });
    }
  });

  return queens.slice(0, BOARD_SIZE);
}

function getConflictKeys(queens) {
  const conflicts = new Set();

  for (let firstIndex = 0; firstIndex < queens.length; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < queens.length; secondIndex += 1) {
      const first = queens[firstIndex];
      const second = queens[secondIndex];
      const sameRow = first.y === second.y;
      const sameColumn = first.x === second.x;
      const sameDiagonal = Math.abs(first.x - second.x) === Math.abs(first.y - second.y);

      if (sameRow || sameColumn || sameDiagonal) {
        conflicts.add(`${first.x},${first.y}`);
        conflicts.add(`${second.x},${second.y}`);
      }
    }
  }

  return Array.from(conflicts);
}

function getStatusForQueens(queens) {
  const conflicts = getConflictKeys(queens);

  if (queens.length === BOARD_SIZE && conflicts.length === 0) {
    return {
      status: '성공',
      message: '성공입니다. 여덟 퀸이 서로 공격하지 않습니다!',
    };
  }

  if (conflicts.length > 0) {
    return {
      status: '충돌',
      message: '공격 경로가 겹치는 퀸이 있습니다.',
    };
  }

  return {
    status: '진행 중',
    message: queens.length === 0
      ? '여덟 퀸을 서로 공격하지 않게 놓으세요.'
      : `퀸 ${queens.length}개를 놓았습니다. 남은 퀸은 ${BOARD_SIZE - queens.length}개입니다.`,
  };
}

function createGame(options = {}) {
  const queens = normalizeQueens(options.queens);
  const current = getStatusForQueens(queens);

  return {
    size: BOARD_SIZE,
    queens,
    status: options.status || current.status,
    message: options.message || current.message,
  };
}

function countQueens(gameInput) {
  return createGame(gameInput).queens.length;
}

function hasQueen(gameInput, xInput, yInput) {
  const game = createGame(gameInput);
  const x = toCoordinate(xInput);
  const y = toCoordinate(yInput);

  return game.queens.some((queen) => queen.x === x && queen.y === y);
}

function getConflicts(gameInput) {
  return getConflictKeys(createGame(gameInput).queens);
}

function isSafePlacement(gameInput, xInput, yInput) {
  const game = createGame(gameInput);
  const x = toCoordinate(xInput);
  const y = toCoordinate(yInput);

  if (x === null || y === null) {
    return false;
  }

  return game.queens
    .filter((queen) => queen.x !== x || queen.y !== y)
    .every((queen) => (
      queen.x !== x
      && queen.y !== y
      && Math.abs(queen.x - x) !== Math.abs(queen.y - y)
    ));
}

function toggleQueen(gameInput, xInput, yInput) {
  const game = createGame(gameInput);
  const x = toCoordinate(xInput);
  const y = toCoordinate(yInput);

  if (x === null || y === null) {
    return {
      ...game,
      message: '말판 안의 칸을 선택하세요.',
    };
  }

  if (hasQueen(game, x, y)) {
    return createGame({
      queens: game.queens.filter((queen) => queen.x !== x || queen.y !== y),
      message: '퀸을 치웠습니다.',
    });
  }

  if (game.queens.length >= BOARD_SIZE) {
    return {
      ...game,
      message: '퀸은 8개까지만 놓을 수 있습니다.',
    };
  }

  return createGame({
    queens: [...game.queens, { x, y }],
  });
}

const EightQueens = {
  createGame,
  countQueens,
  getConflicts,
  hasQueen,
  isSafePlacement,
  toggleQueen,
};

if (typeof module !== 'undefined') {
  module.exports = EightQueens;
}

if (typeof window !== 'undefined') {
  window.EightQueens = EightQueens;
}
