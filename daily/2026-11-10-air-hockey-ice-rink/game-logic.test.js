const assert = require('node:assert/strict');
const { createGame, movePaddle, stepGame, resetGame } = require('./game-logic');

let game = createGame(7);
assert.deepEqual([game.player, game.computer, game.winner], [0, 0, null]);
game = movePaddle(game, 200, 430);
assert.deepEqual(game.paddle, { x: 200, y: 430 });
game = stepGame({ ...game, puck: { x: 198, y: 429, vx: 3, vy: 4 } });
assert.equal(game.puck.vy < 0, true);
game = stepGame({ ...game, puck: { x: 200, y: 6, vx: 0, vy: -5 } });
assert.equal(game.player, 1);
assert.equal(game.puck.y, 250);
game = stepGame({ ...game, computer: 4, puck: { x: 200, y: 494, vx: 0, vy: 5 } });
assert.equal(game.winner, 'computer');
assert.equal(stepGame(game).computer, 5);
assert.deepEqual(resetGame(3), createGame(3));
assert.throws(() => createGame(0), /씨앗/);
console.log('에어 하키 빙판 라디오룸 로직 테스트 통과');
