const assert = require('assert');
const {
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
} = require('./game-logic');

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}`);
    throw error;
  }
}

test('새 게임은 다섯 주사위와 세 번의 굴리기 기회를 준비한다', () => {
  const game = createGame();
  assert.strictEqual(game.dice.length, DICE_COUNT);
  assert.deepStrictEqual(game.holds, [false, false, false, false, false]);
  assert.strictEqual(game.rollsLeft, MAX_ROLLS);
  assert.strictEqual(game.hasRolled, false);
  assert.strictEqual(game.status, '진행 중');
  assert.strictEqual(game.message, '주사위를 굴려 최고의 조합을 만드세요.');
});

test('주사위를 굴리면 고정하지 않은 칸만 바뀌고 기회가 줄어든다', () => {
  const started = createGame({
    dice: [1, 2, 3, 4, 5],
    holds: [true, false, true, false, false],
  });
  const game = rollDice(started, [6, 5, 4]);
  assert.deepStrictEqual(game.dice, [1, 6, 3, 5, 4]);
  assert.deepStrictEqual(game.holds, [true, false, true, false, false]);
  assert.strictEqual(game.rollsLeft, 2);
  assert.strictEqual(game.hasRolled, true);
});

test('굴리기 전에는 주사위를 고정할 수 없다', () => {
  const game = toggleHold(createGame(), 2);
  assert.deepStrictEqual(game.holds, [false, false, false, false, false]);
  assert.strictEqual(game.message, '먼저 한 번 굴린 뒤 주사위를 고정하세요.');
});

test('굴린 뒤에는 원하는 주사위 고정을 바꿀 수 있다', () => {
  const rolled = rollDice(createGame({ dice: [1, 1, 1, 1, 1] }), [2, 3, 4, 5, 6]);
  const game = toggleHold(rolled, 3);
  assert.deepStrictEqual(game.holds, [false, false, false, true, false]);
});

test('점수 계산은 고전 주사위 포커 조합을 판정한다', () => {
  assert.strictEqual(scoreCategory([2, 2, 4, 5, 6], 'pair'), 4);
  assert.strictEqual(scoreCategory([3, 3, 3, 1, 6], 'three'), 9);
  assert.strictEqual(scoreCategory([4, 4, 4, 2, 2], 'fullHouse'), 25);
  assert.strictEqual(scoreCategory([1, 2, 3, 4, 6], 'smallStraight'), 30);
  assert.strictEqual(scoreCategory([2, 3, 4, 5, 6], 'largeStraight'), 40);
  assert.strictEqual(scoreCategory([5, 5, 5, 5, 5], 'yacht'), 50);
  assert.strictEqual(scoreCategory([1, 3, 4, 5, 6], 'chance'), 19);
});

test('가장 높은 조합을 추천한다', () => {
  assert.deepStrictEqual(bestCategory([6, 6, 6, 6, 6]), {
    key: 'yacht',
    label: CATEGORIES.yacht,
    score: 50,
  });
  assert.deepStrictEqual(bestCategory([1, 2, 3, 4, 6]), {
    key: 'smallStraight',
    label: CATEGORIES.smallStraight,
    score: 30,
  });
});

test('조합을 선택하면 점수를 기록하고 게임을 끝낸다', () => {
  const rolled = rollDice(createGame({ dice: [1, 1, 1, 1, 1] }), [4, 4, 4, 2, 2]);
  const game = chooseCategory(rolled, 'fullHouse');
  assert.strictEqual(game.status, '완료');
  assert.strictEqual(game.score, 25);
  assert.strictEqual(game.selectedCategory, 'fullHouse');
  assert.strictEqual(game.message, '풀 하우스로 25점을 기록했습니다.');
});

test('새로 시작하면 상태가 초기화된다', () => {
  const game = resetGame({ dice: [6, 5, 4, 3, 2] });
  assert.deepStrictEqual(game, createGame({ dice: [6, 5, 4, 3, 2] }));
});
