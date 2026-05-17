const BOARD_WIDTH = 12;
const BOARD_HEIGHT = 10;
const PADDLE_WIDTH = 3;
const PADDLE_Y = BOARD_HEIGHT - 2;

function makeBricks() {
  const bricks = [];
  for (let y = 1; y <= 3; y += 1) {
    for (let x = 2; x <= 9; x += 1) {
      bricks.push({ x, y });
    }
  }
  return bricks;
}

function createGame(options = {}) {
  return {
    paddleX: Object.hasOwn(options, 'paddleX') ? options.paddleX : 4,
    ball: options.ball || { x: 5, y: 7, dx: 1, dy: -1 },
    bricks: options.bricks || makeBricks(),
    score: options.score || 0,
    status: options.status || '진행 중',
  };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function movePaddle(game, amount) {
  if (game.status !== '진행 중') {
    return game;
  }

  return {
    ...game,
    paddleX: clamp(game.paddleX + amount, 0, BOARD_WIDTH - PADDLE_WIDTH),
  };
}

function isSameCell(a, b) {
  return a.x === b.x && a.y === b.y;
}

function isPaddleHit(game, x, y) {
  return (
    y >= PADDLE_Y &&
    x >= game.paddleX &&
    x < game.paddleX + PADDLE_WIDTH
  );
}

function tickGame(game) {
  if (game.status !== '진행 중') {
    return game;
  }

  let dx = game.ball.dx;
  let dy = game.ball.dy;
  let nextX = game.ball.x + dx;
  let nextY = game.ball.y + dy;

  if (nextX < 0 || nextX >= BOARD_WIDTH) {
    dx *= -1;
    nextX = game.ball.x + dx;
  }

  if (nextY < 0) {
    dy *= -1;
    nextY = game.ball.y + dy;
  }

  if (nextY >= BOARD_HEIGHT) {
    return { ...game, status: '게임 종료' };
  }

  if (dy > 0 && isPaddleHit(game, nextX, nextY)) {
    dy = -1;
    nextY = PADDLE_Y - 1;
  }

  const hitBrick = game.bricks.find((brick) => isSameCell(brick, { x: nextX, y: nextY }));
  if (hitBrick) {
    const bricks = game.bricks.filter((brick) => !isSameCell(brick, hitBrick));
    const status = bricks.length === 0 ? '승리' : game.status;
    return {
      ...game,
      ball: { x: nextX, y: nextY, dx, dy: dy * -1 },
      bricks,
      score: game.score + 10,
      status,
    };
  }

  return {
    ...game,
    ball: { x: nextX, y: nextY, dx, dy },
  };
}

const gameLogic = {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  PADDLE_WIDTH,
  PADDLE_Y,
  createGame,
  movePaddle,
  tickGame,
};

if (typeof module !== 'undefined') {
  module.exports = gameLogic;
}

if (typeof window !== 'undefined') {
  window.gameLogic = gameLogic;
}
