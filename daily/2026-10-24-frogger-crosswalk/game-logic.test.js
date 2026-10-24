const assert = require('node:assert/strict');
const { createGame, moveFrog, advanceTraffic, hasCollision, hasWon } = require('./game-logic');

let game = createGame();
assert.deepEqual(game.frog, { x: 3, y: 6 });
assert.equal(moveFrog(game, 'up').frog.y, 5);
assert.equal(moveFrog(game, 'left').frog.x, 2);
assert.equal(moveFrog(game, 'down'), game);

game = { frog: { x: 2, y: 2 }, cars: [{ x: 2, y: 2, speed: 1 }], ticks: 0 };
assert.equal(hasCollision(game), true);
assert.equal(moveFrog(game, 'up').frog.y, 1);

game = { frog: { x: 3, y: 6 }, cars: [{ x: 6, y: 3, speed: 1 }, { x: 0, y: 4, speed: -1 }], ticks: 0 };
game = advanceTraffic(game);
assert.equal(game.cars[0].x, 0);
assert.equal(game.cars[1].x, 6);
assert.equal(game.ticks, 1);
assert.equal(hasWon({ frog: { x: 1, y: 0 }, cars: [], ticks: 0 }), true);
console.log('개구리 길건너기 로직 테스트 통과');
