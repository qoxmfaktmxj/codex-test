const assert = require('assert');
const MuTorere = require('./game-logic');

function testStartsWithFourPiecesPerPlayerAndPlayerTurn() {
  const game = MuTorere.createGame();

  assert.deepStrictEqual(game.board, [MuTorere.PLAYER, MuTorere.PLAYER, MuTorere.PLAYER, MuTorere.PLAYER, MuTorere.EMPTY, MuTorere.COMPUTER, MuTorere.COMPUTER, MuTorere.COMPUTER, MuTorere.COMPUTER]);
  assert.strictEqual(game.turn, MuTorere.PLAYER);
  assert.strictEqual(game.status, '진행 중');
}

function testAllowsAnOuterPieceToMoveIntoTheEmptyCenter() {
  const game = MuTorere.createGame();

  assert.deepStrictEqual(MuTorere.availableMoves(game), [{ from: 0, to: 4 }, { from: 1, to: 4 }, { from: 2, to: 4 }, { from: 3, to: 4 }]);
  const next = MuTorere.applyMove(game, { from: 2, to: 4 });
  assert.strictEqual(next.board[2], MuTorere.EMPTY);
  assert.strictEqual(next.board[4], MuTorere.PLAYER);
  assert.strictEqual(next.turn, MuTorere.COMPUTER);
}

function testAllowsCenterPieceToMoveToAdjacentOuterSpacesOnly() {
  const game = MuTorere.createGame({
    board: [MuTorere.COMPUTER, MuTorere.PLAYER, MuTorere.PLAYER, MuTorere.COMPUTER, MuTorere.PLAYER, MuTorere.EMPTY, MuTorere.COMPUTER, MuTorere.PLAYER, MuTorere.COMPUTER],
    turn: MuTorere.PLAYER,
  });

  assert.deepStrictEqual(MuTorere.availableMoves(game), [{ from: 4, to: 5 }]);
  assert.throws(() => MuTorere.applyMove(game, { from: 1, to: 5 }), /인접/);
}

function testDeclaresVictoryWhenOpponentHasNoLegalMove() {
  const game = MuTorere.createGame({
    board: [MuTorere.PLAYER, MuTorere.EMPTY, MuTorere.COMPUTER, MuTorere.COMPUTER, MuTorere.PLAYER, MuTorere.COMPUTER, MuTorere.COMPUTER, MuTorere.PLAYER, MuTorere.PLAYER],
    turn: MuTorere.PLAYER,
  });
  const next = MuTorere.applyMove(game, { from: 0, to: 1 });

  assert.strictEqual(next.status, '승리');
  assert.match(next.message, /움직일 수 없어/);
}

function testComputerChoosesAnImmediateWinningMove() {
  const game = MuTorere.createGame();
  const computerGame = { ...game, turn: MuTorere.COMPUTER };

  assert.deepStrictEqual(MuTorere.chooseComputerMove(computerGame), { from: 6, to: 4 });
}

testStartsWithFourPiecesPerPlayerAndPlayerTurn();
testAllowsAnOuterPieceToMoveIntoTheEmptyCenter();
testAllowsCenterPieceToMoveToAdjacentOuterSpacesOnly();
testDeclaresVictoryWhenOpponentHasNoLegalMove();
testComputerChoosesAnImmediateWinningMove();

console.log('무 토레레 로직 테스트 통과');
