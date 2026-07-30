const assert = require('assert');
const Senet = require('./game-logic');

function testCreatesThreeTokensPerPlayer() {
  const game = Senet.createGame();

  assert.deepStrictEqual(game.board.slice(0, 6), [Senet.PLAYER, Senet.COMPUTER, Senet.PLAYER, Senet.COMPUTER, Senet.PLAYER, Senet.COMPUTER]);
  assert.strictEqual(game.turn, Senet.PLAYER);
  assert.strictEqual(game.home.player, 0);
  assert.strictEqual(game.status, '진행 중');
}

function testListsOnlyMovesThatFitOnTheTrack() {
  const game = Senet.createGame({
    board: [Senet.PLAYER, Senet.EMPTY, Senet.EMPTY, Senet.EMPTY, Senet.EMPTY, Senet.EMPTY, Senet.EMPTY, Senet.EMPTY, Senet.EMPTY, Senet.EMPTY, Senet.EMPTY, Senet.PLAYER],
    turn: Senet.PLAYER,
  });

  assert.deepStrictEqual(Senet.availableMoves(game, 2), [{ from: 0, to: 2 }]);
}

function testMovesAndCapturesAnOpponentBySwappingPlaces() {
  const game = Senet.createGame({
    board: [Senet.PLAYER, Senet.EMPTY, Senet.COMPUTER, Senet.EMPTY, Senet.EMPTY, Senet.EMPTY, Senet.EMPTY, Senet.EMPTY, Senet.EMPTY, Senet.EMPTY, Senet.EMPTY, Senet.EMPTY],
    turn: Senet.PLAYER,
  });
  const next = Senet.moveToken(game, 0, 2, 2);

  assert.strictEqual(next.board[0], Senet.COMPUTER);
  assert.strictEqual(next.board[2], Senet.PLAYER);
  assert.strictEqual(next.turn, Senet.COMPUTER);
}

function testDoesNotAllowCaptureOfAProtectedPair() {
  const game = Senet.createGame({
    board: [Senet.PLAYER, Senet.EMPTY, Senet.COMPUTER, Senet.COMPUTER, Senet.EMPTY, Senet.EMPTY, Senet.EMPTY, Senet.EMPTY, Senet.EMPTY, Senet.EMPTY, Senet.EMPTY, Senet.EMPTY],
    turn: Senet.PLAYER,
  });

  assert.throws(() => Senet.moveToken(game, 0, 2, 2), /보호/);
}

function testSendsTokenHomeAndAwardsWinWhenAllTokensLeave() {
  const game = Senet.createGame({
    board: [Senet.EMPTY, Senet.EMPTY, Senet.EMPTY, Senet.EMPTY, Senet.EMPTY, Senet.EMPTY, Senet.EMPTY, Senet.EMPTY, Senet.EMPTY, Senet.EMPTY, Senet.EMPTY, Senet.PLAYER],
    turn: Senet.PLAYER,
    home: { player: 2, computer: 0 },
  });
  const next = Senet.moveToken(game, 11, 1, 1);

  assert.strictEqual(next.board[11], Senet.EMPTY);
  assert.strictEqual(next.home.player, 3);
  assert.strictEqual(next.status, '승리');
  assert.match(next.message, /모든 말을/);
}

function testKeepsTurnAfterFourOrFive() {
  const game = Senet.createGame({ roll: 4 });
  const next = Senet.moveToken(game, 2, 4, 4);

  assert.strictEqual(next.turn, Senet.PLAYER);
  assert.match(next.message, /한 번 더/);
}

testCreatesThreeTokensPerPlayer();
testListsOnlyMovesThatFitOnTheTrack();
testMovesAndCapturesAnOpponentBySwappingPlaces();
testDoesNotAllowCaptureOfAProtectedPair();
testSendsTokenHomeAndAwardsWinWhenAllTokensLeave();
testKeepsTurnAfterFourOrFive();

console.log('세네트 로직 테스트 통과');
