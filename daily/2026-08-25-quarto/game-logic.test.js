const assert = require('assert');
const Quarto = require('./game-logic');

function testPiecesHaveFourBinaryTraits() {
  const pieces = Quarto.createPieces();
  assert.strictEqual(pieces.length, 16);
  assert.strictEqual(new Set(pieces.map((piece) => piece.id)).size, 16);
  assert.deepStrictEqual(pieces[0].traits, { tall: false, dark: false, square: false, hollow: false });
  assert.deepStrictEqual(pieces[15].traits, { tall: true, dark: true, square: true, hollow: true });
}

function testPlacesOnlyTheOfferedPieceOnAnEmptyCell() {
  const state = Quarto.createState();
  const offered = Quarto.offerPiece(state, 5);
  const placed = Quarto.placePiece(offered, 2, 1);
  assert.strictEqual(placed.board[2][1], 5);
  assert.strictEqual(placed.offeredPiece, null);
  assert.strictEqual(placed.available.includes(5), false);
  assert.throws(() => Quarto.placePiece(state, 0, 0), /골라야/);
  assert.throws(() => Quarto.placePiece(offered, 4, 0), /말판/);
  assert.throws(() => Quarto.placePiece(placed, 2, 1), /골라야/);
}

function testFindsAWinningSharedTraitInRowsColumnsAndDiagonals() {
  const rowWin = Quarto.createState({
    board: [[0, 1, 2, 3], [null, null, null, null], [null, null, null, null], [null, null, null, null]],
    available: Array.from({ length: 12 }, (_, index) => index + 4), offeredPiece: null,
  });
  assert.deepStrictEqual(Quarto.getWinner(rowWin), { type: 'row', index: 0, trait: 'square', value: false });

  const columnWin = Quarto.createState({
    board: [[8, null, null, null], [9, null, null, null], [10, null, null, null], [11, null, null, null]],
    available: [0, 1, 2, 3, 4, 5, 6, 7, 12, 13, 14, 15], offeredPiece: null,
  });
  assert.deepStrictEqual(Quarto.getWinner(columnWin), { type: 'column', index: 0, trait: 'square', value: false });

  const diagonalWin = Quarto.createState({
    board: [[0, null, null, null], [null, 2, null, null], [null, null, 4, null], [null, null, null, 14]],
    available: [1, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15], offeredPiece: null,
  });
  assert.deepStrictEqual(Quarto.getWinner(diagonalWin), { type: 'diagonal', index: 0, trait: 'tall', value: false });
}

function testRejectsUnavailablePiecesAndRecognizesADraw() {
  const state = Quarto.createState();
  assert.throws(() => Quarto.offerPiece(state, 20), /고를 수 없는/);
  const draw = Quarto.createState({
    board: [[15, 6, 9, 10], [8, 0, 7, 5], [14, 11, 2, 12], [1, 3, 4, 13]],
    available: [], offeredPiece: null,
  });
  assert.strictEqual(Quarto.getStatus(draw), 'draw');
}

testPiecesHaveFourBinaryTraits();
testPlacesOnlyTheOfferedPieceOnAnEmptyCell();
testFindsAWinningSharedTraitInRowsColumnsAndDiagonals();
testRejectsUnavailablePiecesAndRecognizesADraw();
console.log('미니 콰르토 로직 테스트 통과');
