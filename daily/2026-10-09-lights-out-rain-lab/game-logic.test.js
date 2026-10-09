const assert = require('node:assert/strict');
const { createGame, affected, press, isSolved } = require('./game-logic.js');

let game = createGame(3, [1, 0, 0, 0, 0, 0, 0, 0, 0]);
assert.deepEqual(affected(3, 0).sort((a, b) => a - b), [0, 1, 3]);
assert.deepEqual(affected(3, 4).sort((a, b) => a - b), [1, 3, 4, 5, 7]);
game = press(game, 0);
assert.deepEqual(game.lights, [0, 1, 0, 1, 0, 0, 0, 0, 0]);
assert.equal(game.moves, 1);
assert.equal(isSolved({ ...game, lights: Array(9).fill(0) }), true);
assert.equal(press({ ...game, lights: Array(9).fill(0), status: 'won' }, 0).moves, 1);
console.log('라이트 아웃 로직 테스트 통과');
