const assert = require('node:assert/strict');
const {
  BOARD_SIZE,
  createGame,
  toggleCell,
  isSolved,
  countLights,
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

function createPlayingGame(lights) {
  return {
    lights: lights.slice(),
    moves: 0,
    status: 'playing',
  };
}

test('starts with a 3x3 Korean lights-out puzzle', () => {
  const game = createGame();

  assert.equal(BOARD_SIZE, 3);
  assert.equal(game.lights.length, 9);
  assert.deepEqual(game.lights, [
    true, false, true,
    true, true, false,
    false, true, false,
  ]);
  assert.equal(game.moves, 0);
  assert.equal(game.status, 'playing');
});

test('starts as solved when every light is already off', () => {
  const game = createGame(Array(9).fill(false));

  assert.equal(game.status, 'won');
});

test('toggles selected center cell and its four neighbors', () => {
  const game = createPlayingGame(Array(9).fill(false));
  const next = toggleCell(game, 4);

  assert.deepEqual(next.lights, [
    false, true, false,
    true, true, true,
    false, true, false,
  ]);
  assert.equal(next.moves, 1);
  assert.equal(next.status, 'playing');
});

test('toggles only valid edge neighbors at a corner', () => {
  const game = createPlayingGame(Array(9).fill(false));
  const next = toggleCell(game, 0);

  assert.deepEqual(next.lights, [
    true, true, false,
    true, false, false,
    false, false, false,
  ]);
});

test('ignores invalid moves without changing the game', () => {
  const game = createPlayingGame(Array(9).fill(false));

  assert.deepEqual(toggleCell(game, -1), game);
  assert.deepEqual(toggleCell(game, 9), game);
  assert.deepEqual(toggleCell(game, 1.5), game);
});

test('marks the game solved when every light is off', () => {
  const game = createGame([
    true, true, false,
    true, false, false,
    false, false, false,
  ]);
  const next = toggleCell(game, 0);

  assert.deepEqual(next.lights, Array(9).fill(false));
  assert.equal(next.moves, 1);
  assert.equal(next.status, 'won');
  assert.equal(isSolved(next.lights), true);
});

test('does not accept moves after the puzzle is solved', () => {
  const game = {
    lights: Array(9).fill(false),
    moves: 3,
    status: 'won',
  };

  assert.deepEqual(toggleCell(game, 4), game);
});

test('counts lights that are still on', () => {
  assert.equal(countLights([true, false, true, false]), 2);
});
