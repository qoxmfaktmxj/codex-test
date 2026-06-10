const assert = require('assert');
const {
  DIRECTIONS,
  TILE,
  createGame,
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

test('새 게임은 시작 위치와 열쇠 없는 진행 상태로 시작한다', () => {
  const game = createGame();
  assert.deepStrictEqual(game.player, { row: 1, column: 1 });
  assert.strictEqual(game.hasKey, false);
  assert.strictEqual(game.moves, 0);
  assert.strictEqual(game.status, 'playing');
  assert.strictEqual(game.maze[game.player.row][game.player.column], TILE.START);
});

test('벽이나 지도 밖으로는 이동할 수 없다', () => {
  const game = createGame();
  const intoWall = movePlayer(game, DIRECTIONS.UP);
  assert.deepStrictEqual(intoWall.player, game.player);
  assert.strictEqual(intoWall.moves, 0);
  assert.strictEqual(intoWall.message, '벽에 막혔습니다.');

  const custom = createGame({ maze: [['S']], player: { row: 0, column: 0 } });
  const outOfMap = movePlayer(custom, DIRECTIONS.LEFT);
  assert.deepStrictEqual(outOfMap.player, custom.player);
  assert.strictEqual(outOfMap.message, '벽에 막혔습니다.');
});

test('빈 길로 움직이면 위치와 이동 횟수가 바뀐다', () => {
  const game = createGame();
  const moved = movePlayer(game, DIRECTIONS.RIGHT);
  assert.deepStrictEqual(moved.player, { row: 1, column: 2 });
  assert.strictEqual(moved.moves, 1);
  assert.strictEqual(moved.hasKey, false);
  assert.strictEqual(moved.status, 'playing');
});

test('열쇠 칸에 도착하면 열쇠를 얻는다', () => {
  let game = createGame();
  game = movePlayer(game, DIRECTIONS.RIGHT);
  game = movePlayer(game, DIRECTIONS.RIGHT);
  game = movePlayer(game, DIRECTIONS.RIGHT);
  assert.deepStrictEqual(game.player, { row: 1, column: 4 });
  assert.strictEqual(game.hasKey, true);
  assert.strictEqual(game.message, '열쇠를 얻었습니다. 이제 출구로 가세요!');
});

test('열쇠가 없으면 출구로 나갈 수 없고 열쇠가 있으면 승리한다', () => {
  const nearExit = createGame({ player: { row: 5, column: 4 } });
  const blocked = movePlayer(nearExit, DIRECTIONS.RIGHT);
  assert.deepStrictEqual(blocked.player, nearExit.player);
  assert.strictEqual(blocked.status, 'playing');
  assert.strictEqual(blocked.message, '열쇠가 있어야 문을 열 수 있습니다.');

  const withKey = createGame({ player: { row: 5, column: 4 }, hasKey: true, moves: 8 });
  const won = movePlayer(withKey, DIRECTIONS.RIGHT);
  assert.deepStrictEqual(won.player, { row: 5, column: 5 });
  assert.strictEqual(won.status, 'won');
  assert.strictEqual(won.moves, 9);
  assert.strictEqual(statusText(won), '탈출 성공! 9번 만에 미로를 빠져나왔습니다.');
});
