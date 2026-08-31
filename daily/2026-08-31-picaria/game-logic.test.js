const assert = require('assert');
const Picaria = require('./game-logic');

function testStartsWithAnEmptyPlacementBoard() {
  const state = Picaria.createState();
  assert.deepStrictEqual(state.board, Array(9).fill(null));
  assert.strictEqual(state.turn, 'blue');
  assert.strictEqual(Picaria.getPhase(state), 'placing');
}

function testPlayersPlaceThreePiecesEachThenMove() {
  let state = Picaria.createState();
  [0, 1, 4, 2, 7, 6].forEach((index) => { state = Picaria.place(state, index); });
  assert.deepStrictEqual(state.board, ['blue', 'orange', 'orange', null, 'blue', null, 'orange', 'blue', null]);
  assert.strictEqual(state.turn, 'blue');
  assert.strictEqual(Picaria.getPhase(state), 'moving');
  assert.throws(() => Picaria.place(state, 3), /움직이/);
}

function testMovesAlongConnectedLinesAndRejectsInvalidMoves() {
  const state = Picaria.createState({
    board: ['blue', 'orange', 'orange', null, 'blue', null, 'orange', 'blue', null],
    turn: 'blue',
  });
  const next = Picaria.move(state, 0, 3);
  assert.strictEqual(next.board[0], null);
  assert.strictEqual(next.board[3], 'blue');
  assert.strictEqual(next.turn, 'orange');
  assert.throws(() => Picaria.move(state, 0, 5), /연결/);
  assert.throws(() => Picaria.move(state, 1, 3), /내 말/);
}

function testDeclaresThreeInARowWinner() {
  const state = Picaria.createState({
    board: ['blue', 'blue', null, null, 'orange', null, 'orange', 'orange', null],
    turn: 'blue',
  });
  const next = Picaria.place(state, 2);
  assert.strictEqual(Picaria.getStatus(next), 'blue-won');
  assert.throws(() => Picaria.move(next, 0, 3), /끝났/);
}

testStartsWithAnEmptyPlacementBoard();
testPlayersPlaceThreePiecesEachThenMove();
testMovesAlongConnectedLinesAndRejectsInvalidMoves();
testDeclaresThreeInARowWinner();
console.log('피카리아 로직 테스트 통과');
