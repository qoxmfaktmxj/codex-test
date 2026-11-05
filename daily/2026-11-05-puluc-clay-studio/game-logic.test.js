const assert = require('node:assert/strict');
const { createGame, removeOpening, legalJumps, move, hasMoves, winner } = require('./game-logic');

let game = createGame();
assert.equal(game.board.length, 36);
assert.equal(game.turn, 'dark');
assert.throws(() => removeOpening(game, 1), /첫 돌/);
game = removeOpening(game, 0);
assert.equal(game.board[0], null);
assert.equal(game.phase, 'light-remove');
assert.throws(() => removeOpening(game, 8), /이웃/);
game = removeOpening(game, 1);
assert.equal(game.phase, 'play');
assert.equal(game.turn, 'dark');
const jumpBoard = [
  'dark','light',null,null,null,null,
  null,null,null,null,null,null,
  null,null,null,null,null,null,
  null,null,null,null,null,null,
  null,null,null,null,null,null,
  null,null,null,null,null,null
];
game = { board: jumpBoard, turn: 'dark', phase: 'play', moves: 0 };
assert.deepEqual(legalJumps(game, 0), [2]);
game = move(game, 0, 2);
assert.equal(game.board[0], null);
assert.equal(game.board[1], null);
assert.equal(game.board[2], 'dark');
assert.equal(game.turn, 'light');
assert.equal(hasMoves(game, 'light'), false);
assert.equal(winner(game), 'dark');
assert.throws(() => move(game, 2, 4), /상대 돌/);
console.log('코나네 흙빛 작업대 로직 테스트 통과');
