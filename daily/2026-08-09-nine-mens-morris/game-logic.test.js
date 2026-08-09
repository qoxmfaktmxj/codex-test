const assert = require('assert');
const Morris = require('./game-logic');

function place(game, positions) {
  return positions.reduce((state, position) => Morris.placePiece(state, position), game);
}

function testCreatesAPlacementBoard() {
  const game = Morris.createGame();
  assert.strictEqual(game.board.length, 24);
  assert.strictEqual(game.turn, Morris.PLAYER);
  assert.strictEqual(game.reserve[Morris.PLAYER], 9);
  assert.deepStrictEqual(Morris.getLegalMoves(game), Array.from({ length: 24 }, (_, index) => index));
}

function testAlternatesPlacementAndDetectsAMill() {
  let game = Morris.createGame();
  game = place(game, [0, 3, 1, 4, 2]);
  assert.strictEqual(game.phase, '잡기');
  assert.strictEqual(game.turn, Morris.PLAYER);
  assert.strictEqual(game.board[2], Morris.PLAYER);
  assert.strictEqual(Morris.isMill(game.board, 0, Morris.PLAYER), true);
}

function testRemovesAnOpponentPieceAfterAMill() {
  let game = Morris.createGame();
  game = place(game, [0, 3, 1, 4, 2]);
  game = Morris.removePiece(game, 3);
  assert.strictEqual(game.board[3], null);
  assert.strictEqual(game.turn, Morris.COMPUTER);
  assert.strictEqual(game.phase, '놓기');
}

function testMovesAlongALineAfterAllPiecesArePlaced() {
  const game = {
    ...Morris.createGame(),
    board: [Morris.PLAYER, null, null, Morris.COMPUTER, null, null, Morris.PLAYER, null, null, Morris.COMPUTER, null, null, Morris.PLAYER, null, null, Morris.COMPUTER, null, null, Morris.PLAYER, null, null, Morris.COMPUTER, null, null],
    reserve: { [Morris.PLAYER]: 0, [Morris.COMPUTER]: 0 },
  };
  assert.deepStrictEqual(Morris.getMoveDestinations(game, 0), [1]);
  const moved = Morris.movePiece(game, 0, 1);
  assert.strictEqual(moved.board[0], null);
  assert.strictEqual(moved.board[1], Morris.PLAYER);
  assert.strictEqual(moved.turn, Morris.COMPUTER);
}

function testRejectsInvalidMovesAndProtectsMillsWhenPossible() {
  let game = Morris.createGame();
  game = Morris.placePiece(game, 0);
  assert.throws(() => Morris.placePiece(game, 0), /놓을 수 없는/);
  game = place(Morris.createGame(), [0, 3, 1, 4, 2]);
  assert.throws(() => Morris.removePiece(game, 0), /자기 말을/);
}

testCreatesAPlacementBoard();
testAlternatesPlacementAndDetectsAMill();
testRemovesAnOpponentPieceAfterAMill();
testMovesAlongALineAfterAllPiecesArePlaced();
testRejectsInvalidMovesAndProtectsMillsWhenPossible();

console.log('아홉 남자 모리스 로직 테스트 통과');
