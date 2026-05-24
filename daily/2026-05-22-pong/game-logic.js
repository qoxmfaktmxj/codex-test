const BOARD_WIDTH = 16;
const BOARD_HEIGHT = 10;
const PADDLE_HEIGHT = 3;
const WIN_SCORE = 3;
const CENTER_X = Math.floor(BOARD_WIDTH / 2);
const CENTER_Y = Math.floor(BOARD_HEIGHT / 2);

function hasOption(options, key) {
  return Object.prototype.hasOwnProperty.call(options, key);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function clampPaddleY(y) {
  const number = Number.isFinite(y) ? y : Math.floor((BOARD_HEIGHT - PADDLE_HEIGHT) / 2);
  return clamp(number, 0, BOARD_HEIGHT - PADDLE_HEIGHT);
}

function clonePaddle(paddle = {}) {
  return { y: clampPaddleY(paddle.y) };
}

function cloneScore(score = {}) {
  return {
    player: Number.isFinite(score.player) ? Math.max(0, score.player) : 0,
    opponent: Number.isFinite(score.opponent) ? Math.max(0, score.opponent) : 0,
  };
}

function normalizeDirection(value, fallback) {
  if (value > 0) return 1;
  if (value < 0) return -1;
  return fallback;
}

function cloneBall(ball = {}) {
  return {
    x: Number.isFinite(ball.x) ? clamp(ball.x, 0, BOARD_WIDTH - 1) : CENTER_X,
    y: Number.isFinite(ball.y) ? clamp(ball.y, 0, BOARD_HEIGHT - 1) : CENTER_Y,
    dx: normalizeDirection(ball.dx, -1),
    dy: Number.isFinite(ball.dy) ? clamp(ball.dy, -1, 1) : 1,
  };
}

function createGame(options = {}) {
  return {
    player: hasOption(options, 'player') ? clonePaddle(options.player) : clonePaddle(),
    opponent: hasOption(options, 'opponent') ? clonePaddle(options.opponent) : clonePaddle(),
    ball: hasOption(options, 'ball') ? cloneBall(options.ball) : cloneBall({ dx: -1, dy: 1 }),
    score: hasOption(options, 'score') ? cloneScore(options.score) : cloneScore(),
    status: options.status || '진행 중',
    message: options.message || '위아래로 움직여 공을 세 번 먼저 받아치세요.',
    tick: Number.isFinite(options.tick) ? options.tick : 0,
  };
}

function isPlaying(game) {
  return game.status === '진행 중';
}

function movePlayer(game, dy) {
  if (!isPlaying(game)) {
    return game;
  }

  return {
    ...game,
    player: { y: clampPaddleY(game.player.y + dy) },
    message: '받침대를 움직였습니다.',
  };
}

function moveOpponentToward(opponent, ballY) {
  const middle = opponent.y + Math.floor(PADDLE_HEIGHT / 2);
  if (ballY > middle) {
    return { y: clampPaddleY(opponent.y + 1) };
  }
  if (ballY < middle) {
    return { y: clampPaddleY(opponent.y - 1) };
  }
  return { ...opponent };
}

function paddleCovers(paddle, y) {
  return y >= paddle.y && y < paddle.y + PADDLE_HEIGHT;
}

function resetRound(game, serveDx, message) {
  return {
    ...game,
    status: '진행 중',
    ball: { x: CENTER_X, y: CENTER_Y, dx: normalizeDirection(serveDx, -1), dy: 1 },
    player: clonePaddle(game.player),
    opponent: clonePaddle(game.opponent),
    message,
  };
}

function finishIfNeeded(game) {
  if (game.score.player >= WIN_SCORE) {
    return { ...game, status: '승리', message: '세 점을 먼저 얻었습니다. 승리!' };
  }
  if (game.score.opponent >= WIN_SCORE) {
    return { ...game, status: '게임 종료', message: '상대가 세 점을 먼저 얻었습니다. 다시 도전하세요.' };
  }
  return game;
}

function scorePoint(game, scorer) {
  const score = {
    ...game.score,
    [scorer]: game.score[scorer] + 1,
  };
  const served = resetRound({ ...game, score }, scorer === 'player' ? -1 : 1, scorer === 'player'
    ? '득점했습니다. 다음 공을 준비하세요.'
    : '상대가 득점했습니다. 다시 받아내세요.');
  return finishIfNeeded(served);
}

function stepGame(game) {
  if (!isPlaying(game)) {
    return game;
  }

  let dx = game.ball.dx;
  let dy = game.ball.dy;
  let nextY = game.ball.y + dy;

  if (nextY < 0 || nextY >= BOARD_HEIGHT) {
    dy *= -1;
    nextY = game.ball.y + dy;
  }

  const opponent = moveOpponentToward(game.opponent, nextY);
  let nextX = game.ball.x + dx;
  const base = { ...game, opponent, tick: game.tick + 1 };

  if (nextX <= 0) {
    if (paddleCovers(game.player, nextY)) {
      return {
        ...base,
        ball: { x: 1, y: nextY, dx: 1, dy },
        message: '받아쳤습니다!',
      };
    }
    return scorePoint(base, 'opponent');
  }

  if (nextX >= BOARD_WIDTH - 1) {
    if (paddleCovers(opponent, nextY)) {
      return {
        ...base,
        ball: { x: BOARD_WIDTH - 2, y: nextY, dx: -1, dy },
        message: '상대가 받아쳤습니다.',
      };
    }
    return scorePoint(base, 'player');
  }

  return {
    ...base,
    ball: { x: nextX, y: nextY, dx, dy },
    message: '공이 움직이고 있습니다.',
  };
}

const gameLogic = {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  PADDLE_HEIGHT,
  WIN_SCORE,
  createGame,
  movePlayer,
  stepGame,
  resetRound,
  clampPaddleY,
  paddleCovers,
};

if (typeof module !== 'undefined') {
  module.exports = gameLogic;
}

if (typeof window !== 'undefined') {
  window.gameLogic = gameLogic;
}
