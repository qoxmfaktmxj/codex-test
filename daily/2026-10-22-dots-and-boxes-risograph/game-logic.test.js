const assert = require('node:assert/strict');
const { createGame, addEdge, availableEdges, winner } = require('./game-logic');

let game = createGame();
assert.equal(game.current, 'magenta');
assert.equal(availableEdges(game).length, 24);
assert.equal(addEdge(game, 'h-9-0'), game);

game = addEdge(game, 'v-0-0');
assert.equal(game.current, 'teal');
assert.equal(game.edges.length, 1);
assert.equal(addEdge(game, 'v-0-0'), game);

game = createGame();
['h-0-0', 'h-1-0', 'v-0-0'].forEach(edge => { game = addEdge(game, edge); });
game = addEdge(game, 'v-0-1');
assert.deepEqual(game.boxes, { '0-0': 'teal' });
assert.equal(game.current, 'teal');
assert.deepEqual(game.scores, { magenta: 0, teal: 1 });

const finished = { ...game, scores: { magenta: 5, teal: 4 }, boxes: { a: 'magenta', b: 'magenta', c: 'magenta', d: 'magenta', e: 'magenta', f: 'teal', g: 'teal', h: 'teal', i: 'teal' } };
assert.equal(winner(finished), 'magenta');
console.log('점과 상자 로직 테스트 통과');
