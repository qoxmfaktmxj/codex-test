const assert = require('assert');
const Make24 = require('./game-logic');

function testCreateGameStartsWithFourNumbers() {
  const game = Make24.createGame([3, 3, 8, 8]);

  assert.strictEqual(game.status, '진행 중');
  assert.strictEqual(game.moves.length, 0);
  assert.strictEqual(game.tiles.length, 4);
  assert.deepStrictEqual(game.tiles.map((tile) => tile.value), [3, 3, 8, 8]);
  assert.strictEqual(game.message, '숫자 두 개와 연산을 골라 24를 만드세요.');
}

function testCombinesTwoTilesWithOperator() {
  const game = Make24.createGame([3, 3, 8, 8]);
  const combined = Make24.combineTiles(game, game.tiles[0].id, game.tiles[1].id, '+');

  assert.strictEqual(combined.tiles.length, 3);
  assert.strictEqual(combined.tiles[2].value, 6);
  assert.strictEqual(combined.tiles[2].expression, '(3 + 3)');
  assert.strictEqual(combined.moves.length, 1);
  assert.strictEqual(combined.message, '3 + 3 = 6');
}

function testSupportsReverseSubtractionAndDivision() {
  const game = Make24.createGame([3, 8, 4, 2]);
  const subtracted = Make24.combineTiles(game, game.tiles[0].id, game.tiles[1].id, '-');
  const divided = Make24.combineTiles(game, game.tiles[1].id, game.tiles[0].id, '/');

  assert.strictEqual(subtracted.tiles[2].value, -5);
  assert.strictEqual(subtracted.tiles[2].expression, '(3 - 8)');
  assert.strictEqual(divided.tiles[2].value, 8 / 3);
  assert.strictEqual(divided.tiles[2].expression, '(8 / 3)');
}

function testBlocksInvalidChoices() {
  const game = Make24.createGame([1, 2, 3, 4]);
  const sameTile = Make24.combineTiles(game, game.tiles[0].id, game.tiles[0].id, '+');
  const divideByZero = Make24.combineTiles(
    Make24.createGame([8, 0, 3, 3]),
    'tile-1',
    'tile-2',
    '/'
  );

  assert.deepStrictEqual(sameTile.tiles, game.tiles);
  assert.deepStrictEqual(sameTile.moves, game.moves);
  assert.strictEqual(sameTile.message, '서로 다른 숫자 두 개를 골라야 합니다.');
  assert.strictEqual(divideByZero.message, '0으로 나눌 수 없습니다.');
  assert.strictEqual(divideByZero.tiles.length, 4);
}

function testWinningSequenceAndUndo() {
  const game = Make24.createGame([3, 3, 8, 8]);
  const step1 = Make24.combineTiles(game, 'tile-3', 'tile-1', '/');
  const step2 = Make24.combineTiles(step1, 'tile-2', step1.tiles[2].id, '-');
  const won = Make24.combineTiles(step2, 'tile-4', step2.tiles[1].id, '/');
  const undone = Make24.undo(won);

  assert.strictEqual(won.status, '성공');
  assert.strictEqual(won.tiles.length, 1);
  assert.strictEqual(won.tiles[0].value, 24);
  assert.strictEqual(won.message, '성공입니다. 24를 만들었습니다!');
  assert.strictEqual(undone.status, '진행 중');
  assert.strictEqual(undone.tiles.length, 2);
}

testCreateGameStartsWithFourNumbers();
testCombinesTwoTilesWithOperator();
testSupportsReverseSubtractionAndDivision();
testBlocksInvalidChoices();
testWinningSequenceAndUndo();

console.log('24 만들기 로직 테스트 통과');
