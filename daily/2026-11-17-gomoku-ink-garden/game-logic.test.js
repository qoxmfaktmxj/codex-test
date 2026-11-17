const assert = require('node:assert/strict');
const { createGame, placeStone, resetGame } = require('./game-logic');

let game = createGame(9);
assert.deepEqual([game.size, game.turn, game.finished, game.winner], [9, '흑돌', false, null]);
game = placeStone(game, 4, 4);
assert.equal(game.board[4][4], '흑돌');
assert.equal(game.turn, '백돌');
assert.throws(() => placeStone(game, 4, 4), /이미/);
assert.throws(() => placeStone(game, 9, 0), /범위/);

game = createGame(9);
for (const [row, col] of [[4,0],[0,0],[4,1],[0,1],[4,2],[0,2],[4,3],[0,3],[4,4]]) game = placeStone(game, row, col);
assert.equal(game.finished, true);
assert.equal(game.winner, '흑돌');
assert.deepEqual(game.winningCells, [[4,0],[4,1],[4,2],[4,3],[4,4]]);
assert.deepEqual(placeStone(game, 8, 8), game);
assert.throws(() => placeStone(game, 10, 0), /범위/);

game = createGame(9);
for (const [row, col] of [[0,3],[0,0],[1,3],[0,1],[2,3],[0,2],[3,3],[0,4],[4,3]]) game = placeStone(game, row, col);
assert.equal(game.winner, '흑돌');
game = createGame(9);
for (const [row, col] of [[0,0],[0,1],[1,1],[0,2],[2,2],[0,3],[3,3],[0,4],[4,4]]) game = placeStone(game, row, col);
assert.equal(game.winner, '흑돌');
game = createGame(9);
for (const [row, col] of [[0,5],[0,0],[1,4],[0,1],[2,3],[0,2],[3,2],[0,4],[4,1]]) game = placeStone(game, row, col);
assert.equal(game.winner, '흑돌');
assert.deepEqual(resetGame(7), createGame(7));
assert.throws(() => createGame(4), /5 이상/);
console.log('오목 먹빛 정원 로직 테스트 통과');
