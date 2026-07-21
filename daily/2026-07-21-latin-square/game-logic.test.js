const assert = require('assert');
const LatinSquare = require('./game-logic');

function testCreatesPuzzle() {
  const game = LatinSquare.createGame();

  assert.strictEqual(game.size, 4);
  assert.deepStrictEqual(game.symbols, [1, 2, 3, 4]);
  assert.strictEqual(game.status, '진행 중');
  assert.strictEqual(game.selectedNumber, null);
  assert.strictEqual(game.conflicts.length, 0);
  assert.match(game.message, /숫자를 고르세요/);
}

function testSelectsAndPlacesNumber() {
  let game = LatinSquare.createGame();

  game = LatinSquare.selectNumber(game, 2);
  assert.strictEqual(game.selectedNumber, 2);

  const placed = LatinSquare.placeNumber(game, 0, 1);
  assert.strictEqual(placed.board[0][1], 2);
  assert.strictEqual(placed.selectedNumber, 2);
  assert.strictEqual(placed.status, '진행 중');
  assert.match(placed.message, /놓았습니다/);
}

function testRejectsFixedAndInvalidMoves() {
  let game = LatinSquare.createGame();

  assert.throws(() => LatinSquare.selectNumber(game, 5), /없는 숫자/);
  assert.throws(() => LatinSquare.placeNumber(game, 0, 1), /먼저 숫자/);

  game = LatinSquare.selectNumber(game, 3);

  assert.throws(() => LatinSquare.placeNumber(game, 0, 0), /고정된 칸/);
  assert.throws(() => LatinSquare.placeNumber(game, 4, 0), /범위/);
}

function testClearsOnlyEditableCells() {
  let game = LatinSquare.createGame();
  game = LatinSquare.placeNumber(LatinSquare.selectNumber(game, 3), 0, 1);

  const cleared = LatinSquare.clearCell(game, 0, 1);

  assert.strictEqual(cleared.board[0][1], null);
  assert.strictEqual(cleared.selectedNumber, 3);
  assert.throws(() => LatinSquare.clearCell(cleared, 0, 0), /고정된 칸/);
}

function testFindsRowAndColumnConflicts() {
  const game = LatinSquare.createGame({
    board: [
      [1, 1, null, 4],
      [null, 4, 1, null],
      [2, 1, 4, null],
      [null, null, 2, 1],
    ],
  });

  assert.strictEqual(game.status, '진행 중');
  assert.deepStrictEqual(game.conflicts, [
    { type: 'row', index: 0, number: 1 },
    { type: 'column', index: 1, number: 1 },
  ]);
  assert.match(game.message, /중복/);
}

function testCompletesSolvedBoard() {
  const game = LatinSquare.createGame({
    board: [
      [1, 2, 3, 4],
      [3, 4, 1, 2],
      [2, 1, 4, 3],
      [4, 3, 2, 1],
    ],
  });

  assert.strictEqual(game.status, '성공');
  assert.strictEqual(game.filledCount, 16);
  assert.match(game.message, /완성/);
}

function testDetectsIncorrectFullBoard() {
  const game = LatinSquare.createGame({
    board: [
      [1, 2, 3, 4],
      [3, 4, 1, 2],
      [2, 1, 4, 3],
      [4, 3, 1, 2],
    ],
  });

  assert.strictEqual(game.status, '실패');
  assert.ok(game.conflicts.length > 0);
  assert.match(game.message, /다시 확인/);
}

function testClearsInvalidFullBoardForRecovery() {
  const game = LatinSquare.createGame({
    board: [
      [1, 2, 3, 4],
      [3, 4, 1, 2],
      [2, 1, 4, 3],
      [4, 3, 1, 2],
    ],
    selectedNumber: 2,
  });

  const recovered = LatinSquare.clearCell(game, 3, 2);

  assert.strictEqual(game.status, '실패');
  assert.strictEqual(recovered.board[3][2], null);
  assert.strictEqual(recovered.status, '진행 중');
  assert.strictEqual(recovered.selectedNumber, 2);
}

testCreatesPuzzle();
testSelectsAndPlacesNumber();
testRejectsFixedAndInvalidMoves();
testClearsOnlyEditableCells();
testFindsRowAndColumnConflicts();
testCompletesSolvedBoard();
testDetectsIncorrectFullBoard();
testClearsInvalidFullBoardForRecovery();

console.log('라틴 사각형 로직 테스트 통과');
