const assert = require('assert');
const Nonogram = require('./game-logic');

const solution = [
  [false, true, true, true, false],
  [true, false, true, false, true],
  [true, true, true, true, true],
  [true, false, true, false, true],
  [false, true, false, true, false],
];

function testCreatesAnEmptyPuzzleWithoutSharingTheSolution() {
  const puzzle = Nonogram.createPuzzle(solution);
  assert.deepStrictEqual(puzzle.cells, solution.map((row) => row.map(() => false)));
  puzzle.solution[0][1] = false;
  assert.strictEqual(solution[0][1], true);
}

function testBuildsHintsForRowsAndColumns() {
  assert.deepStrictEqual(Nonogram.getHints(solution), {
    rows: [[3], [1, 1, 1], [5], [1, 1, 1], [1, 1]],
    columns: [[3], [1, 1, 1], [4], [1, 1, 1], [3]],
  });
}

function testTogglesACellWithoutChangingThePreviousBoard() {
  const cells = solution.map((row) => row.map(() => false));
  const next = Nonogram.toggleCell(cells, 2, 3);
  assert.strictEqual(next[2][3], true);
  assert.strictEqual(cells[2][3], false);
  assert.throws(() => Nonogram.toggleCell(cells, 8, 0), /범위/);
}

function testReportsPlayingUntilEveryCellMatchesTheSolution() {
  const empty = solution.map((row) => row.map(() => false));
  assert.strictEqual(Nonogram.getStatus(solution, empty), 'playing');
  assert.strictEqual(Nonogram.getStatus(solution, solution), 'won');
}

testCreatesAnEmptyPuzzleWithoutSharingTheSolution();
testBuildsHintsForRowsAndColumns();
testTogglesACellWithoutChangingThePreviousBoard();
testReportsPlayingUntilEveryCellMatchesTheSolution();

console.log('노노그램 로직 테스트 통과');
