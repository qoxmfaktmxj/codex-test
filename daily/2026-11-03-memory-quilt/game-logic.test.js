const assert = require('node:assert/strict');
const { createGame, revealCard, isComplete } = require('./game-logic');

let game = createGame(['달', '해', '달', '해']);
assert.deepEqual(game.cards.map(card => card.state), ['hidden', 'hidden', 'hidden', 'hidden']);
game = revealCard(game, 0);
assert.equal(game.cards[0].state, 'open');
game = revealCard(game, 2);
assert.deepEqual(game.cards.map(card => card.state), ['matched', 'hidden', 'matched', 'hidden']);
game = revealCard(game, 1);
game = revealCard(game, 3);
assert.equal(isComplete(game), true);
assert.throws(() => revealCard(game, 0), /뒤집을 수 없는 조각/);
console.log('기억 퀼트 로직 테스트 통과');
