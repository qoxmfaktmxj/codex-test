const assert = require('node:assert/strict');
const { createGame, legalMoves, play, count } = require('./game-logic.js');

let game = createGame();
assert.deepEqual(legalMoves(game, 'black').sort((a, b) => a - b), [19, 26, 37, 44]);
game = play(game, 19);
assert.equal(game.board[19], 'black');
assert.equal(game.board[27], 'black');
assert.deepEqual(count(game.board), { black: 4, white: 1 });
assert.equal(game.turn, 'white');
assert.equal(play(game, -1), game);
console.log('리버시 로직 테스트 통과');
