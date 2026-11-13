const assert = require('node:assert/strict');
const { createGame, pickJack, resetGame } = require('./game-logic');

let game = createGame(5);
assert.deepEqual([game.round, game.left, game.score, game.finished], [1, 1, 0, false]);
game = pickJack(game, 2);
assert.deepEqual([game.round, game.left, game.score, game.last], [2, 2, 1, 2]);
game = pickJack({ ...game, left: 1 }, 4);
assert.deepEqual([game.round, game.left, game.score], [3, 3, 3]);
game = pickJack({ ...game, round: 5, left: 1, score: 10 }, 3);
assert.deepEqual([game.round, game.left, game.score, game.finished], [5, 0, 15, true]);
assert.equal(pickJack(game, 1), game);
assert.deepEqual(resetGame(3), createGame(3));
assert.throws(() => createGame(0), /공기알/);
assert.throws(() => pickJack(createGame(3), 0), /공기알/);
console.log('공기놀이 마당 로직 테스트 통과');
