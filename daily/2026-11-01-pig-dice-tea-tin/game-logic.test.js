const assert = require('node:assert/strict');
const { createGame, roll, hold, isComplete } = require('./game-logic');

let game = createGame(20);
assert.equal(game.target, 20);
game = roll(game, 4); assert.equal(game.turnScore, 4); assert.equal(game.player, 0);
game = roll(game, 5); assert.equal(game.turnScore, 9);
game = hold(game); assert.equal(game.scores[0], 9); assert.equal(game.player, 1); assert.equal(game.turnScore, 0);
game = roll(game, 1); assert.equal(game.player, 0); assert.equal(game.turnScore, 0);
game = roll(game, 6); game = roll(game, 6); game = roll(game, 6); game = roll(game, 6);
game = hold(game); assert.equal(game.winner, 0); assert.equal(isComplete(game), true);
assert.throws(() => roll(game, 4), /끝난 게임/);
assert.throws(() => roll(createGame(20), 7), /1에서 6/);
console.log('차통 피그 다이스 로직 테스트 통과');
