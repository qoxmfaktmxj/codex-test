const assert = require('node:assert/strict');
const { createGame, placeStone, legalMoves, resetGame } = require('./game-logic');

let game = createGame(3);
assert.deepEqual([game.size, game.turn, game.finished, game.winner], [3, '산호', false, null]);
assert.equal(legalMoves(game).length, 9);
game = placeStone(game, 1, 1);
assert.equal(game.board[1][1], '산호');
assert.equal(game.turn, '해초');
assert.throws(() => placeStone(game, 1, 1), /이미/);
assert.throws(() => placeStone(game, 9, 1), /범위를/);

game = createGame(3);
game = placeStone(game, 0, 0); game = placeStone(game, 0, 1);
game = placeStone(game, 1, 0); game = placeStone(game, 1, 1);
game = placeStone(game, 2, 0);
assert.deepEqual([game.finished, game.winner], [true, '산호']);

game = createGame(3);
game = placeStone(game, 1, 0); game = placeStone(game, 0, 0);
game = placeStone(game, 2, 2); game = placeStone(game, 0, 1);
game = placeStone(game, 1, 2); game = placeStone(game, 0, 2);
assert.deepEqual([game.finished, game.winner], [true, '해초']);
assert.deepEqual(resetGame(4), createGame(4));
assert.throws(() => createGame(1), /크기는/);
console.log('헥스 산호 산책로 로직 테스트 통과');
