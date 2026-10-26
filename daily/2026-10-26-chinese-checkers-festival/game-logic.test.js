const assert = require('node:assert/strict');
const { createGame, legalMoves, move, winner } = require('./game-logic');

let game = createGame();
assert.equal(game.turn, 'red');
assert.equal(game.pieces.length, 6);
assert.ok(legalMoves(game, 'r0').some(cell => cell.x === 3 && cell.y === 3));

game = move(game, 'r0', { x: 3, y: 3 });
assert.equal(game.pieces.find(piece => piece.id === 'r0').x, 3);
assert.equal(game.turn, 'blue');
assert.equal(move(game, 'r1', { x: 3, y: 3 }), game);

const jumping = { turn: 'red', pieces: [
  { id: 'r0', side: 'red', x: 2, y: 2 },
  { id: 'r1', side: 'red', x: 5, y: 6 },
  { id: 'r2', side: 'red', x: 6, y: 6 },
  { id: 'b0', side: 'blue', x: 3, y: 2 },
  { id: 'b1', side: 'blue', x: 5, y: 2 },
  { id: 'b2', side: 'blue', x: 3, y: 6 }
] };
assert.ok(legalMoves(jumping, 'r0').some(cell => cell.x === 4 && cell.y === 2));
assert.ok(legalMoves(jumping, 'r0').some(cell => cell.x === 6 && cell.y === 2));

const won = { ...jumping, pieces: jumping.pieces.map(piece => piece.side === 'red' ? ({ ...piece, x: piece.id === 'r0' ? 4 : piece.id === 'r1' ? 3 : 5, y: piece.id === 'r0' ? 6 : 7 }) : piece) };
assert.equal(winner(won), 'red');
assert.equal(move(won, 'r0', { x: 4, y: 5 }), won);
console.log('중국 장기 로직 테스트 통과');
