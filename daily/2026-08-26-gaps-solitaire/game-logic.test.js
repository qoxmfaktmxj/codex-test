const assert = require('assert');
const Gaps = require('./game-logic');

function card(suit, rank) { return { suit, rank }; }

function testFindsGapsAndOnlyAllowsTheNextSameSuitCard() {
  const board = [
    card('hearts', 6), null, card('clubs', 13),
    card('spades', 2), card('diamonds', 4), null,
  ];
  assert.deepStrictEqual(Gaps.findGaps(board), [1, 5]);
  assert.strictEqual(Gaps.canFillGap(board, 1, card('hearts', 7)), true);
  assert.strictEqual(Gaps.canFillGap(board, 1, card('clubs', 7)), false);
  assert.strictEqual(Gaps.canFillGap(board, 5, card('diamonds', 5)), true);
  assert.strictEqual(Gaps.canFillGap(board, 5, card('diamonds', 13)), false);
  assert.strictEqual(Gaps.canFillGap([null, card('clubs', 3)], 0, card('hearts', 2)), true);
}

function testMovesAValidCardIntoTheSelectedGapWithoutMutatingBoard() {
  const board = [card('hearts', 6), null, card('hearts', 7), card('clubs', 1), null, card('clubs', 2)];
  const next = Gaps.moveCard(board, 2, 1);
  assert.deepStrictEqual(next, [card('hearts', 6), card('hearts', 7), null, card('clubs', 1), null, card('clubs', 2)]);
  assert.deepStrictEqual(board, [card('hearts', 6), null, card('hearts', 7), card('clubs', 1), null, card('clubs', 2)]);
  assert.throws(() => Gaps.moveCard(board, 3, 1), /놓을 수 없습니다/);
}

function testDetectsAllFourCompletedSuitRuns() {
  const suits = ['clubs', 'diamonds', 'hearts', 'spades'];
  const won = suits.flatMap((suit) => [...Array.from({ length: 12 }, (_, index) => card(suit, index + 2)), null]);
  assert.strictEqual(Gaps.getStatus(won), 'won');
  const reordered = ['hearts', 'clubs', 'spades', 'diamonds'].flatMap((suit) => [...Array.from({ length: 12 }, (_, index) => card(suit, index + 2)), null]);
  assert.strictEqual(Gaps.getStatus(reordered), 'won');
  won[11] = null;
  assert.strictEqual(Gaps.getStatus(won), 'playing');
}

function testRejectsInvalidCardsAndBoardShape() {
  assert.throws(() => Gaps.createBoard([card('stars', 1)]), /카드 정보/);
  assert.throws(() => Gaps.createBoard('not a board'), /말판 정보/);
}

testFindsGapsAndOnlyAllowsTheNextSameSuitCard();
testMovesAValidCardIntoTheSelectedGapWithoutMutatingBoard();
testDetectsAllFourCompletedSuitRuns();
testRejectsInvalidCardsAndBoardShape();

console.log('갭 솔리테어 로직 테스트 통과');
