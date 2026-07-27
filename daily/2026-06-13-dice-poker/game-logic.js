const DICE_COUNT = 5;
const MAX_ROLLS = 3;

const CATEGORIES = {
  pair: '한 쌍',
  three: '트리플',
  fullHouse: '풀 하우스',
  smallStraight: '작은 스트레이트',
  largeStraight: '큰 스트레이트',
  yacht: '요트',
  chance: '찬스',
};

function normalizeDie(value) {
  const die = Math.floor(Number(value));
  return die >= 1 && die <= 6 ? die : 1;
}

function createDice(dice) {
  const values = Array.isArray(dice) ? dice.slice(0, DICE_COUNT).map(normalizeDie) : [];
  while (values.length < DICE_COUNT) {
    values.push(1);
  }
  return values;
}

function createHolds(holds) {
  const values = Array.isArray(holds) ? holds.slice(0, DICE_COUNT).map(Boolean) : [];
  while (values.length < DICE_COUNT) {
    values.push(false);
  }
  return values;
}

function normalizeCount(value, fallback) {
  const count = Math.floor(Number(value));
  return Number.isFinite(count) && count >= 0 ? count : fallback;
}

function createGame(options = {}) {
  return {
    dice: createDice(options.dice),
    holds: createHolds(options.holds),
    rollsLeft: normalizeCount(options.rollsLeft, MAX_ROLLS),
    hasRolled: Boolean(options.hasRolled),
    score: normalizeCount(options.score, 0),
    selectedCategory: options.selectedCategory || null,
    status: options.status || '진행 중',
    message: options.message || '주사위를 굴려 최고의 조합을 만드세요.',
  };
}

function nextDie(randomValues, usedIndex) {
  if (Array.isArray(randomValues) && usedIndex < randomValues.length) {
    return normalizeDie(randomValues[usedIndex]);
  }
  return Math.floor(Math.random() * 6) + 1;
}

function rollDice(game, randomValues) {
  if (!game || game.status !== '진행 중') {
    return game;
  }
  if (game.rollsLeft <= 0) {
    return {
      ...game,
      message: '굴리기 기회를 모두 사용했습니다. 조합을 선택하세요.',
    };
  }

  let usedIndex = 0;
  const dice = game.dice.map((die, index) => {
    if (game.holds[index]) {
      return die;
    }
    const rolled = nextDie(randomValues, usedIndex);
    usedIndex += 1;
    return rolled;
  });

  const rollsLeft = game.rollsLeft - 1;
  return {
    ...game,
    dice,
    rollsLeft,
    hasRolled: true,
    message: rollsLeft > 0 ? '남길 주사위를 고르고 다시 굴리세요.' : '마지막 결과입니다. 조합을 선택하세요.',
  };
}

function toggleHold(game, index) {
  if (!game || game.status !== '진행 중') {
    return game;
  }
  if (!game.hasRolled) {
    return {
      ...game,
      message: '먼저 한 번 굴린 뒤 주사위를 고정하세요.',
    };
  }
  if (index < 0 || index >= DICE_COUNT) {
    return game;
  }

  const holds = [...game.holds];
  holds[index] = !holds[index];
  return {
    ...game,
    holds,
    message: holds[index] ? '주사위를 고정했습니다.' : '주사위 고정을 풀었습니다.',
  };
}

function countsByValue(dice) {
  return createDice(dice).reduce((counts, die) => {
    counts[die] = (counts[die] || 0) + 1;
    return counts;
  }, {});
}

function hasRun(values, run) {
  return run.every((value) => values.includes(value));
}

function sumDice(dice) {
  return createDice(dice).reduce((total, die) => total + die, 0);
}

function scoreCategory(dice, category) {
  const values = createDice(dice);
  const counts = countsByValue(values);
  const grouped = Object.entries(counts)
    .map(([value, count]) => ({ value: Number(value), count }))
    .sort((a, b) => b.value - a.value);
  const unique = [...new Set(values)].sort((a, b) => a - b);

  if (category === 'pair') {
    const pair = grouped.find((item) => item.count >= 2);
    return pair ? pair.value * 2 : 0;
  }
  if (category === 'three') {
    const triple = grouped.find((item) => item.count >= 3);
    return triple ? triple.value * 3 : 0;
  }
  if (category === 'fullHouse') {
    const sortedCounts = grouped.map((item) => item.count).sort((a, b) => a - b);
    return sortedCounts.length === 2 && sortedCounts[0] === 2 && sortedCounts[1] === 3 ? 25 : 0;
  }
  if (category === 'smallStraight') {
    return hasRun(unique, [1, 2, 3, 4]) || hasRun(unique, [2, 3, 4, 5]) || hasRun(unique, [3, 4, 5, 6])
      ? 30
      : 0;
  }
  if (category === 'largeStraight') {
    return hasRun(unique, [1, 2, 3, 4, 5]) || hasRun(unique, [2, 3, 4, 5, 6]) ? 40 : 0;
  }
  if (category === 'yacht') {
    return grouped.length === 1 ? 50 : 0;
  }
  if (category === 'chance') {
    return sumDice(values);
  }
  return 0;
}

function bestCategory(dice) {
  return Object.keys(CATEGORIES).reduce(
    (best, key) => {
      const score = scoreCategory(dice, key);
      return score > best.score ? { key, label: CATEGORIES[key], score } : best;
    },
    { key: 'chance', label: CATEGORIES.chance, score: scoreCategory(dice, 'chance') },
  );
}

function chooseCategory(game, category) {
  if (!game || game.status !== '진행 중') {
    return game;
  }
  if (!game.hasRolled) {
    return {
      ...game,
      message: '먼저 주사위를 굴린 뒤 조합을 선택하세요.',
    };
  }
  if (!CATEGORIES[category]) {
    return game;
  }

  const score = scoreCategory(game.dice, category);
  return {
    ...game,
    score,
    selectedCategory: category,
    status: '완료',
    message: `${CATEGORIES[category]}로 ${score}점을 기록했습니다.`,
  };
}

function resetGame(options = {}) {
  return createGame(options);
}

const DicePokerLogic = {
  CATEGORIES,
  DICE_COUNT,
  MAX_ROLLS,
  bestCategory,
  createGame,
  rollDice,
  scoreCategory,
  toggleHold,
  chooseCategory,
  resetGame,
};

if (typeof module !== 'undefined') {
  module.exports = DicePokerLogic;
}

if (typeof window !== 'undefined') {
  window.DicePokerLogic = DicePokerLogic;
}
