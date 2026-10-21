const assert = require('node:assert/strict');
const { createGame, legalPawnMoves, placeWall, movePawn, winner } = require('./game-logic');

let game = createGame();
assert.equal(game.current, 'red');
assert.deepEqual(game.pawns, { red: { row: 4, col: 2 }, blue: { row: 0, col: 2 } });
assert.deepEqual(legalPawnMoves(game, 'red'), [{ row: 3, col: 2 }, { row: 4, col: 1 }, { row: 4, col: 3 }]);

game = placeWall(game, { row: 2, col: 1, orientation: 'h' });
assert.equal(game.walls.red, 5);
assert.equal(game.current, 'blue');
assert.equal(game.placedWalls.length, 1);
assert.equal(placeWall(game, { row: 2, col: 1, orientation: 'h' }), game);

game = movePawn(createGame(), { row: 3, col: 2 });
assert.equal(game.current, 'blue');
assert.deepEqual(game.pawns.red, { row: 3, col: 2 });

const finished = { ...createGame(), pawns: { red: { row: 0, col: 2 }, blue: { row: 0, col: 2 } } };
assert.equal(winner(finished), 'red');

console.log('쿼리도 로직 테스트 통과');
