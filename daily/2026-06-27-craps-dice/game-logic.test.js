const assert = require('assert');
const CrapsDice = require('./game-logic');

function testCreateGameStartsOnComeOutRoll() {
  const game = CrapsDice.createGame();

  assert.strictEqual(game.phase, 'come-out');
  assert.strictEqual(game.point, null);
  assert.strictEqual(game.status, '진행 중');
  assert.strictEqual(game.message, '첫 굴림에서 7이나 11이 나오면 승리합니다.');
  assert.strictEqual(game.rolls.length, 0);
}

function testComeOutNaturalWinsImmediately() {
  const game = CrapsDice.rollDice(CrapsDice.createGame(), [5, 6]);

  assert.strictEqual(game.status, '승리');
  assert.strictEqual(game.phase, 'finished');
  assert.strictEqual(game.message, '합계 11입니다. 첫 굴림 승리!');
  assert.deepStrictEqual(game.rolls[0], { dice: [5, 6], total: 11, label: '첫 굴림' });
}

function testComeOutCrapsLosesImmediately() {
  const game = CrapsDice.rollDice(CrapsDice.createGame(), [1, 1]);

  assert.strictEqual(game.status, '패배');
  assert.strictEqual(game.phase, 'finished');
  assert.strictEqual(game.message, '합계 2입니다. 크랩스로 패배했습니다.');
}

function testComeOutSetsPointForOtherTotals() {
  const game = CrapsDice.rollDice(CrapsDice.createGame(), [4, 2]);

  assert.strictEqual(game.status, '진행 중');
  assert.strictEqual(game.phase, 'point');
  assert.strictEqual(game.point, 6);
  assert.strictEqual(game.message, '포인트는 6입니다. 7이 나오기 전에 6을 다시 만드세요.');
}

function testPointPhaseWinsByRollingPoint() {
  const pointGame = CrapsDice.rollDice(CrapsDice.createGame(), [4, 2]);
  const won = CrapsDice.rollDice(pointGame, [3, 3]);

  assert.strictEqual(won.status, '승리');
  assert.strictEqual(won.phase, 'finished');
  assert.strictEqual(won.message, '포인트 6을 다시 만들었습니다. 승리!');
  assert.strictEqual(won.rolls.length, 2);
}

function testPointPhaseLosesByRollingSeven() {
  const pointGame = CrapsDice.rollDice(CrapsDice.createGame(), [5, 3]);
  const lost = CrapsDice.rollDice(pointGame, [4, 3]);

  assert.strictEqual(lost.status, '패배');
  assert.strictEqual(lost.phase, 'finished');
  assert.strictEqual(lost.message, '7이 나왔습니다. 포인트 전에 7이 나와 패배했습니다.');
}

function testIgnoresRollAfterFinishedAndRejectsBadDice() {
  const won = CrapsDice.rollDice(CrapsDice.createGame(), [6, 5]);
  const afterFinish = CrapsDice.rollDice(won, [1, 1]);

  assert.strictEqual(afterFinish.message, '게임이 끝났습니다. 새 판을 시작하세요.');
  assert.strictEqual(afterFinish.rolls.length, 1);
  assert.throws(() => CrapsDice.rollDice(CrapsDice.createGame(), [0, 7]), /주사위 값/);
}

testCreateGameStartsOnComeOutRoll();
testComeOutNaturalWinsImmediately();
testComeOutCrapsLosesImmediately();
testComeOutSetsPointForOtherTotals();
testPointPhaseWinsByRollingPoint();
testPointPhaseLosesByRollingSeven();
testIgnoresRollAfterFinishedAndRejectsBadDice();

console.log('크랩스 주사위 로직 테스트 통과');
