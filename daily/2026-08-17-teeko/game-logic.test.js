const assert = require('assert');
const Teeko = require('./game-logic');

function testCreatesAnEmptyFiveByFiveBoard() {
  assert.deepStrictEqual(Teeko.createBoard(), [
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
  ]);
}

function testAllowsOnlyEmptyCellsDuringPlacement() {
  const board = Teeko.createBoard();
  assert.strictEqual(Teeko.isValidPlacement(board, 1, 2), true);
  const placed = Teeko.placePiece(board, 1, 2, 'red');
  assert.strictEqual(Teeko.isValidPlacement(placed, 1, 2), false);
  assert.strictEqual(Teeko.isValidPlacement(board, -1, 2), false);
  assert.strictEqual(board[1][2], null);
}

function testOnlyMovesToAnEmptyAdjacentCell() {
  const board = [
    ['red', null, null, null, null],
    [null, 'blue', null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
    [null, null, null, null, null],
  ];
  assert.strictEqual(Teeko.isValidMove(board, 0, 0, 1, 0, 'red'), true);
  assert.strictEqual(Teeko.isValidMove(board, 0, 0, 2, 0, 'red'), false);
  assert.strictEqual(Teeko.isValidMove(board, 0, 0, 1, 1, 'red'), false);
  const moved = Teeko.movePiece(board, 0, 0, 1, 0, 'red');
  assert.strictEqual(moved[0][0], null);
  assert.strictEqual(moved[1][0], 'red');
}

function boardWith(pieces) {
  const board = Teeko.createBoard();
  pieces.forEach(([row, column, color]) => { board[row][column] = color; });
  return board;
}

function testFindsFourInEveryLineDirectionAndSquareWins() {
  const boards = [
    boardWith([[0, 1, 'red'], [0, 2, 'red'], [0, 3, 'red'], [0, 4, 'red']]),
    boardWith([[1, 4, 'red'], [2, 4, 'red'], [3, 4, 'red'], [4, 4, 'red']]),
    boardWith([[0, 1, 'red'], [1, 2, 'red'], [2, 3, 'red'], [3, 4, 'red']]),
    boardWith([[0, 3, 'red'], [1, 2, 'red'], [2, 1, 'red'], [3, 0, 'red']]),
    boardWith([[3, 3, 'red'], [3, 4, 'red'], [4, 3, 'red'], [4, 4, 'red']]),
  ];
  boards.forEach((board) => assert.strictEqual(Teeko.hasWon(board, 'red'), true));
  assert.strictEqual(Teeko.hasWon(boards[0], 'blue'), false);
}

function testDoesNotTreatASeparatedLineAsAWin() {
  const board = boardWith([[0, 0, 'red'], [0, 1, 'red'], [0, 3, 'red'], [0, 4, 'red']]);
  assert.strictEqual(Teeko.hasWon(board, 'red'), false);
}

function testRejectsMalformedBoardsAndColors() {
  assert.throws(() => Teeko.isValidPlacement([[null]], 0, 0), /말판/);
  assert.throws(() => Teeko.placePiece(Teeko.createBoard(), 0, 0, 'green'), /색/);
  assert.throws(() => Teeko.movePiece(Teeko.createBoard(), 0, 0, 1, 0, 'blue'), /옮길 수/);
}

testCreatesAnEmptyFiveByFiveBoard();
testAllowsOnlyEmptyCellsDuringPlacement();
testOnlyMovesToAnEmptyAdjacentCell();
testFindsFourInEveryLineDirectionAndSquareWins();
testDoesNotTreatASeparatedLineAsAWin();
testRejectsMalformedBoardsAndColors();

console.log('티코 로직 테스트 통과');
