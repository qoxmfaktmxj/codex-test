const assert = require('assert');
const {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  PADDLE_HEIGHT,
  createGame,
  movePlayer,
  stepGame,
  resetRound,
  clampPaddleY,
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

test('새 게임은 중앙 공과 왼쪽 플레이어, 오른쪽 상대를 배치한다', () => {
  const game = createGame();
  assert.deepStrictEqual(game.ball, { x: Math.floor(BOARD_WIDTH / 2), y: Math.floor(BOARD_HEIGHT / 2), dx: -1, dy: 1 });
  assert.strictEqual(game.player.y, Math.floor((BOARD_HEIGHT - PADDLE_HEIGHT) / 2));
  assert.strictEqual(game.opponent.y, Math.floor((BOARD_HEIGHT - PADDLE_HEIGHT) / 2));
  assert.deepStrictEqual(game.score, { player: 0, opponent: 0 });
  assert.strictEqual(game.status, '진행 중');
});

test('받침대는 경기장 밖으로 나가지 않는다', () => {
  assert.strictEqual(clampPaddleY(-3), 0);
  assert.strictEqual(clampPaddleY(BOARD_HEIGHT), BOARD_HEIGHT - PADDLE_HEIGHT);
  const up = movePlayer(createGame({ player: { y: 0 } }), -2);
  const down = movePlayer(createGame({ player: { y: BOARD_HEIGHT - PADDLE_HEIGHT } }), 4);
  assert.strictEqual(up.player.y, 0);
  assert.strictEqual(down.player.y, BOARD_HEIGHT - PADDLE_HEIGHT);
});

test('공은 위아래 벽에 닿으면 세로 방향을 바꾼다', () => {
  const top = stepGame(createGame({ ball: { x: 5, y: 0, dx: 1, dy: -1 } }));
  const bottom = stepGame(createGame({ ball: { x: 5, y: BOARD_HEIGHT - 1, dx: -1, dy: 1 } }));
  assert.strictEqual(top.ball.dy, 1);
  assert.strictEqual(top.ball.y, 1);
  assert.strictEqual(bottom.ball.dy, -1);
  assert.strictEqual(bottom.ball.y, BOARD_HEIGHT - 2);
});

test('왼쪽 받침대에 맞은 공은 오른쪽으로 튕긴다', () => {
  const game = createGame({
    player: { y: 3 },
    opponent: { y: 3 },
    ball: { x: 1, y: 4, dx: -1, dy: 0 },
  });
  const next = stepGame(game);
  assert.strictEqual(next.ball.x, 1);
  assert.strictEqual(next.ball.dx, 1);
  assert.strictEqual(next.message, '받아쳤습니다!');
});

test('오른쪽 받침대에 맞은 공은 왼쪽으로 튕긴다', () => {
  const game = createGame({
    player: { y: 3 },
    opponent: { y: 4 },
    ball: { x: BOARD_WIDTH - 2, y: 5, dx: 1, dy: 0 },
  });
  const next = stepGame(game);
  assert.strictEqual(next.ball.x, BOARD_WIDTH - 2);
  assert.strictEqual(next.ball.dx, -1);
  assert.strictEqual(next.message, '상대가 받아쳤습니다.');
});

test('공을 놓치면 상대 점수가 오르고 라운드가 다시 시작된다', () => {
  const game = createGame({
    player: { y: 0 },
    opponent: { y: 3 },
    ball: { x: 0, y: BOARD_HEIGHT - 1, dx: -1, dy: 0 },
  });
  const next = stepGame(game);
  assert.deepStrictEqual(next.score, { player: 0, opponent: 1 });
  assert.strictEqual(next.ball.x, Math.floor(BOARD_WIDTH / 2));
  assert.strictEqual(next.ball.dx, 1);
  assert.strictEqual(next.message, '상대가 득점했습니다. 다시 받아내세요.');
});

test('세 점을 먼저 얻으면 게임이 끝난다', () => {
  const game = createGame({
    score: { player: 2, opponent: 0 },
    player: { y: 3 },
    opponent: { y: 0 },
    ball: { x: BOARD_WIDTH - 1, y: BOARD_HEIGHT - 1, dx: 1, dy: 0 },
  });
  const next = stepGame(game);
  assert.strictEqual(next.status, '승리');
  assert.deepStrictEqual(next.score, { player: 3, opponent: 0 });
  assert.strictEqual(next.message, '세 점을 먼저 얻었습니다. 승리!');
});

test('끝난 게임은 움직이지 않고 리셋하면 새 라운드가 된다', () => {
  const finished = createGame({ status: '게임 종료', score: { player: 0, opponent: 3 } });
  assert.deepStrictEqual(movePlayer(finished, 1), finished);
  assert.deepStrictEqual(stepGame(finished), finished);
  const reset = resetRound(finished, -1, '새 라운드입니다.');
  assert.strictEqual(reset.status, '진행 중');
  assert.strictEqual(reset.ball.dx, -1);
  assert.strictEqual(reset.message, '새 라운드입니다.');
});
