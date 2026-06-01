const assert = require('assert');
const {
  DIRECTIONS,
  TILE,
  createGame,
  getTile,
  movePlayer,
  statusText,
} = require('./game-logic');

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}`);
    throw error;
  }
}

test('새 게임은 플레이어와 상자를 올바른 위치에 둔다', () => {
  const game = createGame();
  assert.deepStrictEqual(game.player, { row: 2, column: 2 });
  assert.strictEqual(game.moves, 0);
  assert.strictEqual(game.pushes, 0);
  assert.strictEqual(game.status, 'playing');
  assert.strictEqual(getTile(game, { row: 2, column: 3 }), TILE.CRATE);
});

test('벽이나 지도 밖으로는 이동할 수 없다', () => {
  const game = createGame({ board: ['###', '#P#', '###'] });
  const intoWall = movePlayer(game, DIRECTIONS.UP);
  assert.deepStrictEqual(intoWall.player, game.player);
  assert.strictEqual(intoWall.moves, 0);
  assert.strictEqual(intoWall.message, '벽에 막혔습니다.');

  const tiny = createGame({ board: ['P'] });
  const outside = movePlayer(tiny, DIRECTIONS.LEFT);
  assert.deepStrictEqual(outside.player, tiny.player);
  assert.strictEqual(outside.message, '벽에 막혔습니다.');
});

test('빈 칸으로 이동하면 위치와 이동 횟수가 바뀐다', () => {
  const game = createGame();
  const moved = movePlayer(game, DIRECTIONS.LEFT);
  assert.deepStrictEqual(moved.player, { row: 2, column: 1 });
  assert.strictEqual(moved.moves, 1);
  assert.strictEqual(moved.pushes, 0);
});

test('상자 뒤가 비어 있으면 상자를 한 칸 민다', () => {
  const game = createGame({ board: ['#####', '#PCT#', '#####'] });
  const pushed = movePlayer(game, DIRECTIONS.RIGHT);
  assert.deepStrictEqual(pushed.player, { row: 1, column: 2 });
  assert.strictEqual(getTile(pushed, { row: 1, column: 3 }), TILE.CRATE_ON_TARGET);
  assert.strictEqual(pushed.moves, 1);
  assert.strictEqual(pushed.pushes, 1);
});

test('상자 뒤가 막히면 상자를 밀 수 없다', () => {
  const game = createGame({ board: ['#####', '#PC##', '#####'] });
  const blocked = movePlayer(game, DIRECTIONS.RIGHT);
  assert.deepStrictEqual(blocked.player, game.player);
  assert.strictEqual(getTile(blocked, { row: 1, column: 2 }), TILE.CRATE);
  assert.strictEqual(blocked.message, '상자를 그쪽으로 밀 수 없습니다.');
});

test('모든 목표 위에 상자를 올리면 승리한다', () => {
  const game = createGame({ board: ['#####', '#PCT#', '#####'] });
  const won = movePlayer(game, DIRECTIONS.RIGHT);
  assert.strictEqual(won.status, 'won');
  assert.strictEqual(won.message, '창고 정리 완료! 1번 이동, 1번 밀었습니다.');
  assert.strictEqual(statusText(won), '완료 · 이동 1번 · 밀기 1번');
});
