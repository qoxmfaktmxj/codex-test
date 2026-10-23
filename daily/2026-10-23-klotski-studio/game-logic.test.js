const assert = require('node:assert/strict');
const { createGame, selectBlock, moveSelected, winner } = require('./game-logic');

let game = createGame();
assert.equal(game.moves, 0);
assert.equal(selectBlock(game, 'hero').selected, 'hero');
assert.equal(selectBlock(game, 'missing'), game);
assert.equal(moveSelected(game, 'down'), game);

game = { blocks: [{ id: 'hero', x: 1, y: 2, w: 2, h: 2 }], selected: 'hero', moves: 3 };
game = moveSelected(game, 'down');
assert.equal(game.blocks[0].y, 3);
assert.equal(game.moves, 4);
assert.equal(winner(game), true);

game = { blocks: [{ id: 'hero', x: 1, y: 0, w: 2, h: 2 }, { id: 'bar', x: 1, y: 2, w: 2, h: 1 }], selected: 'hero', moves: 0 };
assert.equal(moveSelected(game, 'down'), game);
console.log('블록 탈출 로직 테스트 통과');
