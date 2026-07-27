const assert = require('assert');
const Puzzle = require('./game-logic');

function testCreateGameUsesProvidedTiles() {
  const tiles = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 0, 14, 15];
  const game = Puzzle.createGame(tiles);

  assert.deepStrictEqual(game.tiles, tiles);
  assert.strictEqual(game.moves, 0);
  assert.strictEqual(game.status, '진행 중');
  assert.strictEqual(game.message, '빈칸 옆의 숫자를 눌러 순서대로 맞추세요.');
}

function testCanMoveOnlyAdjacentToBlank() {
  const game = Puzzle.createGame([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 0, 14, 15]);

  assert.strictEqual(Puzzle.canMove(game, 14), true);
  assert.strictEqual(Puzzle.canMove(game, 10), true);
  assert.strictEqual(Puzzle.canMove(game, 12), false);
  assert.strictEqual(Puzzle.canMove(game, 15), false);
}

function testMoveTileSwapsWithBlank() {
  const game = Puzzle.createGame([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 0, 14, 15]);
  const moved = Puzzle.moveTile(game, 14);

  assert.deepStrictEqual(moved.tiles, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 0, 15]);
  assert.strictEqual(moved.moves, 1);
  assert.strictEqual(moved.status, '진행 중');
  assert.strictEqual(moved.message, '14번 타일을 옮겼습니다.');
  assert.deepStrictEqual(game.tiles, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 0, 14, 15]);
}

function testMoveTileRejectsNonMovableTile() {
  const game = Puzzle.createGame([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 0, 14, 15]);
  const moved = Puzzle.moveTile(game, 12);

  assert.deepStrictEqual(moved.tiles, game.tiles);
  assert.strictEqual(moved.moves, 0);
  assert.strictEqual(moved.message, '그 숫자는 빈칸과 맞닿아 있지 않습니다.');
}

function testMoveTileDetectsWin() {
  const game = Puzzle.createGame([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 0, 15]);
  const moved = Puzzle.moveTile(game, 15);

  assert.deepStrictEqual(moved.tiles, Puzzle.SOLVED_TILES);
  assert.strictEqual(moved.moves, 1);
  assert.strictEqual(moved.status, '승리');
  assert.strictEqual(moved.message, '성공입니다. 1번 만에 퍼즐을 완성했습니다.');
}

function testSolvabilityCheck() {
  assert.strictEqual(Puzzle.isSolvable(Puzzle.SOLVED_TILES), true);
  assert.strictEqual(Puzzle.isSolvable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 14, 0]), false);
}

function testInvalidTilesAreRejected() {
  assert.throws(
    () => Puzzle.createGame([1, 2, 3]),
    /타일 배열이 올바르지 않습니다/,
  );

  assert.throws(
    () => Puzzle.createGame([1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 0]),
    /타일 배열이 올바르지 않습니다/,
  );
}

testCreateGameUsesProvidedTiles();
testCanMoveOnlyAdjacentToBlank();
testMoveTileSwapsWithBlank();
testMoveTileRejectsNonMovableTile();
testMoveTileDetectsWin();
testSolvabilityCheck();
testInvalidTilesAreRejected();

console.log('십오 퍼즐 로직 테스트 통과');
