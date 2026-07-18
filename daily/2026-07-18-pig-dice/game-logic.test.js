const assert = require('assert');
const PigDice = require('./game-logic');

function testCreatesDefaultGame() {
  const game = PigDice.createGame();

  assert.deepStrictEqual(game.scores, [0, 0]);
  assert.strictEqual(game.currentPlayer, 0);
  assert.strictEqual(game.turnTotal, 0);
  assert.strictEqual(game.status, '진행 중');
  assert.strictEqual(game.winner, null);
  assert.match(game.message, /플레이어 1/);
}

function testRollingAddsToTurnTotal() {
  const game = PigDice.createGame();
  const next = PigDice.rollDie(game, () => 0.49);

  assert.strictEqual(next.lastRoll, 3);
  assert.strictEqual(next.turnTotal, 3);
  assert.deepStrictEqual(next.scores, [0, 0]);
  assert.strictEqual(next.currentPlayer, 0);
}

function testRollingOneLosesTurn() {
  const game = PigDice.createGame({ scores: [8, 10], currentPlayer: 0, turnTotal: 5 });
  const next = PigDice.rollDie(game, () => 0);

  assert.strictEqual(next.lastRoll, 1);
  assert.strictEqual(next.turnTotal, 0);
  assert.deepStrictEqual(next.scores, [8, 10]);
  assert.strictEqual(next.currentPlayer, 1);
  assert.match(next.message, /1이 나와/);
}

function testHoldBanksTurnAndPasses() {
  const game = PigDice.createGame({ scores: [12, 7], currentPlayer: 1, turnTotal: 9 });
  const next = PigDice.holdTurn(game);

  assert.deepStrictEqual(next.scores, [12, 16]);
  assert.strictEqual(next.turnTotal, 0);
  assert.strictEqual(next.currentPlayer, 0);
  assert.strictEqual(next.status, '진행 중');
  assert.match(next.message, /플레이어 2/);
}

function testHoldWinsAtTargetScore() {
  const game = PigDice.createGame({ scores: [27, 20], currentPlayer: 0, turnTotal: 3, targetScore: 30 });
  const next = PigDice.holdTurn(game);

  assert.deepStrictEqual(next.scores, [30, 20]);
  assert.strictEqual(next.status, '승리');
  assert.strictEqual(next.winner, 0);
  assert.match(next.message, /승리/);
}

function testCannotActAfterGameEnds() {
  const game = PigDice.createGame({ scores: [30, 18], status: '승리', winner: 0 });

  assert.throws(() => PigDice.rollDie(game, () => 0.5), /이미 끝난/);
  assert.throws(() => PigDice.holdTurn(game), /이미 끝난/);
}

testCreatesDefaultGame();
testRollingAddsToTurnTotal();
testRollingOneLosesTurn();
testHoldBanksTurnAndPasses();
testHoldWinsAtTargetScore();
testCannotActAfterGameEnds();

console.log('돼지 주사위 로직 테스트 통과');
