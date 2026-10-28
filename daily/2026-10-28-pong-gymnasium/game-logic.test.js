const assert = require('node:assert/strict');
const { createGame, movePaddle, step, resetBall } = require('./game-logic');

let game = createGame();
assert.equal(game.score.left, 0);
assert.equal(game.score.right, 0);
assert.equal(game.ball.dx, 1);

game = movePaddle(game, 'left', -1);
assert.equal(game.paddles.left, 1);
assert.equal(movePaddle(game, 'left', 99).paddles.left, 3);

const bounced = step({ ...createGame(), ball: { x: 4, y: 0, dx: 1, dy: -1 } });
assert.equal(bounced.ball.dy, 1);

const hit = step({ ...createGame(), paddles: { left: 2, right: 2 }, ball: { x: 1, y: 2, dx: -1, dy: 0 } });
assert.equal(hit.ball.dx, 1);

const scored = step({ ...createGame(), ball: { x: 0, y: 4, dx: -1, dy: 0 } });
assert.equal(scored.score.right, 1);
assert.deepEqual(scored.ball, resetBall('right'));

console.log('탁구 로직 테스트 통과');
