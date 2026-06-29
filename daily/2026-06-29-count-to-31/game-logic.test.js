const assert = require('assert');
const CountTo31 = require('./game-logic');

function testCreateGameStartsAtZeroWithPlayerTurn() {
  const game = CountTo31.createGame();

  assert.strictEqual(game.total, 0);
  assert.strictEqual(game.status, '진행 중');
  assert.strictEqual(game.turn, '사람');
  assert.deepStrictEqual(game.history, []);
  assert.strictEqual(game.message, '1부터 3까지 골라 숫자를 이어 부르세요. 31을 부르면 집니다.');
}

function testPlayerMoveAddsCountAndComputerAnswersToSafeTotal() {
  const game = CountTo31.createGame();
  const result = CountTo31.takePlayerMove(game, 1);

  assert.strictEqual(result.total, 2);
  assert.strictEqual(result.status, '진행 중');
  assert.strictEqual(result.turn, '사람');
  assert.deepStrictEqual(result.history, [
    { player: '사람', from: 1, to: 1 },
    { player: '컴퓨터', from: 2, to: 2 },
  ]);
  assert.strictEqual(result.message, '사람: 1. 컴퓨터: 2. 다음 숫자를 고르세요.');
}

function testComputerChoosesWinningReplyWhenPossible() {
  const game = CountTo31.createGame({
    total: 25,
    history: [{ player: '컴퓨터', from: 22, to: 25 }],
  });
  const result = CountTo31.takePlayerMove(game, 2);

  assert.strictEqual(result.total, 30);
  assert.deepStrictEqual(result.history.slice(-2), [
    { player: '사람', from: 26, to: 27 },
    { player: '컴퓨터', from: 28, to: 30 },
  ]);
  assert.strictEqual(result.message, '사람: 26, 27. 컴퓨터: 28, 29, 30. 다음 숫자를 고르세요.');
}

function testPlayerLosesWhenTheyReachThirtyOne() {
  const game = CountTo31.createGame({ total: 28 });
  const result = CountTo31.takePlayerMove(game, 3);

  assert.strictEqual(result.total, 31);
  assert.strictEqual(result.status, '완료');
  assert.strictEqual(result.winner, '컴퓨터');
  assert.strictEqual(result.message, '사람이 29, 30, 31을 불렀습니다. 31을 불러서 컴퓨터 승리!');
}

function testComputerLosesWhenForcedToSayThirtyOne() {
  const game = CountTo31.createGame({ total: 29 });
  const result = CountTo31.takePlayerMove(game, 1);

  assert.strictEqual(result.total, 31);
  assert.strictEqual(result.status, '완료');
  assert.strictEqual(result.winner, '사람');
  assert.deepStrictEqual(result.history.slice(-2), [
    { player: '사람', from: 30, to: 30 },
    { player: '컴퓨터', from: 31, to: 31 },
  ]);
  assert.strictEqual(result.message, '컴퓨터가 31을 불렀습니다. 사람 승리!');
}

function testInvalidMoveIsRejected() {
  const game = CountTo31.createGame();

  assert.throws(() => CountTo31.takePlayerMove(game, 4), /1부터 3까지만/);
}

testCreateGameStartsAtZeroWithPlayerTurn();
testPlayerMoveAddsCountAndComputerAnswersToSafeTotal();
testComputerChoosesWinningReplyWhenPossible();
testPlayerLosesWhenTheyReachThirtyOne();
testComputerLosesWhenForcedToSayThirtyOne();
testInvalidMoveIsRejected();

console.log('서른하나 세기 로직 테스트 통과');
