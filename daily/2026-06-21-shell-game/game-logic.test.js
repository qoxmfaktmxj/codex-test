const assert = require('assert');
const ShellGame = require('./game-logic');

function testCreateGameUsesFirstSwapPlan() {
  const game = ShellGame.createGame({
    randomValues: [0, 1, 2],
  });

  assert.strictEqual(game.ballCup, 0);
  assert.strictEqual(game.status, '준비');
  assert.deepStrictEqual(game.swaps, [
    [0, 1],
    [1, 2],
    [0, 2],
  ]);
  assert.deepStrictEqual(game.cupOrder, [0, 1, 2]);
  assert.strictEqual(game.message, '공의 위치를 기억한 뒤 섞기를 누르세요.');
}

function testApplyNextSwapMovesCupOrder() {
  const game = ShellGame.createGame({
    ballCup: 2,
    swaps: [
      [0, 2],
      [1, 2],
    ],
  });

  const afterFirst = ShellGame.applyNextSwap(game);
  assert.deepStrictEqual(afterFirst.cupOrder, [2, 1, 0]);
  assert.strictEqual(afterFirst.currentSwap, 1);
  assert.strictEqual(afterFirst.status, '섞는 중');

  const afterSecond = ShellGame.applyNextSwap(afterFirst);
  assert.deepStrictEqual(afterSecond.cupOrder, [2, 0, 1]);
  assert.strictEqual(afterSecond.currentSwap, 2);
  assert.strictEqual(afterSecond.status, '추리 중');
  assert.strictEqual(ShellGame.getBallPosition(afterSecond), 0);
}

function testGuessFindsBallAfterShuffle() {
  const game = ShellGame.createGame({
    ballCup: 1,
    swaps: [
      [0, 1],
      [1, 2],
    ],
  });
  const ready = ShellGame.applyNextSwap(ShellGame.applyNextSwap(game));

  const result = ShellGame.guessCup(ready, 0);

  assert.strictEqual(result.status, '정답');
  assert.strictEqual(result.selectedCup, 0);
  assert.strictEqual(result.message, '정답입니다! 공을 정확히 찾았습니다.');
}

function testWrongGuessRevealsCorrectCup() {
  const game = ShellGame.createGame({
    ballCup: 0,
    swaps: [[0, 2]],
  });
  const ready = ShellGame.applyNextSwap(game);

  const result = ShellGame.guessCup(ready, 0);

  assert.strictEqual(result.status, '오답');
  assert.strictEqual(result.selectedCup, 0);
  assert.strictEqual(result.correctCup, 2);
  assert.strictEqual(result.message, '아쉽습니다. 공은 3번 컵 아래에 있었습니다.');
}

function testCannotGuessBeforeShuffleEnds() {
  const game = ShellGame.createGame({
    status: '섞는 중',
    swaps: [[0, 1]],
  });

  const result = ShellGame.guessCup(game, 1);

  assert.strictEqual(result.status, '섞는 중');
  assert.strictEqual(result.selectedCup, null);
}

testCreateGameUsesFirstSwapPlan();
testApplyNextSwapMovesCupOrder();
testGuessFindsBallAfterShuffle();
testWrongGuessRevealsCorrectCup();
testCannotGuessBeforeShuffleEnds();

console.log('컵 속 공 찾기 로직 테스트 통과');
