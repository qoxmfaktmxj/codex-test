const BOARD_SIZE = 3;
const TOTAL_HOLES = BOARD_SIZE * BOARD_SIZE;
const MAX_MISSES = 5;

function hasOption(options, key) {
  return Object.prototype.hasOwnProperty.call(options, key);
}

function normalizeIndex(index) {
  const value = Number.isInteger(index) ? index : 0;
  return ((value % TOTAL_HOLES) + TOTAL_HOLES) % TOTAL_HOLES;
}

function isValidHoleIndex(index) {
  return Number.isInteger(index) && index >= 0 && index < TOTAL_HOLES;
}

function createGame(options = {}) {
  const moleIndex = hasOption(options, 'moleIndex')
    ? normalizeIndex(options.moleIndex)
    : Math.floor(Math.random() * TOTAL_HOLES);

  return {
    moleIndex,
    score: hasOption(options, 'score') ? options.score : 0,
    misses: hasOption(options, 'misses') ? options.misses : 0,
    round: hasOption(options, 'round') ? options.round : 1,
    status: options.status || '진행 중',
    message: options.message || '두더지를 잡아 보세요!',
    sequence: Array.isArray(options.sequence) ? options.sequence.slice() : [],
  };
}

function isGameOver(game) {
  return game.status !== '진행 중';
}

function pickNextIndex(game) {
  const sequence = Array.isArray(game.sequence) ? game.sequence.slice() : [];

  while (sequence.length > 0) {
    const candidate = normalizeIndex(sequence.shift());
    if (candidate !== game.moleIndex) {
      return { moleIndex: candidate, sequence };
    }
  }

  let candidate = Math.floor(Math.random() * TOTAL_HOLES);
  if (candidate === game.moleIndex) {
    candidate = (candidate + 1) % TOTAL_HOLES;
  }
  return { moleIndex: candidate, sequence };
}

function nextMole(game) {
  if (isGameOver(game)) {
    return game;
  }

  const next = pickNextIndex(game);
  return {
    ...game,
    moleIndex: next.moleIndex,
    sequence: next.sequence,
    round: game.round + 1,
  };
}

function hitHole(game, holeIndex) {
  if (isGameOver(game) || !isValidHoleIndex(holeIndex)) {
    return game;
  }

  const isHit = holeIndex === game.moleIndex;
  const misses = isHit ? game.misses : game.misses + 1;
  const updated = {
    ...game,
    score: isHit ? game.score + 1 : game.score,
    misses,
    message: isHit ? '잡았다!' : '아쉬워요!',
  };

  if (misses >= MAX_MISSES) {
    return {
      ...updated,
      status: '게임 종료',
      message: '게임 종료',
    };
  }

  return nextMole(updated);
}

const gameLogic = {
  BOARD_SIZE,
  TOTAL_HOLES,
  MAX_MISSES,
  createGame,
  hitHole,
  nextMole,
  isGameOver,
  isValidHoleIndex,
};

if (typeof module !== 'undefined') {
  module.exports = gameLogic;
}

if (typeof window !== 'undefined') {
  window.gameLogic = gameLogic;
}
