const assert = require('assert');
const FrogLeap = require('./game-logic');

function testCreatesTheClassicStartingLine() {
  const state = FrogLeap.createState();
  assert.deepStrictEqual(state.board, ['left', 'left', 'left', null, 'right', 'right', 'right']);
  assert.strictEqual(FrogLeap.getStatus(state), 'playing');
}

function testListsOnlyMovesTowardTheOtherBank() {
  const state = FrogLeap.createState();
  assert.deepStrictEqual(FrogLeap.getMoves(state), [
    { from: 1, to: 3 },
    { from: 2, to: 3 },
    { from: 4, to: 3 },
    { from: 5, to: 3 },
  ]);
  assert.throws(() => FrogLeap.move(state, 2, 1), /앞으로/);
  assert.throws(() => FrogLeap.move(state, 2, 4), /비어/);
}

function testAllowsOneStepAndSingleJumpOverAnyFrog() {
  const stepped = FrogLeap.move(FrogLeap.createState(), 2, 3);
  assert.deepStrictEqual(stepped.board, ['left', 'left', null, 'left', 'right', 'right', 'right']);
  const jumped = FrogLeap.move(stepped, 4, 2);
  assert.deepStrictEqual(jumped.board, ['left', 'left', 'right', 'left', null, 'right', 'right']);
  assert.strictEqual(jumped.moves, 2);
}

function testRejectsBackwardAndLongJumps() {
  const state = FrogLeap.createState({ board: ['left', 'right', 'left', 'left', null, 'right', 'right'] });
  assert.throws(() => FrogLeap.move(state, 1, 2), /앞으로/);
  assert.throws(() => FrogLeap.move(state, 3, 6), /한 칸 또는/);
}

function testRecognizesTheSolvedLineAndBlocksFurtherMoves() {
  const state = FrogLeap.createState({ board: ['right', 'right', 'right', null, 'left', 'left', 'left'], moves: 15 });
  assert.strictEqual(FrogLeap.getStatus(state), 'won');
  assert.throws(() => FrogLeap.move(state, 4, 3), /끝났/);
}

function testRecognizesAStuckUnsolvedLine() {
  const state = FrogLeap.createState({ board: ['left', 'left', 'left', 'right', 'right', 'right', null] });
  assert.strictEqual(FrogLeap.getStatus(state), 'stuck');
}

testCreatesTheClassicStartingLine();
testListsOnlyMovesTowardTheOtherBank();
testAllowsOneStepAndSingleJumpOverAnyFrog();
testRejectsBackwardAndLongJumps();
testRecognizesTheSolvedLineAndBlocksFurtherMoves();
testRecognizesAStuckUnsolvedLine();
console.log('개구리 점프 로직 테스트 통과');
