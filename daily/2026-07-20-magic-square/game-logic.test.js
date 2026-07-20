const assert = require('assert');
const MagicSquare = require('./game-logic');

function testCreatesEmptyGame() {
  const game = MagicSquare.createGame();

  assert.strictEqual(game.size, 3);
  assert.deepStrictEqual(game.board, [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ]);
  assert.deepStrictEqual(game.availableNumbers, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  assert.strictEqual(game.status, '진행 중');
  assert.match(game.message, /숫자를 고르세요/);
}

function testPlacesSelectedNumber() {
  const game = MagicSquare.createGame();
  const selected = MagicSquare.selectNumber(game, 5);
  const placed = MagicSquare.placeNumber(selected, 1, 1);

  assert.strictEqual(placed.board[1][1], 5);
  assert.deepStrictEqual(placed.availableNumbers, [1, 2, 3, 4, 6, 7, 8, 9]);
  assert.strictEqual(placed.selectedNumber, null);
  assert.strictEqual(placed.status, '진행 중');
  assert.match(placed.message, /놓았습니다/);
}

function testRejectsInvalidMoves() {
  let game = MagicSquare.createGame();

  assert.throws(() => MagicSquare.selectNumber(game, 10), /사용할 수 없는 숫자/);
  assert.throws(() => MagicSquare.placeNumber(game, 0, 0), /먼저 숫자/);

  game = MagicSquare.placeNumber(MagicSquare.selectNumber(game, 8), 0, 0);

  assert.throws(() => MagicSquare.placeNumber(MagicSquare.selectNumber(game, 7), 0, 0), /이미 숫자/);
  assert.throws(() => MagicSquare.placeNumber(MagicSquare.selectNumber(game, 7), 3, 0), /범위/);
  assert.throws(() => MagicSquare.selectNumber(game, 8), /사용할 수 없는 숫자/);
}

function testCalculatesLineSums() {
  const game = MagicSquare.createGame({
    board: [
      [8, 1, 6],
      [3, 5, 7],
      [4, 9, null],
    ],
  });

  assert.deepStrictEqual(game.lineSums.rows, [15, 15, 13]);
  assert.deepStrictEqual(game.lineSums.columns, [15, 15, 13]);
  assert.deepStrictEqual(game.lineSums.diagonals, [13, 15]);
  assert.deepStrictEqual(game.completedLines, {
    rows: [true, true, false],
    columns: [true, true, false],
    diagonals: [false, true],
  });
}

function testCompletesWinningSquare() {
  let game = MagicSquare.createGame();
  [
    [8, 0, 0], [1, 0, 1], [6, 0, 2],
    [3, 1, 0], [5, 1, 1], [7, 1, 2],
    [4, 2, 0], [9, 2, 1], [2, 2, 2],
  ].forEach(([number, row, col]) => {
    game = MagicSquare.placeNumber(MagicSquare.selectNumber(game, number), row, col);
  });

  assert.strictEqual(game.status, '성공');
  assert.strictEqual(game.score, 8);
  assert.deepStrictEqual(game.availableNumbers, []);
  assert.match(game.message, /완성/);
}

function testDetectsFullButIncorrectSquare() {
  const game = MagicSquare.createGame({
    board: [
      [1, 2, 3],
      [4, 5, 6],
      [8, 7, 9],
    ],
  });

  assert.strictEqual(game.status, '실패');
  assert.strictEqual(game.score, 2);
  assert.match(game.message, /다시 도전/);
}

testCreatesEmptyGame();
testPlacesSelectedNumber();
testRejectsInvalidMoves();
testCalculatesLineSums();
testCompletesWinningSquare();
testDetectsFullButIncorrectSquare();

console.log('마방진 15 로직 테스트 통과');
