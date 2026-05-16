const BOARD_SIZE = 12;
const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

function createGame(options = {}) {
  const direction = options.direction || 'right';
  return {
    snake: options.snake || [{ x: 6, y: 6 }],
    food: Object.hasOwn(options, 'food') ? options.food : { x: 8, y: 6 },
    direction,
    movementDirection: options.movementDirection || direction,
    score: options.score || 0,
    status: options.status || '진행 중',
  };
}

function isSameCell(a, b) {
  return Boolean(a && b && a.x === b.x && a.y === b.y);
}

function isOpposite(first, second) {
  return (
    (first === 'up' && second === 'down') ||
    (first === 'down' && second === 'up') ||
    (first === 'left' && second === 'right') ||
    (first === 'right' && second === 'left')
  );
}

function changeDirection(game, direction) {
  const cannotReverse = game.snake.length > 1 && isOpposite(game.movementDirection, direction);
  if (!DIRECTIONS[direction] || cannotReverse) {
    return game;
  }

  return { ...game, direction };
}

function isWall(cell) {
  return cell.x < 0 || cell.y < 0 || cell.x >= BOARD_SIZE || cell.y >= BOARD_SIZE;
}

function isSnakeCell(snake, cell) {
  return snake.some((part) => isSameCell(part, cell));
}

function defaultFoodPicker(snake) {
  for (let y = 0; y < BOARD_SIZE; y += 1) {
    for (let x = 0; x < BOARD_SIZE; x += 1) {
      const cell = { x, y };
      if (!isSnakeCell(snake, cell)) {
        return cell;
      }
    }
  }

  return null;
}

function stepGame(game, pickFood = defaultFoodPicker) {
  if (game.status !== '진행 중') {
    return game;
  }

  const movement = DIRECTIONS[game.direction];
  const head = game.snake[0];
  const nextHead = { x: head.x + movement.x, y: head.y + movement.y };
  const eatsFood = isSameCell(nextHead, game.food);
  const nextSnake = [nextHead].concat(eatsFood ? game.snake : game.snake.slice(0, -1));

  if (isWall(nextHead) || isSnakeCell(nextSnake.slice(1), nextHead)) {
    return { ...game, status: '게임 종료' };
  }

  const nextFood = eatsFood ? pickFood(nextSnake) : game.food;

  return {
    ...game,
    snake: nextSnake,
    food: nextFood,
    score: game.score + (eatsFood ? 1 : 0),
    status: eatsFood && nextFood === null ? '승리' : game.status,
    movementDirection: game.direction,
  };
}

const gameLogic = {
  BOARD_SIZE,
  createGame,
  changeDirection,
  stepGame,
};

if (typeof module !== 'undefined') {
  module.exports = gameLogic;
}

if (typeof window !== 'undefined') {
  window.gameLogic = gameLogic;
}
