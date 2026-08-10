const assert = require('assert');
const BaghChal = require('./game-logic');

function testCreatesTheTraditionalOpening() {
  const game = BaghChal.createGame();
  assert.strictEqual(game.board.length, 25);
  assert.deepStrictEqual([0, 4, 20, 24].map((spot) => game.board[spot]), Array(4).fill(BaghChal.TIGER));
  assert.strictEqual(game.goatsToPlace, 20);
  assert.strictEqual(game.turn, BaghChal.GOAT);
}

function testPlacesGoatsAndChangesTurn() {
  let game = BaghChal.createGame();
  game = BaghChal.placeGoat(game, 12);
  assert.strictEqual(game.board[12], BaghChal.GOAT);
  assert.strictEqual(game.goatsToPlace, 19);
  assert.strictEqual(game.turn, BaghChal.TIGER);
}

function testTigerCanCaptureByJumpingOverAGoat() {
  const game = {
    ...BaghChal.createGame(),
    board: [BaghChal.TIGER, BaghChal.GOAT, null, null, BaghChal.TIGER, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, BaghChal.TIGER, null, null, null, BaghChal.TIGER],
    goatsToPlace: 19,
    turn: BaghChal.TIGER,
  };
  assert.deepStrictEqual(BaghChal.getDestinations(game, 0), [2, 5, 6]);
  const moved = BaghChal.movePiece(game, 0, 2);
  assert.strictEqual(moved.board[1], null);
  assert.strictEqual(moved.board[2], BaghChal.TIGER);
  assert.strictEqual(moved.capturedGoats, 1);
  assert.strictEqual(moved.turn, BaghChal.GOAT);
}

function testGoatsMoveOnlyToAdjacentEmptyPointsAfterPlacement() {
  const game = {
    ...BaghChal.createGame(),
    board: [BaghChal.TIGER, null, null, null, BaghChal.TIGER, null, BaghChal.GOAT, null, null, null, null, null, null, null, null, null, null, null, null, null, BaghChal.TIGER, null, null, null, BaghChal.TIGER],
    goatsToPlace: 0,
    turn: BaghChal.GOAT,
  };
  assert.deepStrictEqual(BaghChal.getDestinations(game, 6), [1, 2, 5, 7, 10, 11, 12]);
  assert.throws(() => BaghChal.movePiece(game, 6, 18), /움직일 수 없습니다/);
}

function testFiveCapturesEndTheGame() {
  const game = {
    ...BaghChal.createGame(),
    board: [BaghChal.TIGER, BaghChal.GOAT, null, null, BaghChal.TIGER, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, BaghChal.TIGER, null, null, null, BaghChal.TIGER],
    goatsToPlace: 15,
    turn: BaghChal.TIGER,
    capturedGoats: 4,
  };
  const moved = BaghChal.movePiece(game, 0, 2);
  assert.strictEqual(moved.status, '종료');
  assert.strictEqual(moved.winner, BaghChal.TIGER);
}

testCreatesTheTraditionalOpening();
testPlacesGoatsAndChangesTurn();
testTigerCanCaptureByJumpingOverAGoat();
testGoatsMoveOnlyToAdjacentEmptyPointsAfterPlacement();
testFiveCapturesEndTheGame();

console.log('호랑이와 염소 로직 테스트 통과');
