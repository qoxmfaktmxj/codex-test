const assert = require('node:assert/strict');
const {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  PADDLE_WIDTH,
  createGame,
  movePaddle,
  tickGame,
} = require('./game-logic');

function test(name, fn) {
  try {
    fn();
    console.log(`ok - ${name}`);
  } catch (error) {
    console.error(`not ok - ${name}`);
    throw error;
  }
}

test('새 게임은 벽돌, 패들, 공, 한글 상태를 준비한다', () => {
  const game = createGame();

  assert.equal(BOARD_WIDTH, 12);
  assert.equal(BOARD_HEIGHT, 10);
  assert.equal(PADDLE_WIDTH, 3);
  assert.equal(game.paddleX, 4);
  assert.deepEqual(game.ball, { x: 5, y: 7, dx: 1, dy: -1 });
  assert.equal(game.bricks.length, 24);
  assert.equal(game.score, 0);
  assert.equal(game.status, '진행 중');
});

test('패들은 게임판 밖으로 나가지 않는다', () => {
  const game = createGame({ paddleX: 1 });

  assert.equal(movePaddle(game, -5).paddleX, 0);
  assert.equal(movePaddle(game, 20).paddleX, BOARD_WIDTH - PADDLE_WIDTH);
});

test('공은 벽에 닿으면 가로 방향을 튕긴다', () => {
  const game = createGame({ ball: { x: 0, y: 5, dx: -1, dy: -1 } });
  const next = tickGame(game);

  assert.deepEqual(next.ball, { x: 1, y: 4, dx: 1, dy: -1 });
});

test('공은 천장에 닿으면 아래로 튕긴다', () => {
  const game = createGame({
    bricks: [],
    ball: { x: 4, y: 0, dx: 1, dy: -1 },
  });
  const next = tickGame(game);

  assert.deepEqual(next.ball, { x: 5, y: 1, dx: 1, dy: 1 });
});

test('패들 위에 닿은 공은 위로 튕긴다', () => {
  const game = createGame({
    paddleX: 4,
    ball: { x: 5, y: 8, dx: 1, dy: 1 },
  });
  const next = tickGame(game);

  assert.equal(next.ball.y, 7);
  assert.equal(next.ball.dy, -1);
  assert.equal(next.status, '진행 중');
});

test('벽돌에 닿으면 벽돌이 사라지고 점수가 오른다', () => {
  const game = createGame({
    bricks: [{ x: 6, y: 2 }, { x: 7, y: 2 }],
    ball: { x: 5, y: 3, dx: 1, dy: -1 },
  });
  const next = tickGame(game);

  assert.deepEqual(next.bricks, [{ x: 7, y: 2 }]);
  assert.equal(next.score, 10);
  assert.equal(next.ball.dy, 1);
});

test('마지막 벽돌을 깨면 승리한다', () => {
  const game = createGame({
    bricks: [{ x: 6, y: 2 }],
    ball: { x: 5, y: 3, dx: 1, dy: -1 },
  });
  const next = tickGame(game);

  assert.equal(next.bricks.length, 0);
  assert.equal(next.status, '승리');
});

test('공이 바닥 아래로 지나가면 게임이 끝난다', () => {
  const game = createGame({ ball: { x: 2, y: 9, dx: 1, dy: 1 } });
  const next = tickGame(game);

  assert.equal(next.status, '게임 종료');
});

test('종료된 게임은 더 움직이지 않는다', () => {
  const game = createGame({ status: '게임 종료' });

  assert.deepEqual(tickGame(game), game);
});
