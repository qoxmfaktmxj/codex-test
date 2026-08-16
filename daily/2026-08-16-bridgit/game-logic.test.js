const assert = require('assert');
const Bridgit = require('./game-logic');

function testCreatesAUsableEmptyBoard() {
  const board = Bridgit.createBoard(5);
  assert.deepStrictEqual(board, [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
  ]);
}

function testOnlyAllowsEmptyCellsInsideTheBoard() {
  const board = Bridgit.createBoard(3);
  assert.strictEqual(Bridgit.isValidMove(board, 1, 1), true);
  assert.strictEqual(Bridgit.isValidMove(board, -1, 1), false);
  const placed = Bridgit.placeStone(board, 1, 1, 'red');
  assert.strictEqual(Bridgit.isValidMove(placed, 1, 1), false);
  assert.strictEqual(board[1][1], null);
}

function testFindsRedTopToBottomConnections() {
  const board = [
    ['red', null, null],
    ['red', 'blue', null],
    ['red', 'blue', 'blue'],
  ];
  assert.strictEqual(Bridgit.hasConnection(board, 'red'), true);
  assert.strictEqual(Bridgit.hasConnection(board, 'blue'), false);
}

function testFindsBlueLeftToRightConnections() {
  const board = [
    ['red', 'red', null, 'blue'],
    ['blue', 'blue', 'blue', 'blue'],
    [null, 'red', null, null],
    [null, null, null, null],
  ];
  assert.strictEqual(Bridgit.hasConnection(board, 'blue'), true);
  assert.strictEqual(Bridgit.hasConnection(board, 'red'), false);
}

function testRejectsInvalidInputs() {
  assert.throws(() => Bridgit.createBoard(2), /보드/);
  assert.throws(() => Bridgit.placeStone(Bridgit.createBoard(3), 0, 0, 'green'), /색/);
  assert.throws(() => Bridgit.hasConnection([[null], [null, null]], 'red'), /보드/);
}

testCreatesAUsableEmptyBoard();
testOnlyAllowsEmptyCellsInsideTheBoard();
testFindsRedTopToBottomConnections();
testFindsBlueLeftToRightConnections();
testRejectsInvalidInputs();

console.log('브리지트 로직 테스트 통과');
