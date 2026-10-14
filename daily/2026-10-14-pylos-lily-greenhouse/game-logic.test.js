const assert = require('node:assert/strict');
const { createGame, placeSphere, moveSphere, reclaimSphere, availableSpots, reset } = require('./game-logic.js');

let game = createGame();
assert.equal(game.status, 'playing');
assert.equal(game.turn, 'jade');
assert.equal(game.remaining.jade, 15);
assert.equal(availableSpots(game).length, 16);

game = placeSphere(game, 0);
assert.equal(game.board[0], 'jade');
assert.equal(game.turn, 'coral');
assert.equal(game.remaining.jade, 14);
assert.equal(placeSphere(game, 0), game);
assert.equal(placeSphere(game, 16), game);

let tower = createGame();
for (let index = 0; index < 16; index += 1) tower = { ...tower, board: tower.board.map((cell, cellIndex) => cellIndex === index ? 'jade' : cell) };
tower = { ...tower, turn: 'jade', remaining: { jade: 1, coral: 15 } };
assert.equal(availableSpots(tower).includes(16), true);
tower = placeSphere(tower, 16);
assert.equal(tower.board[16], 'jade');
assert.equal(tower.status, 'playing');

let mover = createGame();
mover = { ...mover, board: mover.board.map((cell, index) => [0, 1, 4, 5].includes(index) ? 'coral' : index === 15 ? 'jade' : cell), turn: 'jade' };
assert.equal(moveSphere(mover, 15, 16).board[16], 'jade');
assert.equal(moveSphere(mover, 15, 16).board[15], null);

let square = createGame();
square = { ...square, board: square.board.map((cell, index) => [0, 1, 4].includes(index) ? 'jade' : cell), turn: 'jade', remaining: { jade: 12, coral: 15 } };
square = placeSphere(square, 5);
assert.equal(square.phase, 'reclaim');
square = reclaimSphere(square, 0);
assert.equal(square.board[0], null);
assert.equal(square.remaining.jade, 12);
assert.equal(square.turn, 'jade');
square = reclaimSphere(square, 1);
assert.equal(square.phase, 'place');
assert.equal(square.turn, 'coral');

let finish = { ...tower, board: tower.board.map((cell, index) => index === 16 ? 'jade' : cell), turn: 'jade', remaining: { jade: 1, coral: 15 } };
for (let index = 17; index < 29; index += 1) finish = { ...finish, board: finish.board.map((cell, cellIndex) => cellIndex === index ? 'jade' : cell) };
finish = placeSphere(finish, 29);
assert.equal(finish.status, 'won');
assert.equal(finish.winner, 'jade');
assert.equal(reset(finish).remaining.coral, 15);
console.log('필로스 로직 테스트 통과');
