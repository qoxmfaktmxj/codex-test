const assert = require('assert');
const {
  WIDTH,
  HEIGHT,
  createEmptyBoard,
  createGame,
  movePiece,
  rotatePiece,
  hardDrop,
  tick,
} = require('./game-logic');

function filledRow(exceptColumns = []) {
  return Array.from({ length: WIDTH }, (_, column) => (exceptColumns.includes(column) ? null : '회색'));
}

function cellSet(piece) {
  return new Set(piece.cells.map(([row, column]) => `${piece.row + row},${piece.column + column}`));
}

(function testInitialGameUsesDeterministicFirstBlock() {
  const game = createGame({ sequence: ['O', 'I'] });

  assert.strictEqual(game.status, 'playing');
  assert.strictEqual(game.currentPiece.type, 'O');
  assert.strictEqual(game.currentPiece.column, 4);
  assert.strictEqual(game.score, 0);
  assert.strictEqual(game.lines, 0);
  assert.strictEqual(game.message, '블록을 내려 줄을 지우세요.');
})();

(function testMovePieceStopsAtLeftWall() {
  let game = createGame({ sequence: ['O'] });

  for (let i = 0; i < 8; i += 1) game = movePiece(game, -1);

  assert.strictEqual(game.currentPiece.column, 0);
  assert.strictEqual(movePiece(game, -1).currentPiece.column, 0);
})();

(function testRotatePieceChangesShapeInsideBoard() {
  const game = createGame({ sequence: ['I'] });
  const rotated = rotatePiece(game);
  const cells = cellSet(rotated.currentPiece);

  assert.strictEqual(rotated.currentPiece.rotation, 1);
  assert.ok(cells.has('0,5'));
  assert.ok(cells.has('1,5'));
  assert.ok(cells.has('2,5'));
  assert.ok(cells.has('3,5'));
})();

(function testHardDropLocksBlockClearsTwoLinesAndScores() {
  const board = createEmptyBoard();
  board[HEIGHT - 2] = filledRow([4, 5]);
  board[HEIGHT - 1] = filledRow([4, 5]);
  const game = createGame({ board, sequence: ['O', 'I'] });

  const dropped = hardDrop(game);

  assert.strictEqual(dropped.status, 'playing');
  assert.strictEqual(dropped.score, 300);
  assert.strictEqual(dropped.lines, 2);
  assert.strictEqual(dropped.currentPiece.type, 'I');
  assert.deepStrictEqual(dropped.board[HEIGHT - 1], Array(WIDTH).fill(null));
  assert.strictEqual(dropped.message, '두 줄 제거! 점수 300점');
})();

(function testTickEndsGameWhenNewBlockCannotSpawn() {
  const board = createEmptyBoard();
  board[0][4] = '회색';
  const game = createGame({ board, sequence: ['O'] });

  const afterTick = tick(game);

  assert.strictEqual(afterTick.status, 'ended');
  assert.strictEqual(afterTick.message, '게임 종료! 다시 시작해 보세요.');
})();

console.log('낙하 블록 로직 테스트 통과');
