const assert = require('assert');
const {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  createGame,
  movePlayer,
  fireLaser,
  tickGame,
  enemyCells,
  isOccupied,
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

test('새 게임은 플레이어와 침략자를 정해진 위치에 배치한다', () => {
  const game = createGame();
  assert.strictEqual(game.playerX, Math.floor(BOARD_WIDTH / 2));
  assert.strictEqual(game.status, '진행 중');
  assert.strictEqual(game.score, 0);
  assert.strictEqual(game.enemies.length, 8);
  assert.deepStrictEqual(enemyCells(game).slice(0, 2), [
    { x: 2, y: 1 },
    { x: 4, y: 1 },
  ]);
});

test('플레이어는 보드 밖으로 이동하지 않는다', () => {
  const left = movePlayer(createGame({ playerX: 0 }), -1);
  const right = movePlayer(createGame({ playerX: BOARD_WIDTH - 1 }), 1);
  assert.strictEqual(left.playerX, 0);
  assert.strictEqual(right.playerX, BOARD_WIDTH - 1);
});

test('레이저는 한 번만 발사되며 위로 이동한다', () => {
  const fired = fireLaser(createGame({ playerX: 5 }));
  assert.deepStrictEqual(fired.laser, { x: 5, y: BOARD_HEIGHT - 2 });

  const ignored = fireLaser(fired);
  assert.deepStrictEqual(ignored.laser, fired.laser);

  const ticked = tickGame(fired);
  assert.deepStrictEqual(ticked.laser, { x: 5, y: BOARD_HEIGHT - 3 });
});

test('레이저가 침략자를 맞히면 점수가 오르고 침략자가 제거된다', () => {
  const game = createGame({
    laser: { x: 2, y: 2 },
    enemies: [{ x: 2, y: 1 }, { x: 4, y: 1 }],
  });
  const ticked = tickGame(game);
  assert.strictEqual(ticked.score, 10);
  assert.strictEqual(ticked.laser, null);
  assert.deepStrictEqual(ticked.enemies, [{ x: 4, y: 1 }]);
});

test('침략자가 벽에 닿으면 방향을 바꾸고 한 칸 내려온다', () => {
  const game = createGame({
    direction: 1,
    enemies: [{ x: BOARD_WIDTH - 1, y: 2 }],
    stepsUntilEnemyMove: 1,
  });
  const ticked = tickGame(game);
  assert.strictEqual(ticked.direction, -1);
  assert.deepStrictEqual(ticked.enemies, [{ x: BOARD_WIDTH - 1, y: 3 }]);
});

test('모든 침략자를 제거하면 승리한다', () => {
  const game = createGame({ laser: { x: 2, y: 2 }, enemies: [{ x: 2, y: 1 }] });
  const ticked = tickGame(game);
  assert.strictEqual(ticked.status, '승리');
  assert.strictEqual(ticked.message, '침략자를 모두 막았습니다!');
});

test('침략자가 방어선에 닿으면 게임이 끝난다', () => {
  const game = createGame({
    enemies: [{ x: 5, y: BOARD_HEIGHT - 2 }],
    stepsUntilEnemyMove: 1,
  });
  const ticked = tickGame(game);
  assert.strictEqual(ticked.status, '게임 종료');
  assert.strictEqual(isOccupied(ticked, 5, BOARD_HEIGHT - 1), false);
});
