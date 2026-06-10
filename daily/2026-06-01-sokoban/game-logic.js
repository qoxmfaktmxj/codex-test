const TILE = {
  WALL: '#',
  FLOOR: '.',
  TARGET: 'T',
  PLAYER: 'P',
  PLAYER_ON_TARGET: '+',
  CRATE: 'C',
  CRATE_ON_TARGET: '*',
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

const DEFAULT_BOARD = [
  '#######',
  '#.....#',
  '#.PCT.#',
  '#..C..#',
  '#..T..#',
  '#######',
];

function samePosition(a, b) {
  return a.row === b.row && a.column === b.column;
}

function cloneTerrain(terrain) {
  return terrain.map((row) => row.slice());
}

function cloneCrates(crates) {
  return crates.map((crate) => ({ ...crate }));
}

function parseBoard(board) {
  const rows = board.map((row) => row.split(''));
  const terrain = [];
  const crates = [];
  let player = null;

  rows.forEach((row, rowIndex) => {
    terrain[rowIndex] = [];
    row.forEach((tile, columnIndex) => {
      const position = { row: rowIndex, column: columnIndex };
      if (tile === TILE.WALL) {
        terrain[rowIndex][columnIndex] = TILE.WALL;
      } else if (tile === TILE.TARGET) {
        terrain[rowIndex][columnIndex] = TILE.TARGET;
      } else if (tile === TILE.CRATE) {
        terrain[rowIndex][columnIndex] = TILE.FLOOR;
        crates.push(position);
      } else if (tile === TILE.CRATE_ON_TARGET) {
        terrain[rowIndex][columnIndex] = TILE.TARGET;
        crates.push(position);
      } else if (tile === TILE.PLAYER_ON_TARGET) {
        terrain[rowIndex][columnIndex] = TILE.TARGET;
        player = position;
      } else if (tile === TILE.PLAYER) {
        terrain[rowIndex][columnIndex] = TILE.FLOOR;
        player = position;
      } else {
        terrain[rowIndex][columnIndex] = TILE.FLOOR;
      }
    });
  });

  return {
    terrain,
    crates,
    player: player || { row: 0, column: 0 },
  };
}

function createGame(options = {}) {
  const parsed = parseBoard(options.board || DEFAULT_BOARD);
  return {
    terrain: cloneTerrain(options.terrain || parsed.terrain),
    crates: cloneCrates(options.crates || parsed.crates),
    player: options.player ? { ...options.player } : { ...parsed.player },
    moves: options.moves || 0,
    pushes: options.pushes || 0,
    status: options.status || 'playing',
    message: options.message || '상자를 목표 칸으로 밀어 창고를 정리하세요.',
  };
}

function baseTileAt(game, position) {
  if (!game.terrain[position.row] || game.terrain[position.row][position.column] === undefined) return TILE.WALL;
  return game.terrain[position.row][position.column];
}

function findCrateIndex(game, position) {
  return game.crates.findIndex((crate) => samePosition(crate, position));
}

function getTile(game, position) {
  const baseTile = baseTileAt(game, position);
  const crateIndex = findCrateIndex(game, position);
  if (crateIndex >= 0) return baseTile === TILE.TARGET ? TILE.CRATE_ON_TARGET : TILE.CRATE;
  if (samePosition(game.player, position)) return baseTile === TILE.TARGET ? TILE.PLAYER_ON_TARGET : TILE.PLAYER;
  return baseTile;
}

function isWall(game, position) {
  return baseTileAt(game, position) === TILE.WALL;
}

function isSolved(game) {
  const targets = [];
  game.terrain.forEach((row, rowIndex) => {
    row.forEach((tile, columnIndex) => {
      if (tile === TILE.TARGET) targets.push({ row: rowIndex, column: columnIndex });
    });
  });
  return targets.length > 0 && targets.every((target) => findCrateIndex(game, target) >= 0);
}

function cloneGame(game) {
  return {
    ...game,
    terrain: cloneTerrain(game.terrain),
    crates: cloneCrates(game.crates),
    player: { ...game.player },
  };
}

function movePlayer(game, direction) {
  if (game.status !== 'playing') return cloneGame(game);

  const step = DIRECTION_STEPS[direction];
  if (!step) throw new Error('알 수 없는 방향입니다.');

  const nextPlayer = {
    row: game.player.row + step[0],
    column: game.player.column + step[1],
  };

  if (isWall(game, nextPlayer)) {
    return { ...cloneGame(game), message: '벽에 막혔습니다.' };
  }

  const crateIndex = findCrateIndex(game, nextPlayer);
  if (crateIndex >= 0) {
    const nextCrate = {
      row: nextPlayer.row + step[0],
      column: nextPlayer.column + step[1],
    };

    if (isWall(game, nextCrate) || findCrateIndex(game, nextCrate) >= 0) {
      return { ...cloneGame(game), message: '상자를 그쪽으로 밀 수 없습니다.' };
    }

    const nextGame = cloneGame(game);
    nextGame.crates[crateIndex] = nextCrate;
    nextGame.player = nextPlayer;
    nextGame.moves += 1;
    nextGame.pushes += 1;
    nextGame.status = isSolved(nextGame) ? 'won' : 'playing';
    nextGame.message = nextGame.status === 'won'
      ? `창고 정리 완료! ${nextGame.moves}번 이동, ${nextGame.pushes}번 밀었습니다.`
      : '좋아요, 상자를 계속 목표 칸으로 옮기세요.';
    return nextGame;
  }

  const nextGame = cloneGame(game);
  nextGame.player = nextPlayer;
  nextGame.moves += 1;
  nextGame.message = '한 칸 이동했습니다.';
  return nextGame;
}

function statusText(game) {
  if (game.status === 'won') return `완료 · 이동 ${game.moves}번 · 밀기 ${game.pushes}번`;
  return `진행 중 · 이동 ${game.moves}번 · 밀기 ${game.pushes}번`;
}

const api = {
  TILE,
  DIRECTIONS,
  DEFAULT_BOARD,
  createGame,
  getTile,
  movePlayer,
  statusText,
};

if (typeof module !== 'undefined' && module.exports) module.exports = api;
if (typeof window !== 'undefined') window.SokobanLogic = api;
