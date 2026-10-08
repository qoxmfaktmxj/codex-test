const assert = require('node:assert/strict');
const {
  createGame,
  moveDisk,
  topDisk,
  isSolved,
} = require('./game-logic.js');

let game = createGame(3);
assert.deepEqual(game.rods, [[3, 2, 1], [], []]);
assert.equal(topDisk(game, 0), 1);
assert.equal(topDisk(game, 1), null);

game = moveDisk(game, 0, 2);
assert.deepEqual(game.rods, [[3, 2], [], [1]]);
assert.equal(game.moves, 1);
assert.equal(game.status, 'playing');

const blocked = moveDisk(game, 0, 2);
assert.deepEqual(blocked.rods, game.rods);
assert.equal(blocked.moves, 1);
assert.match(blocked.message, /작은 책/);

const solved = {
  ...game,
  rods: [[], [], [3, 2, 1]],
  moves: 7,
};
assert.equal(isSolved(solved), true);
assert.equal(moveDisk(solved, 2, 1).status, 'won');

console.log('하노이 탑 로직 테스트 통과');
