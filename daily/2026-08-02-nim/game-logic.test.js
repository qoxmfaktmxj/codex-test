const assert = require('assert');
const Nim = require('./game-logic');

function testStartsWithThreeClassicPiles() {
  const game = Nim.createGame();
  assert.deepStrictEqual(game.piles, [3, 4, 5]);
  assert.strictEqual(game.turn, Nim.PLAYER);
  assert.strictEqual(game.status, '진행 중');
}

function testRemovesRequestedCountersFromOnePile() {
  const next = Nim.remove(Nim.createGame(), { pile: 1, count: 3 });
  assert.deepStrictEqual(next.piles, [3, 1, 5]);
  assert.strictEqual(next.turn, Nim.COMPUTER);
}

function testRejectsTakingFromMoreThanOnePileOrTooManyCounters() {
  const game = Nim.createGame();
  assert.throws(() => Nim.remove(game, { pile: 0, count: 4 }), /가져갈 수/);
  assert.throws(() => Nim.remove(game, { pile: 3, count: 1 }), /더미/);
}

function testTakingLastCounterWins() {
  const game = Nim.createGame({ piles: [0, 1, 0] });
  const next = Nim.remove(game, { pile: 1, count: 1 });
  assert.strictEqual(next.status, '승리');
  assert.match(next.message, /마지막 돌/);
}

function testComputerChoosesMoveThatLeavesBalancedNimSum() {
  const game = Nim.createGame({ piles: [1, 6, 5], turn: Nim.COMPUTER });
  assert.deepStrictEqual(Nim.chooseComputerMove(game), { pile: 1, count: 2 });
}

testStartsWithThreeClassicPiles();
testRemovesRequestedCountersFromOnePile();
testRejectsTakingFromMoreThanOnePileOrTooManyCounters();
testTakingLastCounterWins();
testComputerChoosesMoveThatLeavesBalancedNimSum();

console.log('님 로직 테스트 통과');
