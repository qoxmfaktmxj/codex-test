const assert = require('node:assert/strict');
const { createGame, roll, toggleHold, scoreCategory } = require('./game-logic');

let game = createGame(() => 0);
assert.deepEqual(game.dice, [1, 1, 1, 1, 1]);
assert.equal(game.rollsLeft, 3);

game = roll(game, () => 0.99);
assert.deepEqual(game.dice, [6, 6, 6, 6, 6]);
assert.equal(game.rollsLeft, 2);

game = toggleHold(game, 2);
game = roll(game, () => 0);
assert.equal(game.dice[2], 6);
assert.equal(game.dice[0], 1);

game = scoreCategory({ ...game, dice: [2, 2, 2, 5, 5] }, '풀하우스');
assert.equal(game.scores['풀하우스'], 25);
assert.equal(game.round, 2);
assert.equal(game.rollsLeft, 3);

game = scoreCategory({ ...game, dice: [6, 6, 6, 6, 6], scores: { 야추: null }, round: 12 }, '야추');
assert.equal(game.scores.야추, 50);
assert.equal(game.status, '끝');

console.log('주사위 다섯 로직 테스트 통과');
