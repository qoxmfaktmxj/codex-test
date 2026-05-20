const BOARD_WIDTH = 9;
const BOARD_HEIGHT = 7;
const START_X = Math.floor(BOARD_WIDTH / 2);
const START_Y = BOARD_HEIGHT - 1;

const DEFAULT_CARS = [
  { x: 1, y: 1, direction: 1 },
  { x: 5, y: 1, direction: 1 },
  { x: 2, y: 2, direction: -1 },
  { x: 7, y: 2, direction: -1 },
  { x: 0, y: 3, direction: 1 },
  { x: 4, y: 3, direction: 1 },
  { x: 8, y: 3, direction: 1 },
  { x: 3, y: 4, direction: -1 },
  { x: 6, y: 4, direction: -1 },
  { x: 2, y: 5, direction: 1 },
];

function hasOption(options, key) {
  return Object.prototype.hasOwnProperty.call(options, key);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function wrapX(x) {
  return (x + BOARD_WIDTH) % BOARD_WIDTH;
}

function cloneCars(cars) {
  return cars.map((car) => ({ x: wrapX(car.x), y: car.y, direction: car.direction < 0 ? -1 : 1 }));
}

function clonePlayer(player = {}) {
  return {
    x: clamp(Number.isFinite(player.x) ? player.x : START_X, 0, BOARD_WIDTH - 1),
    y: clamp(Number.isFinite(player.y) ? player.y : START_Y, 0, BOARD_HEIGHT - 1),
  };
}

function createGame(options = {}) {
  return {
    player: hasOption(options, 'player') ? clonePlayer(options.player) : { x: START_X, y: START_Y },
    cars: Array.isArray(options.cars) ? cloneCars(options.cars) : cloneCars(DEFAULT_CARS),
    tick: hasOption(options, 'tick') ? options.tick : 0,
    score: hasOption(options, 'score') ? options.score : 0,
    status: options.status || '진행 중',
    message: options.message || '차를 피해 위쪽 연못까지 건너세요!',
  };
}

function isPlaying(game) {
  return game.status === '진행 중';
}

function carCells(game) {
  return cloneCars(game.cars);
}

function hasCarAt(game, x, y) {
  return game.cars.some((car) => car.x === x && car.y === y);
}

function endByCrash(game) {
  return {
    ...game,
    status: '게임 종료',
    message: '차에 부딪혔습니다.',
  };
}

function winGame(game) {
  return {
    ...game,
    status: '승리',
    score: 100,
    message: '무사히 연못에 도착했습니다!',
  };
}

function movePlayer(game, dx, dy) {
  if (!isPlaying(game)) {
    return game;
  }

  const player = {
    x: clamp(game.player.x + dx, 0, BOARD_WIDTH - 1),
    y: clamp(game.player.y + dy, 0, BOARD_HEIGHT - 1),
  };
  const moved = {
    ...game,
    player,
    message: player.y === START_Y ? '출발선입니다. 위로 건너세요!' : '좋아요, 계속 건너세요!',
  };

  if (player.y === 0) {
    return winGame(moved);
  }

  if (hasCarAt(moved, player.x, player.y)) {
    return endByCrash(moved);
  }

  return moved;
}

function moveCars(cars) {
  return cars.map((car) => ({
    ...car,
    x: wrapX(car.x + car.direction),
  }));
}

function tickGame(game) {
  if (!isPlaying(game)) {
    return game;
  }

  const ticked = {
    ...game,
    cars: moveCars(game.cars),
    tick: game.tick + 1,
    message: '자동차가 움직였습니다. 다음 발걸음을 고르세요.',
  };

  if (hasCarAt(ticked, ticked.player.x, ticked.player.y)) {
    return endByCrash(ticked);
  }

  return ticked;
}

const gameLogic = {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  START_X,
  START_Y,
  createGame,
  movePlayer,
  tickGame,
  carCells,
  hasCarAt,
};

if (typeof module !== 'undefined') {
  module.exports = gameLogic;
}

if (typeof window !== 'undefined') {
  window.gameLogic = gameLogic;
}
