const CUP_COUNT = 3;
const DEFAULT_SWAP_COUNT = 5;
const SWAP_PAIRS = [
  [0, 1],
  [1, 2],
  [0, 2],
];

function normalizeCup(value, fallback = 0) {
  const cup = Math.floor(Number(value));
  return cup >= 0 && cup < CUP_COUNT ? cup : fallback;
}

function createCupOrder(cupOrder) {
  if (!Array.isArray(cupOrder) || cupOrder.length !== CUP_COUNT) {
    return [0, 1, 2];
  }

  const seen = new Set();
  const normalized = cupOrder.map((cup) => normalizeCup(cup, -1));
  if (normalized.some((cup) => cup < 0 || seen.has(cup) || !seen.add(cup))) {
    return [0, 1, 2];
  }

  return normalized;
}

function createSwapPlan(options = {}) {
  if (Array.isArray(options.swaps)) {
    return options.swaps.map(([left, right]) => [
      normalizeCup(left),
      normalizeCup(right, 1),
    ]).filter(([left, right]) => left !== right);
  }

  const randomValues = Array.isArray(options.randomValues) ? options.randomValues : [];
  const swapCount = Math.max(
    1,
    Math.floor(Number(options.swapCount)) || randomValues.length || DEFAULT_SWAP_COUNT,
  );

  return Array.from({ length: swapCount }, (_, index) => {
    const randomValue = randomValues[index];
    const pairIndex = randomValue === undefined
      ? Math.floor(Math.random() * SWAP_PAIRS.length)
      : Math.abs(Math.floor(Number(randomValue))) % SWAP_PAIRS.length;
    return [...SWAP_PAIRS[pairIndex]];
  });
}

function createGame(options = {}) {
  const swaps = createSwapPlan(options);
  const status = options.status || '준비';

  return {
    ballCup: normalizeCup(options.ballCup),
    cupOrder: createCupOrder(options.cupOrder),
    swaps,
    currentSwap: Math.max(0, Math.floor(Number(options.currentSwap)) || 0),
    selectedCup: options.selectedCup === null || options.selectedCup === undefined
      ? null
      : normalizeCup(options.selectedCup),
    correctCup: options.correctCup === null || options.correctCup === undefined
      ? null
      : normalizeCup(options.correctCup),
    status,
    message: options.message || (status === '준비'
      ? '공의 위치를 기억한 뒤 섞기를 누르세요.'
      : status === '추리 중'
        ? '공이 숨어 있는 컵을 고르세요.'
        : '컵을 섞고 있습니다.'),
  };
}

function swapPositions(cupOrder, left, right) {
  const nextOrder = createCupOrder(cupOrder);
  const safeLeft = normalizeCup(left);
  const safeRight = normalizeCup(right, 1);
  const temp = nextOrder[safeLeft];
  nextOrder[safeLeft] = nextOrder[safeRight];
  nextOrder[safeRight] = temp;
  return nextOrder;
}

function applyNextSwap(game) {
  const current = createGame(game);

  if (!['준비', '섞는 중'].includes(current.status) || current.currentSwap >= current.swaps.length) {
    return {
      ...current,
      status: '추리 중',
      message: '공이 숨어 있는 컵을 고르세요.',
    };
  }

  const [left, right] = current.swaps[current.currentSwap];
  const nextSwap = current.currentSwap + 1;
  const done = nextSwap >= current.swaps.length;

  return {
    ...current,
    cupOrder: swapPositions(current.cupOrder, left, right),
    currentSwap: nextSwap,
    status: done ? '추리 중' : '섞는 중',
    message: done ? '공이 숨어 있는 컵을 고르세요.' : '컵을 섞고 있습니다.',
  };
}

function getBallPosition(game) {
  const current = createGame(game);
  const position = current.cupOrder.indexOf(current.ballCup);
  return position >= 0 ? position : 0;
}

function guessCup(game, position) {
  const current = createGame(game);

  if (current.status !== '추리 중') {
    return current;
  }

  const selectedCup = normalizeCup(position);
  const correctCup = getBallPosition(current);
  const correct = selectedCup === correctCup;

  return {
    ...current,
    selectedCup,
    correctCup,
    status: correct ? '정답' : '오답',
    message: correct
      ? '정답입니다! 공을 정확히 찾았습니다.'
      : `아쉽습니다. 공은 ${correctCup + 1}번 컵 아래에 있었습니다.`,
  };
}

function resetGame(options = {}) {
  const randomValue = options.ballRandom === undefined ? Math.random() : Number(options.ballRandom);
  return createGame({
    ...options,
    ballCup: normalizeCup(Math.floor(randomValue * CUP_COUNT)),
    cupOrder: [0, 1, 2],
    currentSwap: 0,
    selectedCup: null,
    correctCup: null,
    status: '준비',
  });
}

const ShellGame = {
  CUP_COUNT,
  DEFAULT_SWAP_COUNT,
  SWAP_PAIRS,
  applyNextSwap,
  createGame,
  createSwapPlan,
  getBallPosition,
  guessCup,
  resetGame,
  swapPositions,
};

if (typeof module !== 'undefined') {
  module.exports = ShellGame;
}

if (typeof window !== 'undefined') {
  window.ShellGame = ShellGame;
}
