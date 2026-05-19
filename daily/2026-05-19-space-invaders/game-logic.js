const BOARD_WIDTH = 11;
const BOARD_HEIGHT = 9;
const ENEMY_MOVE_INTERVAL = 2;
const DEFENSE_LINE_Y = BOARD_HEIGHT - 2;

function hasOption(options, key) {
  return Object.prototype.hasOwnProperty.call(options, key);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function makeEnemies() {
  const enemies = [];
  for (let y = 1; y <= 2; y += 1) {
    for (let x = 2; x <= 8; x += 2) {
      enemies.push({ x, y });
    }
  }
  return enemies;
}

function cloneCells(cells) {
  return cells.map((cell) => ({ x: cell.x, y: cell.y }));
}

function createGame(options = {}) {
  return {
    playerX: hasOption(options, 'playerX') ? clamp(options.playerX, 0, BOARD_WIDTH - 1) : Math.floor(BOARD_WIDTH / 2),
    laser: hasOption(options, 'laser') && options.laser ? { ...options.laser } : null,
    enemies: Array.isArray(options.enemies) ? cloneCells(options.enemies) : makeEnemies(),
    direction: hasOption(options, 'direction') ? options.direction : 1,
    stepsUntilEnemyMove: hasOption(options, 'stepsUntilEnemyMove')
      ? options.stepsUntilEnemyMove
      : ENEMY_MOVE_INTERVAL,
    score: hasOption(options, 'score') ? options.score : 0,
    status: options.status || '진행 중',
    message: options.message || '침략자가 내려오기 전에 막으세요!',
  };
}

function isPlaying(game) {
  return game.status === '진행 중';
}

function enemyCells(game) {
  return cloneCells(game.enemies);
}

function isOccupied(game, x, y) {
  return game.enemies.some((enemy) => enemy.x === x && enemy.y === y);
}

function movePlayer(game, amount) {
  if (!isPlaying(game)) {
    return game;
  }

  return {
    ...game,
    playerX: clamp(game.playerX + amount, 0, BOARD_WIDTH - 1),
  };
}

function fireLaser(game) {
  if (!isPlaying(game) || game.laser) {
    return game;
  }

  return {
    ...game,
    laser: { x: game.playerX, y: BOARD_HEIGHT - 2 },
    message: '레이저 발사!',
  };
}

function moveLaser(game) {
  if (!game.laser) {
    return { ...game, laser: null };
  }

  const nextLaser = { x: game.laser.x, y: game.laser.y - 1 };
  if (nextLaser.y < 0) {
    return { ...game, laser: null };
  }

  const hit = game.enemies.find((enemy) => enemy.x === nextLaser.x && enemy.y === nextLaser.y);
  if (!hit) {
    return { ...game, laser: nextLaser };
  }

  const enemies = game.enemies.filter((enemy) => enemy !== hit);
  const won = enemies.length === 0;
  return {
    ...game,
    laser: null,
    enemies,
    score: game.score + 10,
    status: won ? '승리' : game.status,
    message: won ? '침략자를 모두 막았습니다!' : '명중했습니다!',
  };
}

function shouldDescend(enemies, direction) {
  return enemies.some((enemy) => {
    const nextX = enemy.x + direction;
    return nextX < 0 || nextX >= BOARD_WIDTH;
  });
}

function moveEnemies(game) {
  if (game.stepsUntilEnemyMove > 1) {
    return {
      ...game,
      stepsUntilEnemyMove: game.stepsUntilEnemyMove - 1,
    };
  }

  if (game.enemies.some((enemy) => enemy.y >= DEFENSE_LINE_Y)) {
    return {
      ...game,
      status: '게임 종료',
      message: '방어선이 뚫렸습니다.',
    };
  }

  const descend = shouldDescend(game.enemies, game.direction);
  const direction = descend ? game.direction * -1 : game.direction;
  const enemies = game.enemies.map((enemy) => ({
    x: descend ? enemy.x : enemy.x + direction,
    y: descend ? enemy.y + 1 : enemy.y,
  }));

  const status = enemies.some((enemy) => enemy.y >= DEFENSE_LINE_Y + 1) ? '게임 종료' : game.status;
  return {
    ...game,
    enemies,
    direction,
    stepsUntilEnemyMove: ENEMY_MOVE_INTERVAL,
    status,
    message: status === '게임 종료' ? '방어선이 뚫렸습니다.' : game.message,
  };
}

function tickGame(game) {
  if (!isPlaying(game)) {
    return game;
  }

  const afterLaser = moveLaser(game);
  if (!isPlaying(afterLaser)) {
    return afterLaser;
  }

  return moveEnemies(afterLaser);
}

const gameLogic = {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  ENEMY_MOVE_INTERVAL,
  DEFENSE_LINE_Y,
  createGame,
  movePlayer,
  fireLaser,
  tickGame,
  enemyCells,
  isOccupied,
};

if (typeof module !== 'undefined') {
  module.exports = gameLogic;
}

if (typeof window !== 'undefined') {
  window.gameLogic = gameLogic;
}
