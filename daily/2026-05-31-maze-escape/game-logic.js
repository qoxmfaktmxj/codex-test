const TILE = {
  WALL: '#',
  PATH: '.',
  START: 'S',
  KEY: 'K',
  EXIT: 'E',
};

const DIRECTIONS = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right',
};

const DIRECTION_STEPS = {
  [DIRECTIONS.UP]: [-1, 0],
  [DIRECTIONS.DOWN]: [1, 0],
  [DIRECTIONS.LEFT]: [0, -1],
  [DIRECTIONS.RIGHT]: [0, 1],
};

const DEFAULT_MAZE = [
  '#######',
  '#S..K.#',
  '#.###.#',
  '#...#.#',
  '#.#...#',
  '#...#E#',
  '#######',
].map((row) => row.split(''));

function cloneMaze(maze) {
  return maze.map((row) => row.slice());
}

function findTile(maze, tile) {
  for (let row = 0; row < maze.length; row += 1) {
    for (let column = 0; column < maze[row].length; column += 1) {
      if (maze[row][column] === tile) return { row, column };
    }
  }
  return null;
}

function createGame(options = {}) {
  const maze = cloneMaze(options.maze || DEFAULT_MAZE);
  const start = findTile(maze, TILE.START) || { row: 0, column: 0 };
  return {
    maze,
    player: options.player ? { ...options.player } : start,
    hasKey: Boolean(options.hasKey),
    moves: options.moves || 0,
    status: options.status || 'playing',
    message: options.message || '열쇠를 찾아 출구로 탈출하세요.',
  };
}

function getTile(maze, position) {
  if (!maze[position.row] || maze[position.row][position.column] === undefined) return TILE.WALL;
  return maze[position.row][position.column];
}

function isWalkable(tile, hasKey) {
  if (tile === TILE.WALL) return false;
  if (tile === TILE.EXIT && !hasKey) return false;
  return true;
}

function movePlayer(game, direction) {
  if (game.status !== 'playing') return { ...game, player: { ...game.player }, maze: cloneMaze(game.maze) };

  const step = DIRECTION_STEPS[direction];
  if (!step) throw new Error('알 수 없는 방향입니다.');

  const nextPlayer = {
    row: game.player.row + step[0],
    column: game.player.column + step[1],
  };
  const targetTile = getTile(game.maze, nextPlayer);

  if (targetTile === TILE.EXIT && !game.hasKey) {
    return { ...game, player: { ...game.player }, maze: cloneMaze(game.maze), message: '열쇠가 있어야 문을 열 수 있습니다.' };
  }

  if (!isWalkable(targetTile, game.hasKey)) {
    return { ...game, player: { ...game.player }, maze: cloneMaze(game.maze), message: '벽에 막혔습니다.' };
  }

  const hasKey = game.hasKey || targetTile === TILE.KEY;
  const moves = game.moves + 1;
  const status = targetTile === TILE.EXIT && hasKey ? 'won' : 'playing';
  let message = '좋아요, 계속 이동하세요.';
  if (targetTile === TILE.KEY && !game.hasKey) message = '열쇠를 얻었습니다. 이제 출구로 가세요!';
  if (status === 'won') message = `탈출 성공! ${moves}번 만에 미로를 빠져나왔습니다.`;

  return {
    ...game,
    maze: cloneMaze(game.maze),
    player: nextPlayer,
    hasKey,
    moves,
    status,
    message,
  };
}

function statusText(game) {
  if (game.status === 'won') return `탈출 성공! ${game.moves}번 만에 미로를 빠져나왔습니다.`;
  const keyText = game.hasKey ? '열쇠 있음' : '열쇠 없음';
  return `${keyText} · 이동 ${game.moves}번`;
}

const api = {
  TILE,
  DIRECTIONS,
  DEFAULT_MAZE,
  createGame,
  getTile,
  isWalkable,
  movePlayer,
  statusText,
};

if (typeof module !== 'undefined' && module.exports) module.exports = api;
if (typeof window !== 'undefined') window.MazeEscapeLogic = api;
