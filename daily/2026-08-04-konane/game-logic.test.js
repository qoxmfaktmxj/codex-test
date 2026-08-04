const assert = require('assert');
const Konane = require('./game-logic');

function testCreatesAnAlternatingBoardAndOpeningRemoval() {
  const game = Konane.createGame();

  assert.strictEqual(game.board.length, 16);
  assert.strictEqual(game.board[0], Konane.PLAYER);
  assert.strictEqual(game.board[1], Konane.COMPUTER);
  assert.deepStrictEqual(Konane.legalMoves(game).map((move) => move.from), [5, 10]);
  assert.strictEqual(game.phase, '시작 제거');
}

function testOnlyAllowsThePlayerToRemoveACentralPieceAtTheStart() {
  const game = Konane.createGame();
  const next = Konane.applyMove(game, { from: 5 });

  assert.strictEqual(next.board[5], Konane.EMPTY);
  assert.strictEqual(next.turn, Konane.COMPUTER);
  assert.strictEqual(next.phase, '상대 제거');
  assert.throws(() => Konane.applyMove(game, { from: 0 }), /가운데/);
}

function testComputerRemovesTheAdjacentCentralOpponentPiece() {
  const afterPlayer = Konane.applyMove(Konane.createGame(), { from: 5 });
  const move = Konane.chooseComputerMove(afterPlayer);
  const afterComputer = Konane.applyMove(afterPlayer, move);

  assert.deepStrictEqual(move, { from: 6 });
  assert.strictEqual(afterComputer.board[6], Konane.EMPTY);
  assert.strictEqual(afterComputer.phase, '도약');
  assert.strictEqual(afterComputer.turn, Konane.PLAYER);
}

function testFindsAndAppliesAnOrthogonalJump() {
  const board = [Konane.PLAYER, Konane.COMPUTER, Konane.EMPTY, Konane.EMPTY,
    Konane.EMPTY, Konane.EMPTY, Konane.EMPTY, Konane.EMPTY,
    Konane.EMPTY, Konane.EMPTY, Konane.EMPTY, Konane.EMPTY,
    Konane.EMPTY, Konane.EMPTY, Konane.EMPTY, Konane.EMPTY];
  const game = Konane.createGame({ board, turn: Konane.PLAYER, phase: '도약' });

  assert.deepStrictEqual(Konane.legalMoves(game), [{ from: 0, to: 2, jumped: 1 }]);
  const next = Konane.applyMove(game, { from: 0, to: 2 });
  assert.deepStrictEqual(next.board.slice(0, 3), [Konane.EMPTY, Konane.EMPTY, Konane.PLAYER]);
  assert.strictEqual(next.turn, Konane.COMPUTER);
}

function testRejectsDiagonalAndNonCapturingJumps() {
  const board = [Konane.PLAYER, Konane.EMPTY, Konane.EMPTY, Konane.EMPTY,
    Konane.EMPTY, Konane.COMPUTER, Konane.EMPTY, Konane.EMPTY,
    Konane.EMPTY, Konane.EMPTY, Konane.EMPTY, Konane.EMPTY,
    Konane.EMPTY, Konane.EMPTY, Konane.EMPTY, Konane.EMPTY];
  const game = Konane.createGame({ board, turn: Konane.PLAYER, phase: '도약' });

  assert.throws(() => Konane.applyMove(game, { from: 0, to: 2 }), /뛰어넘을 상대 말/);
  assert.throws(() => Konane.applyMove(game, { from: 0, to: 10 }), /가로 또는 세로/);
}

function testWinsWhenTheOpponentHasNoJumpAfterAMove() {
  const board = [Konane.PLAYER, Konane.COMPUTER, Konane.EMPTY, Konane.EMPTY,
    Konane.EMPTY, Konane.EMPTY, Konane.EMPTY, Konane.EMPTY,
    Konane.EMPTY, Konane.EMPTY, Konane.EMPTY, Konane.EMPTY,
    Konane.EMPTY, Konane.EMPTY, Konane.EMPTY, Konane.EMPTY];
  const game = Konane.createGame({ board, turn: Konane.PLAYER, phase: '도약' });
  const next = Konane.applyMove(game, { from: 0, to: 2 });

  assert.strictEqual(next.status, '승리');
  assert.match(next.message, /상대가 뛰어넘을 수 없습니다/);
}

testCreatesAnAlternatingBoardAndOpeningRemoval();
testOnlyAllowsThePlayerToRemoveACentralPieceAtTheStart();
testComputerRemovesTheAdjacentCentralOpponentPiece();
testFindsAndAppliesAnOrthogonalJump();
testRejectsDiagonalAndNonCapturingJumps();
testWinsWhenTheOpponentHasNoJumpAfterAMove();

console.log('코나네 로직 테스트 통과');
