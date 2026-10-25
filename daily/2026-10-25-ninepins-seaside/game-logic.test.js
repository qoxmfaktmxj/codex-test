const assert = require('node:assert/strict');
const { createGame, roll, remainingPins, isComplete } = require('./game-logic');

let game = createGame();
assert.equal(remainingPins(game), 9);
assert.equal(game.throws, 0);

game = roll(game, [0, 2, 4]);
assert.equal(remainingPins(game), 6);
assert.equal(game.score, 3);
assert.equal(game.throws, 1);

game = roll(game, [2, 5, 8]);
assert.equal(remainingPins(game), 4);
assert.equal(game.score, 5);
assert.equal(game.throws, 2);
assert.equal(isComplete(game), true);
assert.equal(roll(game, [1]), game);

game = roll(createGame(), [0, 1, 2, 3, 4, 5, 6, 7, 8]);
assert.equal(remainingPins(game), 0);
assert.equal(isComplete(game), true);
console.log('나인핀 로직 테스트 통과');
