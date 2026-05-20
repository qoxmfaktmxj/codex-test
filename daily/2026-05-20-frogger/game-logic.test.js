const assert = require('assert');
const {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  START_X,
  START_Y,
  createGame,
  movePlayer,
  tickGame,
  carCells,
  hasCarAt,
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

test('새 게임은 개구리와 자동차를 정해진 위치에 배치한다', () => {
  const game = createGame();
  assert.deepStrictEqual(game.player, { x: START_X, y: START_Y });
  assert.strictEqual(game.status, '진행 중');
  assert.strictEqual(game.score, 0);
  assert.strictEqual(game.cars.length, 10);
  assert.strictEqual(BOARD_HEIGHT, 7);
  assert.ok(carCells(game).every((car) => car.x >= 0 && car.x < BOARD_WIDTH));
});

test('개구리는 판 밖으로 이동하지 않는다', () => {
  const left = movePlayer(createGame({ player: { x: 0, y: 6 } }), -1, 0);
  const right = movePlayer(createGame({ player: { x: BOARD_WIDTH - 1, y: 6 } }), 1, 0);
  const bottom = movePlayer(createGame({ player: { x: 4, y: START_Y } }), 0, 1);
  assert.deepStrictEqual(left.player, { x: 0, y: 6 });
  assert.deepStrictEqual(right.player, { x: BOARD_WIDTH - 1, y: 6 });
  assert.deepStrictEqual(bottom.player, { x: 4, y: START_Y });
});

test('비정상 개구리 옵션은 시작 위치로 보정한다', () => {
  const game = createGame({ player: undefined });
  const partial = createGame({ player: { x: 2 } });
  assert.deepStrictEqual(game.player, { x: START_X, y: START_Y });
  assert.deepStrictEqual(partial.player, { x: 2, y: START_Y });
});

test('개구리가 도착 줄에 닿으면 승리한다', () => {
  const game = movePlayer(createGame({ player: { x: 4, y: 1 }, cars: [] }), 0, -1);
  assert.strictEqual(game.status, '승리');
  assert.strictEqual(game.score, 100);
  assert.strictEqual(game.message, '무사히 연못에 도착했습니다!');
});

test('자동차는 방향대로 움직이고 가장자리를 넘어가면 반대편에서 나타난다', () => {
  const game = createGame({
    player: { x: 4, y: 6 },
    cars: [
      { x: BOARD_WIDTH - 1, y: 2, direction: 1 },
      { x: 0, y: 3, direction: -1 },
    ],
  });
  const ticked = tickGame(game);
  assert.deepStrictEqual(ticked.cars, [
    { x: 0, y: 2, direction: 1 },
    { x: BOARD_WIDTH - 1, y: 3, direction: -1 },
  ]);
});

test('자동차가 있는 칸으로 이동하면 게임이 끝난다', () => {
  const game = createGame({ player: { x: 3, y: 4 }, cars: [{ x: 4, y: 4, direction: 1 }] });
  const moved = movePlayer(game, 1, 0);
  assert.strictEqual(moved.status, '게임 종료');
  assert.strictEqual(moved.message, '차에 부딪혔습니다.');
});

test('자동차가 움직여 개구리와 만나도 게임이 끝난다', () => {
  const game = createGame({ player: { x: 5, y: 3 }, cars: [{ x: 4, y: 3, direction: 1 }] });
  const ticked = tickGame(game);
  assert.strictEqual(ticked.status, '게임 종료');
  assert.strictEqual(hasCarAt(ticked, 5, 3), true);
});

test('끝난 게임은 더 움직이지 않는다', () => {
  const game = createGame({ status: '게임 종료', player: { x: 4, y: 4 }, cars: [{ x: 1, y: 1, direction: 1 }] });
  assert.deepStrictEqual(movePlayer(game, 0, -1), game);
  assert.deepStrictEqual(tickGame(game), game);
});
