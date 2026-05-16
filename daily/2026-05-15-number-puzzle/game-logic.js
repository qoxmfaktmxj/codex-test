const BOARD_SIZE = 3;
const DEFAULT_TILES = [
  1, 2, 3,
  4, 0, 6,
  7, 5, 8,
];
const SOLVED_TILES = [
  1, 2, 3,
  4, 5, 6,
  7, 8, 0,
];

function createGame(tiles = DEFAULT_TILES) {
  const nextTiles = tiles.slice();
  return {
    tiles: nextTiles,
    moves: 0,
    status: isSolved(nextTiles) ? 'won' : 'playing',
  };
}

function isSolved(tiles) {
  return tiles.every((tile, index) => tile === SOLVED_TILES[index]);
}

function movableTileIndexes(tiles) {
  const emptyIndex = tiles.indexOf(0);
  const emptyRow = Math.floor(emptyIndex / BOARD_SIZE);
  const emptyCol = emptyIndex % BOARD_SIZE;

  return tiles
    .map((tile, index) => ({ tile, index }))
    .filter(({ tile, index }) => {
      if (tile === 0) {
        return false;
      }

      const row = Math.floor(index / BOARD_SIZE);
      const col = index % BOARD_SIZE;
      return Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1;
    })
    .map(({ index }) => index);
}

function moveTile(game, tile) {
  if (game.status !== 'playing') {
    return game;
  }

  const tileIndex = game.tiles.indexOf(tile);
  if (tileIndex === -1 || !movableTileIndexes(game.tiles).includes(tileIndex)) {
    return game;
  }

  const emptyIndex = game.tiles.indexOf(0);
  const tiles = game.tiles.slice();
  tiles[emptyIndex] = tile;
  tiles[tileIndex] = 0;

  return {
    tiles,
    moves: game.moves + 1,
    status: isSolved(tiles) ? 'won' : 'playing',
  };
}

function isTileEnabled(game, index) {
  return game.status === 'playing' && movableTileIndexes(game.tiles).includes(index);
}

const gameLogic = {
  BOARD_SIZE,
  DEFAULT_TILES,
  SOLVED_TILES,
  createGame,
  moveTile,
  isSolved,
  movableTileIndexes,
  isTileEnabled,
};

if (typeof module !== 'undefined') {
  module.exports = gameLogic;
}

if (typeof window !== 'undefined') {
  window.gameLogic = gameLogic;
}
