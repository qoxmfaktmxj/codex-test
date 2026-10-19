const assert = require('node:assert/strict');
const { createGame, press, nextStep } = require('./game-logic');

let game = createGame(() => 0.1);
assert.deepEqual(game.sequence, [0]);
assert.equal(game.status, '보여주기');

game = nextStep(game, () => 0.7);
assert.equal(game.status, '입력');

game = press(game, 0, () => 0.7);
assert.equal(game.status, '성공');

game = nextStep(game, () => 0.7);
assert.deepEqual(game.sequence, [0, 2]);
assert.equal(game.round, 2);

game = press({ ...game, status: '입력', playerIndex: 0 }, 1, () => 0.7);
assert.equal(game.status, '실패');
assert.equal(game.best, 1);

console.log('차임 기억놀이 로직 테스트 통과');
