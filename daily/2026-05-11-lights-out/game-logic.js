const BOARD_SIZE = 3;
const DEFAULT_LIGHTS = [
  true, false, true,
  true, true, false,
  false, true, false,
];

function createGame(lights = DEFAULT_LIGHTS) {
  const initialLights = lights.slice();
  return {
    lights: initialLights,
    moves: 0,
    status: isSolved(initialLights) ? 'won' : 'playing',
  };
}

function isSolved(lights) {
  return lights.every((light) => !light);
}

function countLights(lights) {
  return lights.filter(Boolean).length;
}

function neighborIndexes(index) {
  const row = Math.floor(index / BOARD_SIZE);
  const col = index % BOARD_SIZE;
  const positions = [
    [row, col],
    [row - 1, col],
    [row + 1, col],
    [row, col - 1],
    [row, col + 1],
  ];

  return positions
    .filter(([nextRow, nextCol]) => (
      nextRow >= 0 &&
      nextRow < BOARD_SIZE &&
      nextCol >= 0 &&
      nextCol < BOARD_SIZE
    ))
    .map(([nextRow, nextCol]) => nextRow * BOARD_SIZE + nextCol);
}

function toggleCell(game, index) {
  if (
    game.status !== 'playing' ||
    !Number.isInteger(index) ||
    index < 0 ||
    index >= BOARD_SIZE * BOARD_SIZE
  ) {
    return game;
  }

  const lights = game.lights.slice();
  for (const toggleIndex of neighborIndexes(index)) {
    lights[toggleIndex] = !lights[toggleIndex];
  }

  return {
    lights,
    moves: game.moves + 1,
    status: isSolved(lights) ? 'won' : 'playing',
  };
}

const gameLogic = {
  BOARD_SIZE,
  DEFAULT_LIGHTS,
  createGame,
  toggleCell,
  isSolved,
  countLights,
};

if (typeof module !== 'undefined') {
  module.exports = gameLogic;
}

if (typeof window !== 'undefined') {
  window.gameLogic = gameLogic;
}
