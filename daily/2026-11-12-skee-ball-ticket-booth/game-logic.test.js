const assert = require('node:assert/strict');
const { createGame, rollBall, resetGame, pointsForPocket } = require('./game-logic');

let game = createGame(3);
assert.deepEqual([game.seed, game.balls, game.score, game.finished], [3, 9, 0, false]);
game = rollBall(game, 50);
assert.deepEqual([game.balls, game.score, game.last], [8, 50, 50]);
game = rollBall({ ...game, balls: 1 }, 100);
assert.deepEqual([game.balls, game.score, game.finished], [0, 150, true]);
assert.equal(rollBall(game, 40), game);
assert.deepEqual(resetGame(9), createGame(9));
assert.equal(pointsForPocket('보너스'), 100);
assert.equal(pointsForPocket('중앙'), 50);
assert.equal(pointsForPocket('바깥'), 10);
assert.throws(() => createGame(0), /씨앗/);
assert.throws(() => rollBall(createGame(1), 11), /점수/);
console.log('스키볼 티켓 부스 로직 테스트 통과');
