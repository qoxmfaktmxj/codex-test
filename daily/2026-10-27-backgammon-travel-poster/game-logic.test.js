const assert = require('node:assert/strict');
const { createGame, legalMoves, move, winner } = require('./game-logic');

let game = createGame();
assert.equal(game.turn, 'light');
assert.equal(game.pieces.light, 3);
assert.deepEqual(legalMoves(game, 'light'), [1, 2, 3, 4, 5, 6]);

game = move(game, 6);
assert.equal(game.light, 6);
assert.equal(game.turn, 'dark');
assert.deepEqual(legalMoves(game, 'dark'), [1, 2, 3, 4, 5, 6]);

const invalid = { turn: 'light', light: 0, dark: 6, pieces: { light: 3, dark: 3 } };
assert.equal(move(invalid, 7), invalid);

const winning = { turn: 'light', light: 23, dark: 0, pieces: { light: 1, dark: 3 } };
const finished = move(winning, 1);
assert.equal(finished.pieces.light, 0);
assert.equal(winner(finished), 'light');
assert.equal(move(finished, 2), finished);

console.log('백개먼 로직 테스트 통과');
