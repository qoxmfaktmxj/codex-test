const assert = require('node:assert/strict');
const { createGame, legalMoves, playMove, remainingPegs } = require('./game-logic');

let game = createGame();
assert.equal(remainingPegs(game), 32);
assert.deepEqual(legalMoves(game, 10).map(move => move.to), [24]);
assert.equal(legalMoves(game, 16).length, 0);

const wrapped = { board: Array(49).fill(null), moves: 0 };
wrapped.board[20] = 1; wrapped.board[21] = 1;
assert.equal(legalMoves(wrapped, 20).length, 0);

game = playMove(game, { from: 10, over: 17, to: 24 });
assert.equal(game.board[10], null);
assert.equal(game.board[17], null);
assert.equal(game.board[24], 1);
assert.equal(remainingPegs(game), 31);

assert.throws(() => playMove(createGame(), { from: 0, over: 1, to: 2 }), /둘 수 없는 이동/);
console.log('페그 솔리테어 로직 테스트 통과');
