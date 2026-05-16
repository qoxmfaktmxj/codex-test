const assert = require('node:assert/strict');
const {
  BOARD_SIZE,
  createGame,
  changeDirection,
  stepGame,
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

test('starts with a snake in the center and Korean playing status', () => {
  const game = createGame();

  assert.equal(BOARD_SIZE, 12);
  assert.deepEqual(game.snake, [{ x: 6, y: 6 }]);
  assert.deepEqual(game.food, { x: 8, y: 6 });
  assert.equal(game.direction, 'right');
  assert.equal(game.score, 0);
  assert.equal(game.status, '진행 중');
});

test('moves one cell in the current direction without eating food', () => {
  const game = createGame({ food: { x: 1, y: 1 } });
  const next = stepGame(game);

  assert.deepEqual(next.snake, [{ x: 7, y: 6 }]);
  assert.equal(next.score, 0);
  assert.equal(next.status, '진행 중');
});

test('grows and scores when eating food', () => {
  const game = createGame({
    snake: [{ x: 6, y: 6 }],
    food: { x: 7, y: 6 },
  });
  const next = stepGame(game, () => ({ x: 3, y: 3 }));

  assert.deepEqual(next.snake, [{ x: 7, y: 6 }, { x: 6, y: 6 }]);
  assert.deepEqual(next.food, { x: 3, y: 3 });
  assert.equal(next.score, 1);
});

test('ends the game when the snake hits a wall', () => {
  const game = createGame({
    snake: [{ x: 11, y: 6 }],
    food: { x: 1, y: 1 },
    direction: 'right',
  });
  const next = stepGame(game);

  assert.equal(next.status, '게임 종료');
});

test('rejects an immediate reverse direction', () => {
  const game = createGame({
    snake: [{ x: 6, y: 6 }, { x: 5, y: 6 }],
    direction: 'right',
  });

  assert.equal(changeDirection(game, 'left').direction, 'right');
  assert.equal(changeDirection(game, 'up').direction, 'up');
});

test('allows any starting direction while the snake has one cell', () => {
  const game = createGame({ direction: 'right' });

  assert.equal(changeDirection(game, 'left').direction, 'left');
});

test('prevents a second key press from reversing before the next movement', () => {
  const game = createGame({
    snake: [{ x: 6, y: 6 }, { x: 5, y: 6 }],
    direction: 'right',
  });
  const turned = changeDirection(game, 'up');

  assert.equal(changeDirection(turned, 'left').direction, 'up');
});

test('marks the game won when no empty food cell remains', () => {
  const snake = [];
  for (let y = 0; y < BOARD_SIZE; y += 1) {
    for (let x = 0; x < BOARD_SIZE; x += 1) {
      if ((x !== 0 || y !== 0) && (x !== 1 || y !== 0)) {
        snake.push({ x, y });
      }
    }
  }

  const game = createGame({
    snake: [{ x: 0, y: 0 }].concat(snake),
    food: { x: 1, y: 0 },
    direction: 'right',
    score: BOARD_SIZE * BOARD_SIZE - 1,
  });
  const next = stepGame(game, () => null);

  assert.equal(next.food, null);
  assert.equal(next.status, '승리');
});

test('does not move after the game is no longer playing', () => {
  const game = createGame({ status: '게임 종료' });

  assert.deepEqual(stepGame(game), game);
});

test('preserves a null food cell for completed games', () => {
  const game = createGame({ food: null, status: '승리' });

  assert.equal(game.food, null);
  assert.equal(game.status, '승리');
});
