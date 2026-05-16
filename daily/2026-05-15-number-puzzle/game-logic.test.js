const assert = require('node:assert/strict');
const {
  BOARD_SIZE,
  DEFAULT_TILES,
  createGame,
  moveTile,
  isSolved,
  movableTileIndexes,
  isTileEnabled,
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

test('starts with a 3x3 Korean number puzzle', () => {
  const game = createGame();

  assert.equal(BOARD_SIZE, 3);
  assert.deepEqual(game.tiles, DEFAULT_TILES);
  assert.equal(game.moves, 0);
  assert.equal(game.status, 'playing');
});

test('moves a tile into the empty space when it is adjacent', () => {
  const game = createGame([
    1, 2, 3,
    4, 5, 6,
    7, 0, 8,
  ]);
  const next = moveTile(game, 8);

  assert.deepEqual(next.tiles, [
    1, 2, 3,
    4, 5, 6,
    7, 8, 0,
  ]);
  assert.equal(next.moves, 1);
  assert.equal(next.status, 'won');
});

test('ignores a tile that is not next to the empty space', () => {
  const game = createGame([
    1, 2, 3,
    4, 5, 6,
    0, 7, 8,
  ]);

  assert.deepEqual(moveTile(game, 1), game);
});

test('lists only tiles next to the empty space as movable', () => {
  assert.deepEqual(movableTileIndexes([
    1, 2, 3,
    4, 0, 5,
    6, 7, 8,
  ]).sort((a, b) => a - b), [1, 3, 5, 7]);
});

test('does not accept moves after the puzzle is solved', () => {
  const game = {
    tiles: [
      1, 2, 3,
      4, 5, 6,
      7, 8, 0,
    ],
    moves: 4,
    status: 'won',
  };

  assert.deepEqual(moveTile(game, 7), game);
});

test('recognizes the solved tile order', () => {
  assert.equal(isSolved([
    1, 2, 3,
    4, 5, 6,
    7, 8, 0,
  ]), true);
  assert.equal(isSolved([
    1, 2, 3,
    4, 5, 6,
    7, 0, 8,
  ]), false);
});

test('enables only movable tiles while playing', () => {
  const game = createGame([
    1, 2, 3,
    4, 0, 5,
    6, 7, 8,
  ]);

  assert.equal(isTileEnabled(game, 0), false);
  assert.equal(isTileEnabled(game, 1), true);
  assert.equal(isTileEnabled(game, 4), false);
  assert.equal(isTileEnabled(game, 5), true);
});

test('disables every tile after the puzzle is solved', () => {
  const game = createGame([
    1, 2, 3,
    4, 5, 6,
    7, 8, 0,
  ]);

  assert.equal(isTileEnabled(game, 7), false);
});
