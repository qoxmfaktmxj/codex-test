const assert = require('node:assert/strict');
const { createGame, takeShot, resetGame } = require('./game-logic');

let game = createGame(7);
assert.equal(game.player, 0);
assert.equal(game.computer, 0);
assert.equal(game.turn, 'player');
game = takeShot(game, 3, 2);
assert.deepEqual([game.player, game.computer, game.turn], [3, 2, 'player']);
game = takeShot({ ...game, player: 10, computer: 8 }, 2, 1);
assert.equal(game.winner, 'player');
assert.equal(game.message, '당신의 구슬이 먼저 열두 칸을 채웠어요!');
assert.equal(takeShot(game, 3, 3).player, 12);
assert.deepEqual(resetGame(4), createGame(4));
assert.throws(() => createGame(0), /씨앗/);
console.log('구슬치기 분필 마당 로직 테스트 통과');
