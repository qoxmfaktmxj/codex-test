const assert = require('node:assert/strict');
const {
  BOARD_SIZE,
  WIN_LENGTH,
  createGame,
  turnSnake,
  moveSnake,
  cellKey,
  boardCells,
  directionLabel,
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

test('starts a Korean snake game in the center of the board', () => {
  const game = createGame({ food: { row: 1, col: 1 } });

  assert.equal(BOARD_SIZE, 8);
  assert.equal(WIN_LENGTH, 8);
  assert.deepEqual(game.snake, [
    { row: 4, col: 3 },
    { row: 4, col: 2 },
    { row: 4, col: 1 },
  ]);
  assert.deepEqual(game.food, { row: 1, col: 1 });
  assert.equal(game.direction, 'right');
  assert.equal(game.status, 'playing');
  assert.equal(game.score, 0);
  assert.equal(game.message, '방향을 정하고 먹이를 모으세요.');
});

test('rejects an immediate reverse turn but accepts a perpendicular turn', () => {
  const game = createGame({ food: { row: 1, col: 1 } });

  assert.equal(turnSnake(game, 'left'), game);
  assert.equal(turnSnake(game, 'up').direction, 'up');
});

test('moves one step without eating and keeps the same length', () => {
  const game = createGame({ food: { row: 1, col: 1 } });
  const next = moveSnake(game);

  assert.deepEqual(next.snake, [
    { row: 4, col: 4 },
    { row: 4, col: 3 },
    { row: 4, col: 2 },
  ]);
  assert.equal(next.score, 0);
  assert.equal(next.status, 'playing');
  assert.equal(next.message, '좋아요. 길이 3입니다.');
});

test('grows when eating food and places the next food on an empty cell', () => {
  const game = createGame({ food: { row: 4, col: 4 } });
  const next = moveSnake(game, () => ({ row: 0, col: 0 }));

  assert.equal(next.snake.length, 4);
  assert.deepEqual(next.snake[0], { row: 4, col: 4 });
  assert.deepEqual(next.food, { row: 0, col: 0 });
  assert.equal(next.score, 1);
  assert.equal(next.message, '먹이를 먹었습니다. 길이 4입니다.');
});

test('skips occupied random food cells until an empty cell is found', () => {
  const game = createGame({ food: { row: 4, col: 4 } });
  const picks = [
    { row: 4, col: 4 },
    { row: 4, col: 3 },
    { row: 2, col: 2 },
  ];
  const next = moveSnake(game, () => picks.shift());

  assert.deepEqual(next.food, { row: 2, col: 2 });
});

test('wins when the snake reaches the target length', () => {
  const game = {
    snake: [
      { row: 1, col: 6 },
      { row: 1, col: 5 },
      { row: 1, col: 4 },
      { row: 1, col: 3 },
      { row: 1, col: 2 },
      { row: 1, col: 1 },
      { row: 1, col: 0 },
    ],
    food: { row: 1, col: 7 },
    direction: 'right',
    status: 'playing',
    score: 4,
    message: '계속 진행하세요.',
  };
  const next = moveSnake(game);

  assert.equal(next.status, 'won');
  assert.equal(next.snake.length, WIN_LENGTH);
  assert.equal(next.message, '성공! 뱀이 8칸까지 자랐습니다.');
});

test('loses when hitting a wall or its own body', () => {
  const wallGame = {
    ...createGame({ food: { row: 1, col: 1 } }),
    snake: [{ row: 0, col: 7 }, { row: 0, col: 6 }, { row: 0, col: 5 }],
    direction: 'right',
  };
  const bodyGame = {
    ...createGame({ food: { row: 7, col: 7 } }),
    snake: [
      { row: 2, col: 2 },
      { row: 2, col: 1 },
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 1, col: 3 },
      { row: 2, col: 3 },
    ],
    direction: 'up',
  };

  assert.equal(moveSnake(wallGame).status, 'lost');
  assert.equal(moveSnake(wallGame).message, '벽에 부딪혔습니다. 다시 도전하세요.');
  assert.equal(moveSnake(bodyGame).status, 'lost');
  assert.equal(moveSnake(bodyGame).message, '몸에 부딪혔습니다. 다시 도전하세요.');
});

test('formats helpers for the Korean UI', () => {
  assert.equal(cellKey({ row: 2, col: 5 }), '2-5');
  assert.equal(boardCells().length, 64);
  assert.equal(directionLabel('left'), '왼쪽');
  assert.equal(directionLabel('down'), '아래');
});
