const assert = require('node:assert/strict');
const { createGame, legalMoves, playMove, isGoal } = require('./game-logic');

let game = createGame();
assert.equal(game.position, 13);
assert.deepEqual(legalMoves(game).map(move => move.to).sort((a, b) => a - b), [7, 8, 9, 12, 14, 17, 18, 19]);

game = playMove(game, { from: 13, to: 8 });
assert.equal(game.position, 8);
assert.equal(game.edges.length, 1);
assert.equal(legalMoves(game).some(move => move.to === 13), false);
assert.throws(() => playMove(game, { from: 8, to: 13 }), /둘 수 없는 이동/);

const nearGoal = { position: 8, edges: [], moves: 4 };
assert.equal(isGoal(nearGoal), false);
const scored = playMove(nearGoal, { from: 8, to: 3 });
assert.equal(isGoal(scored), true);
assert.equal(scored.moves, 5);

console.log('종이 축구 로직 테스트 통과');
