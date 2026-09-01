const assert = require('assert');
const Dara = require('./game-logic');

function testStartsWithAnEmptyFiveBySixBoard() {
  const state = Dara.createState();
  assert.deepStrictEqual(state.board, Array(30).fill(null));
  assert.strictEqual(state.turn, 'blue');
  assert.strictEqual(Dara.getPhase(state), 'placing');
}

function testPlayersPlaceTwelvePiecesThenMove() {
  let state = Dara.createState();
  for (let index = 0; index < 24; index += 1) state = Dara.place(state, index);
  assert.strictEqual(state.turn, 'blue');
  assert.strictEqual(Dara.getPhase(state), 'moving');
  assert.throws(() => Dara.place(state, 24), /움직/);
}

function testMoveUsesAnOrthogonalEmptyNeighbour() {
  const state = Dara.createState({
    board: ['blue', null, 'orange', null, null, null, 'blue', 'orange', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    turn: 'blue', placed: { blue: 12, orange: 12 },
  });
  const next = Dara.move(state, 6, 11);
  assert.strictEqual(next.board[6], null);
  assert.strictEqual(next.board[11], 'blue');
  assert.strictEqual(next.turn, 'orange');
  assert.throws(() => Dara.move(state, 6, 8), /이웃/);
  assert.throws(() => Dara.move(state, 2, 7), /내 말/);
}

function testThreeInARowRequiresCapturingAnOpponent() {
  const state = Dara.createState({
    board: ['blue', null, 'blue', 'orange', null, null, 'blue', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    turn: 'blue', placed: { blue: 12, orange: 12 },
  });
  const formed = Dara.move(state, 6, 1);
  assert.strictEqual(Dara.getStatus(formed), 'blue-capture');
  assert.strictEqual(formed.turn, 'blue');
  const captured = Dara.capture(formed, 3);
  assert.strictEqual(captured.board[3], null);
  assert.strictEqual(captured.turn, 'orange');
}

function testRejectsAFourInARowAndDeclaresWinAfterTenCaptures() {
  const state = Dara.createState({
    board: ['blue', 'blue', 'blue', null, 'blue', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    turn: 'blue', placed: { blue: 12, orange: 12 },
  });
  assert.throws(() => Dara.move(state, 4, 3), /네 개/);
  const finalTarget = Array(30).fill(null); finalTarget[0] = 'orange';
  const almostWon = Dara.createState({ board: finalTarget, turn: 'blue', placed: { blue: 12, orange: 12 }, captures: { blue: 9, orange: 0 } });
  const won = Dara.capture({ ...almostWon, pendingCapture: true }, 0);
  assert.strictEqual(Dara.getStatus(won), 'blue-won');
}

function testDoesNotCaptureAPieceInAnOpponentsLineOfThree() {
  const board = Array(30).fill(null);
  board[3] = 'orange'; board[8] = 'orange'; board[13] = 'orange';
  const state = Dara.createState({ board, turn: 'blue', placed: { blue: 12, orange: 12 }, captures: { blue: 0, orange: 0 } });
  assert.throws(() => Dara.capture({ ...state, pendingCapture: true }, 8), /세 개/);
}

testStartsWithAnEmptyFiveBySixBoard();
testPlayersPlaceTwelvePiecesThenMove();
testMoveUsesAnOrthogonalEmptyNeighbour();
testThreeInARowRequiresCapturingAnOpponent();
testRejectsAFourInARowAndDeclaresWinAfterTenCaptures();
testDoesNotCaptureAPieceInAnOpponentsLineOfThree();
console.log('다라 로직 테스트 통과');
