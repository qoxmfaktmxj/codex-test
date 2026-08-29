const assert = require('assert');
const Morris = require('./game-logic');

function testStartsWithAnEmptyBoardAndSixPiecesToPlace() {
  const state = Morris.createState();
  assert.strictEqual(state.board.length, 16);
  assert.strictEqual(state.turn, 'black');
  assert.deepStrictEqual(state.toPlace, { black: 6, white: 6 });
}

function testPlacesPiecesAndChangesTurn() {
  const state = Morris.createState();
  const moved = Morris.play(state, 0);
  assert.strictEqual(moved.board[0], 'black');
  assert.strictEqual(moved.toPlace.black, 5);
  assert.strictEqual(moved.turn, 'white');
  assert.throws(() => Morris.play(moved, 0), /비어 있지/);
}

function testRequiresAnAdjacentMoveAfterPlacement() {
  const state = Morris.createState({
    board: ['black', null, null, null, null, null, null, null, 'black', 'black', null, null, null, 'white', 'white', 'white'],
    turn: 'black', toPlace: { black: 0, white: 0 },
  });
  const moved = Morris.play(state, 0, 1);
  assert.strictEqual(moved.board[0], null);
  assert.strictEqual(moved.board[1], 'black');
  assert.throws(() => Morris.play(state, 0, 10), /인접/);
}

function testRemovesAnOpponentsPieceAfterMakingAMill() {
  const state = Morris.createState({
    board: ['black', 'black', null, 'black', 'white', 'white', 'white', null, null, null, null, null, null, null, null, null],
    turn: 'black', toPlace: { black: 0, white: 0 },
  });
  const milled = Morris.play(state, 3, 2);
  assert.strictEqual(milled.pendingRemoval, true);
  const removed = Morris.play(milled, 4);
  assert.strictEqual(removed.board[4], null);
  assert.strictEqual(removed.turn, 'white');
}

function testDeclaresVictoryWhenOpponentHasFewerThanThreePieces() {
  const state = Morris.createState({
    board: ['black', 'black', 'black', null, null, null, null, null, null, null, null, null, null, null, null, 'white'],
    turn: 'black', toPlace: { black: 0, white: 0 },
  });
  assert.strictEqual(Morris.getStatus(state), 'black-won');
}

function testDeclaresVictoryWhenOpponentCannotMove() {
  const state = Morris.createState({
    board: ['white', 'black', 'white', 'black', 'white', 'black', null, 'black', 'black', null, null, null, null, null, null, null],
    turn: 'white', toPlace: { black: 0, white: 0 },
  });
  assert.strictEqual(Morris.getStatus(state), 'black-won');
}

testStartsWithAnEmptyBoardAndSixPiecesToPlace();
testPlacesPiecesAndChangesTurn();
testRequiresAnAdjacentMoveAfterPlacement();
testRemovesAnOpponentsPieceAfterMakingAMill();
testDeclaresVictoryWhenOpponentHasFewerThanThreePieces();
testDeclaresVictoryWhenOpponentCannotMove();
console.log('여섯 남자 모리스 로직 테스트 통과');
