const assert = require('assert');
const EightQueens = require('./game-logic');

function testCreateGameStartsEmpty() {
  const game = EightQueens.createGame();

  assert.strictEqual(game.size, 8);
  assert.strictEqual(EightQueens.countQueens(game), 0);
  assert.deepStrictEqual(game.queens, []);
  assert.strictEqual(game.status, '진행 중');
  assert.strictEqual(game.message, '여덟 퀸을 서로 공격하지 않게 놓으세요.');
}

function testToggleQueenAddsAndRemoves() {
  const game = EightQueens.createGame();
  const placed = EightQueens.toggleQueen(game, 3, 4);

  assert.strictEqual(EightQueens.hasQueen(placed, 3, 4), true);
  assert.strictEqual(EightQueens.countQueens(placed), 1);
  assert.strictEqual(placed.message, '퀸 1개를 놓았습니다. 남은 퀸은 7개입니다.');

  const removed = EightQueens.toggleQueen(placed, 3, 4);

  assert.strictEqual(EightQueens.hasQueen(removed, 3, 4), false);
  assert.strictEqual(EightQueens.countQueens(removed), 0);
  assert.strictEqual(removed.message, '퀸을 치웠습니다.');
}

function testDetectsRowColumnAndDiagonalConflicts() {
  const game = EightQueens.createGame({
    queens: [
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 0, y: 5 },
      { x: 3, y: 3 },
    ],
  });

  const conflicts = EightQueens.getConflicts(game);

  assert.deepStrictEqual(conflicts, [
    '0,0',
    '4,0',
    '0,5',
    '3,3',
  ]);
  assert.strictEqual(EightQueens.isSafePlacement(game, 7, 7), false);
  assert.strictEqual(EightQueens.isSafePlacement(game, 6, 4), true);
}

function testCannotPlaceMoreThanEightQueens() {
  const game = EightQueens.createGame({
    queens: [
      { x: 0, y: 0 },
      { x: 1, y: 2 },
      { x: 2, y: 4 },
      { x: 3, y: 6 },
      { x: 4, y: 1 },
      { x: 5, y: 3 },
      { x: 6, y: 5 },
      { x: 7, y: 7 },
    ],
  });

  const next = EightQueens.toggleQueen(game, 7, 6);

  assert.strictEqual(EightQueens.countQueens(next), 8);
  assert.strictEqual(EightQueens.hasQueen(next, 7, 6), false);
  assert.strictEqual(next.message, '퀸은 8개까지만 놓을 수 있습니다.');
}

function testWinningBoardIsRecognized() {
  const game = EightQueens.createGame({
    queens: [
      { x: 0, y: 0 },
      { x: 1, y: 4 },
      { x: 2, y: 7 },
      { x: 3, y: 5 },
      { x: 4, y: 2 },
      { x: 5, y: 6 },
      { x: 6, y: 1 },
      { x: 7, y: 3 },
    ],
  });

  assert.strictEqual(game.status, '성공');
  assert.strictEqual(game.message, '성공입니다. 여덟 퀸이 서로 공격하지 않습니다!');
  assert.deepStrictEqual(EightQueens.getConflicts(game), []);
}

testCreateGameStartsEmpty();
testToggleQueenAddsAndRemoves();
testDetectsRowColumnAndDiagonalConflicts();
testCannotPlaceMoreThanEightQueens();
testWinningBoardIsRecognized();

console.log('여덟 퀸 로직 테스트 통과');
