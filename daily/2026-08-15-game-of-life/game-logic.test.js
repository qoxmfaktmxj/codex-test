const assert = require('assert');
const LifeGame = require('./game-logic');

function testCreatesAnEmptyBoard() {
  const board = LifeGame.createBoard(4, 3);
  assert.deepStrictEqual(board, [
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
  ]);
}

function testCountsOnlyValidNeighbouringCells() {
  const board = [
    [true, true, false],
    [false, true, false],
    [false, false, false],
  ];
  assert.strictEqual(LifeGame.countNeighbours(board, 0, 0), 2);
  assert.strictEqual(LifeGame.countNeighbours(board, 1, 1), 2);
}

function testKeepsABlockStillLifeUnchanged() {
  const board = [
    [false, false, false, false],
    [false, true, true, false],
    [false, true, true, false],
    [false, false, false, false],
  ];
  assert.deepStrictEqual(LifeGame.nextGeneration(board), board);
}

function testTurnsABlinkerAcrossOneGeneration() {
  const board = [
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, true, true, true, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
  ];
  assert.deepStrictEqual(LifeGame.nextGeneration(board), [
    [false, false, false, false, false],
    [false, false, true, false, false],
    [false, false, true, false, false],
    [false, false, true, false, false],
    [false, false, false, false, false],
  ]);
}

function testAppliesLonelinessOvercrowdingAndBirthRules() {
  const board = [
    [true, true, true],
    [true, true, false],
    [false, false, false],
  ];
  const next = LifeGame.nextGeneration(board);
  assert.strictEqual(next[0][0], true);
  assert.strictEqual(next[1][1], false);
  assert.strictEqual(next[1][2], true);
}

function testTogglesWithoutMutatingTheOldBoardAndClearsTheBoard() {
  const board = LifeGame.createBoard(2, 2);
  const toggled = LifeGame.toggleCell(board, 1, 0);
  assert.strictEqual(board[0][1], false);
  assert.strictEqual(toggled[0][1], true);
  assert.deepStrictEqual(LifeGame.clearBoard(toggled), LifeGame.createBoard(2, 2));
}

function testRejectsInvalidBoardDimensionsAndCoordinates() {
  assert.throws(() => LifeGame.createBoard(0, 2), /보드 크기/);
  assert.throws(() => LifeGame.toggleCell([[false]], 1, 0), /좌표/);
  assert.throws(() => LifeGame.nextGeneration([[false], [false, true]]), /보드/);
}

testCreatesAnEmptyBoard();
testCountsOnlyValidNeighbouringCells();
testKeepsABlockStillLifeUnchanged();
testTurnsABlinkerAcrossOneGeneration();
testAppliesLonelinessOvercrowdingAndBirthRules();
testTogglesWithoutMutatingTheOldBoardAndClearsTheBoard();
testRejectsInvalidBoardDimensionsAndCoordinates();

console.log('생명 게임 로직 테스트 통과');
