const assert = require('node:assert/strict');
const { createGame, setCell, checkGame, reset } = require('./game-logic.js');

let game = createGame();
assert.equal(game.board.length, 16);
assert.equal(game.board[0], 1);
assert.equal(setCell(game, 0, 2), game);
game = setCell(game, 1, 2);
assert.equal(game.board[1], 2);
assert.equal(checkGame(game).valid, true);
game = setCell(game, 2, 2);
assert.equal(checkGame(game).valid, false);
game = createGame();
[1, 2, 5, 7, 10, 11, 12, 13, 14, 15].forEach((index, order) => {
  game = setCell(game, index, [2, 3, 4, 2, 4, 3, 4, 3, 2, 1][order]);
});
assert.equal(game.status, 'won');
assert.equal(checkGame(game).complete, true);
assert.equal(reset(game).status, 'playing');
console.log('미니 스도쿠 로직 테스트 통과');
