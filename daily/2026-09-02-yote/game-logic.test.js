const assert = require('assert');
const Yote = require('./game-logic');

function testStartsWithAnEmptyFiveBySixBoard() {
  const state = Yote.createState();
  assert.deepStrictEqual(state.board, Array(30).fill(null));
  assert.strictEqual(state.turn, 'blue');
  assert.strictEqual(Yote.getPhase(state), 'placing');
}

function testPlayersPlaceTwelvePiecesThenMove() {
  let state = Yote.createState();
  for (let index = 0; index < 24; index += 1) state = Yote.place(state, index);
  assert.strictEqual(Yote.getPhase(state), 'moving');
  assert.strictEqual(state.turn, 'blue');
}

function testMoveUsesAnOrthogonalEmptySquare() {
  const board = Array(30).fill(null);
  board[7] = 'blue'; board[8] = 'orange';
  const state = Yote.createState({ board, turn: 'blue', placed: { blue: 12, orange: 12 } });
  const next = Yote.move(state, 7, 6);
  assert.strictEqual(next.board[7], null);
  assert.strictEqual(next.board[6], 'blue');
  assert.strictEqual(next.turn, 'orange');
  assert.throws(() => Yote.move(state, 7, 8), /빈 칸/);
  assert.throws(() => Yote.move(state, 7, 14), /이웃/);
}

function testJumpCaptureRequiresAnOpponentAndEmptyLanding() {
  const board = Array(30).fill(null);
  board[7] = 'blue'; board[8] = 'orange'; board[10] = 'orange'; board[20] = 'orange';
  const state = Yote.createState({ board, turn: 'blue', placed: { blue: 12, orange: 12 } });
  const next = Yote.capture(state, 7, 9);
  assert.strictEqual(next.board[7], null);
  assert.strictEqual(next.board[8], null);
  assert.strictEqual(next.board[9], 'blue');
  assert.strictEqual(Yote.getStatus(next), 'blue-remove');
  assert.throws(() => Yote.capture(state, 7, 8), /두 칸/);
}

function testCaptureLetsPlayerRemoveOneMoreOpponentPiece() {
  const board = Array(30).fill(null);
  board[7] = 'blue'; board[8] = 'orange'; board[10] = 'orange'; board[20] = 'orange';
  const captured = Yote.capture(Yote.createState({ board, turn: 'blue', placed: { blue: 12, orange: 12 } }), 7, 9);
  const next = Yote.remove(captured, 10);
  assert.strictEqual(next.board[10], null);
  assert.strictEqual(next.turn, 'orange');
  assert.strictEqual(Yote.getStatus(next), 'playing');
}

function testWinsWhenOpponentHasNoPiecesAfterARequiredRemoval() {
  const board = Array(30).fill(null);
  board[7] = 'blue'; board[8] = 'orange'; board[10] = 'orange';
  const state = Yote.createState({ board, turn: 'blue', placed: { blue: 12, orange: 12 }, removed: { blue: 0, orange: 10 } });
  const captured = Yote.capture(state, 7, 9);
  const won = Yote.remove(captured, 10);
  assert.strictEqual(Yote.getStatus(won), 'blue-won');
}

function testPlayerLosesWhenNoMoveOrCaptureIsAvailable() {
  const board = Array(30).fill(null);
  board[0] = 'blue'; board[1] = 'orange'; board[2] = 'orange'; board[5] = 'orange'; board[10] = 'orange';
  const state = Yote.createState({ board, turn: 'blue', placed: { blue: 12, orange: 12 } });
  assert.strictEqual(Yote.getStatus(state), 'orange-won');
  assert.throws(() => Yote.move(state, 0, 1), /끝/);
}

testStartsWithAnEmptyFiveBySixBoard();
testPlayersPlaceTwelvePiecesThenMove();
testMoveUsesAnOrthogonalEmptySquare();
testJumpCaptureRequiresAnOpponentAndEmptyLanding();
testCaptureLetsPlayerRemoveOneMoreOpponentPiece();
testWinsWhenOpponentHasNoPiecesAfterARequiredRemoval();
testPlayerLosesWhenNoMoveOrCaptureIsAvailable();
console.log('요테 로직 테스트 통과');
