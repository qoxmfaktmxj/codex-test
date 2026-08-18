const assert = require('assert');
const PegSolitaire = require('./game-logic');

function testCreatesTheEnglishCrossBoard() {
  const board = PegSolitaire.createBoard();
  assert.strictEqual(board.length, 7);
  assert.strictEqual(board[0][0], 'blocked');
  assert.strictEqual(board[3][3], 'empty');
  assert.strictEqual(board[2][3], 'peg');
}

function testFindsLegalJumpsOnly() {
  const board = PegSolitaire.createBoard();
  assert.strictEqual(PegSolitaire.isValidJump(board, 1, 3, 3, 3), true);
  assert.strictEqual(PegSolitaire.isValidJump(board, 3, 1, 3, 3), true);
  assert.strictEqual(PegSolitaire.isValidJump(board, 2, 3, 3, 3), false);
  assert.strictEqual(PegSolitaire.isValidJump(board, 1, 3, 4, 3), false);
}

function testAppliesAJumpWithoutMutatingTheBoard() {
  const board = PegSolitaire.createBoard();
  const moved = PegSolitaire.jump(board, 1, 3, 3, 3);
  assert.strictEqual(moved[1][3], 'empty');
  assert.strictEqual(moved[2][3], 'empty');
  assert.strictEqual(moved[3][3], 'peg');
  assert.strictEqual(board[1][3], 'peg');
  assert.strictEqual(PegSolitaire.countPegs(moved), 31);
}

function testReportsMovesAndCompletion() {
  const board = PegSolitaire.createBoard();
  assert.strictEqual(PegSolitaire.hasLegalMove(board), true);
  const finished = [
    ['blocked', 'blocked', 'blocked', 'blocked', 'blocked', 'blocked', 'blocked'],
    ['blocked', 'blocked', 'peg', 'empty', 'blocked', 'blocked', 'blocked'],
    ['blocked', 'blocked', 'blocked', 'blocked', 'blocked', 'blocked', 'blocked'],
    ['blocked', 'blocked', 'blocked', 'blocked', 'blocked', 'blocked', 'blocked'],
    ['blocked', 'blocked', 'blocked', 'blocked', 'blocked', 'blocked', 'blocked'],
    ['blocked', 'blocked', 'blocked', 'blocked', 'blocked', 'blocked', 'blocked'],
    ['blocked', 'blocked', 'blocked', 'blocked', 'blocked', 'blocked', 'blocked'],
  ];
  assert.strictEqual(PegSolitaire.hasLegalMove(finished), false);
  assert.strictEqual(PegSolitaire.isComplete(finished), true);
}

function testRejectsInvalidBoardsAndJumps() {
  assert.throws(() => PegSolitaire.isValidJump([['peg']], 0, 0, 0, 2), /말판/);
  assert.throws(() => PegSolitaire.jump(PegSolitaire.createBoard(), 0, 0, 0, 2), /뛸 수/);
}

testCreatesTheEnglishCrossBoard();
testFindsLegalJumpsOnly();
testAppliesAJumpWithoutMutatingTheBoard();
testReportsMovesAndCompletion();
testRejectsInvalidBoardsAndJumps();

console.log('페그 솔리테어 로직 테스트 통과');
