const assert = require('assert');
const MiniHalma = require('./game-logic');

function boardWith(pieces) {
  const board = Array(MiniHalma.SIZE * MiniHalma.SIZE).fill(null);
  pieces.blue.forEach((index) => { board[index] = 'blue'; });
  pieces.coral.forEach((index) => { board[index] = 'coral'; });
  return board;
}

function testCreatesTwoCornerCamps() {
  const state = MiniHalma.createState();
  assert.strictEqual(state.turn, 'blue');
  assert.deepStrictEqual(state.board.filter((piece) => piece === 'blue').length, 6);
  assert.deepStrictEqual(state.board.filter((piece) => piece === 'coral').length, 6);
  assert.strictEqual(MiniHalma.getStatus(state), 'playing');
}

function testListsStepsAndJumpsForTheCurrentPlayer() {
  const moves = MiniHalma.getMoves(MiniHalma.createState());
  assert.ok(moves.some((move) => move.from === 1 && move.to === 8 && move.kind === 'step'));
  assert.ok(moves.some((move) => move.from === 1 && move.to === 3 && move.kind === 'jump'));
  assert.ok(moves.every((move) => move.from < 18));
}

function testAllowsAChainOfJumpsAsOneTurn() {
  const state = MiniHalma.createState({
    board: boardWith({ blue: [0, 1, 2, 6, 8, 12], coral: [7, 21, 23, 29, 34, 35] }),
  });
  const moved = MiniHalma.move(state, 0, 28);
  assert.strictEqual(moved.board[0], null);
  assert.strictEqual(moved.board[28], 'blue');
  assert.strictEqual(moved.turn, 'coral');
  assert.strictEqual(moved.moves, 1);
}

function testRejectsOpponentPiecesAndIllegalLandings() {
  const state = MiniHalma.createState();
  assert.throws(() => MiniHalma.move(state, 35, 28), /내 말/);
  assert.throws(() => MiniHalma.move(state, 1, 20), /갈 수 없는/);
}

function testRecognizesACompletedOppositeCamp() {
  const state = MiniHalma.createState({
    board: boardWith({ blue: [23, 28, 29, 33, 34, 35], coral: [0, 1, 2, 6, 7, 12] }),
    turn: 'coral', moves: 24,
  });
  assert.strictEqual(MiniHalma.getStatus(state), 'won');
  assert.strictEqual(MiniHalma.getWinner(state), 'blue');
  assert.throws(() => MiniHalma.move(state, 0, 8), /끝났/);
}

testCreatesTwoCornerCamps();
testListsStepsAndJumpsForTheCurrentPlayer();
testAllowsAChainOfJumpsAsOneTurn();
testRejectsOpponentPiecesAndIllegalLandings();
testRecognizesACompletedOppositeCamp();
console.log('미니 할마 로직 테스트 통과');
