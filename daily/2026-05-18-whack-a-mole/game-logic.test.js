const assert = require('node:assert/strict');
const {
  BOARD_SIZE,
  TOTAL_HOLES,
  MAX_MISSES,
  createGame,
  hitHole,
  nextMole,
  isGameOver,
  isValidHoleIndex,
} = require('./game-logic');

function test(name, fn) {
  try {
    fn();
    console.log(`ok - ${name}`);
  } catch (error) {
    console.error(`not ok - ${name}`);
    throw error;
  }
}

test('새 게임은 3x3 판과 한글 상태를 준비한다', () => {
  const game = createGame({ moleIndex: 4 });

  assert.equal(BOARD_SIZE, 3);
  assert.equal(TOTAL_HOLES, 9);
  assert.equal(MAX_MISSES, 5);
  assert.equal(game.moleIndex, 4);
  assert.equal(game.score, 0);
  assert.equal(game.misses, 0);
  assert.equal(game.round, 1);
  assert.equal(game.status, '진행 중');
});

test('두더지가 있는 구멍을 누르면 점수가 오르고 다음 두더지가 나온다', () => {
  const game = createGame({ moleIndex: 2, sequence: [5] });
  const next = hitHole(game, 2);

  assert.equal(next.score, 1);
  assert.equal(next.misses, 0);
  assert.equal(next.round, 2);
  assert.equal(next.moleIndex, 5);
  assert.equal(next.message, '잡았다!');
});

test('빈 구멍을 누르면 실수가 늘고 다음 두더지가 나온다', () => {
  const game = createGame({ moleIndex: 1, sequence: [7] });
  const next = hitHole(game, 3);

  assert.equal(next.score, 0);
  assert.equal(next.misses, 1);
  assert.equal(next.round, 2);
  assert.equal(next.moleIndex, 7);
  assert.equal(next.message, '아쉬워요!');
});

test('실수가 최대치에 닿으면 게임이 종료된다', () => {
  const game = createGame({ moleIndex: 0, misses: MAX_MISSES - 1 });
  const next = hitHole(game, 8);

  assert.equal(next.status, '게임 종료');
  assert.equal(next.message, '게임 종료');
  assert.equal(isGameOver(next), true);
});

test('유효하지 않은 구멍 번호는 무시한다', () => {
  const game = createGame({ moleIndex: 0, sequence: [3] });

  assert.equal(isValidHoleIndex(0), true);
  assert.equal(isValidHoleIndex(8), true);
  assert.equal(isValidHoleIndex(9), false);
  assert.equal(isValidHoleIndex(NaN), false);
  assert.deepEqual(hitHole(game, NaN), game);
  assert.deepEqual(hitHole(game, 9), game);
});

test('종료된 게임은 더 이상 변하지 않는다', () => {
  const game = createGame({ status: '게임 종료', score: 3, moleIndex: 4 });

  assert.deepEqual(hitHole(game, 4), game);
  assert.deepEqual(nextMole(game), game);
});

test('다음 두더지는 현재 위치와 다른 구멍을 고른다', () => {
  const game = createGame({ moleIndex: 4, sequence: [4, 4, 6] });
  const next = nextMole(game);

  assert.equal(next.moleIndex, 6);
  assert.equal(next.round, 2);
});
