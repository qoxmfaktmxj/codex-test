const assert = require('node:assert/strict');
const { createGame, playableCards, playCard, isComplete } = require('./game-logic');

let game = createGame([
  { id: 'red-1', suit: 'red', rank: 1 }, { id: 'red-2', suit: 'red', rank: 2 }, { id: 'red-3', suit: 'red', rank: 3 },
  { id: 'blue-2', suit: 'blue', rank: 2 }, { id: 'blue-3', suit: 'blue', rank: 3 }, { id: 'blue-4', suit: 'blue', rank: 4 }
]);
assert.deepEqual(playableCards(game).map(card => card.id), ['red-2', 'blue-2']);
game = playCard(game, 'blue-2');
assert.deepEqual(playableCards(game).map(card => card.id).sort(), ['blue-3', 'red-2']);
game = playCard(game, 'red-2');
game = playCard(game, 'red-3');
assert.equal(game.rows.red.max, 3);
assert.throws(() => playCard(game, 'blue-4'), /놓을 수 없는 패/);
game = playCard(game, 'red-1');
game = playCard(game, 'blue-3');
game = playCard(game, 'blue-4');
assert.equal(isComplete(game), true);
assert.throws(() => playCard(game, 'red-1'), /찾을 수 없는 패/);
console.log('시장 풍탄 로직 테스트 통과');
