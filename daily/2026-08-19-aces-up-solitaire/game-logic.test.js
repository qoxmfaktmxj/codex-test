const assert = require('assert');
const AcesUp = require('./game-logic');

function card(suit, rank) {
  return { suit, rank };
}

function testFindsOnlyLowerCardsThatShareASuit() {
  const piles = [
    [card('hearts', 4)],
    [card('clubs', 13)],
    [card('hearts', 11)],
    [card('spades', 14)],
  ];
  assert.strictEqual(AcesUp.canDiscardTop(piles, 0), true);
  assert.strictEqual(AcesUp.canDiscardTop(piles, 2), false);
  assert.strictEqual(AcesUp.canDiscardTop(piles, 1), false);
}

function testDiscardsWithoutChangingTheOriginalPiles() {
  const piles = [[card('diamonds', 3)], [card('diamonds', 9)], [], []];
  const next = AcesUp.discardTop(piles, 0);
  assert.deepStrictEqual(next[0], []);
  assert.strictEqual(piles[0].length, 1);
  assert.throws(() => AcesUp.discardTop(piles, 1), /버릴 수/);
}

function testMovesOnlyATopCardToAnEmptyPile() {
  const piles = [[card('clubs', 7), card('spades', 2)], [], [card('hearts', 8)], []];
  const next = AcesUp.moveTopToEmpty(piles, 0, 1);
  assert.deepStrictEqual(next[0], [card('clubs', 7)]);
  assert.deepStrictEqual(next[1], [card('spades', 2)]);
  assert.throws(() => AcesUp.moveTopToEmpty(piles, 2, 0), /비어 있는/);
  assert.throws(() => AcesUp.moveTopToEmpty(piles, 1, 3), /옮길 카드/);
}

function testDealsOneCardToEachPileAndKnowsWhenTheGameIsWon() {
  const piles = [[], [], [], []];
  const deck = [card('clubs', 2), card('diamonds', 3), card('hearts', 4), card('spades', 5)];
  const dealt = AcesUp.deal(piles, deck);
  assert.deepStrictEqual(dealt.piles.map((pile) => pile[0]), deck);
  assert.deepStrictEqual(dealt.deck, []);
  assert.strictEqual(AcesUp.isWon([[card('clubs', 14)], [card('diamonds', 14)], [card('hearts', 14)], [card('spades', 14)]]), true);
  assert.strictEqual(AcesUp.isWon([[card('clubs', 14)], [], [], []]), false);
}

function testBuildsAFullDistinctDeck() {
  const deck = AcesUp.createDeck();
  assert.strictEqual(deck.length, 52);
  assert.strictEqual(new Set(deck.map(({ suit, rank }) => `${suit}-${rank}`)).size, 52);
}

testFindsOnlyLowerCardsThatShareASuit();
testDiscardsWithoutChangingTheOriginalPiles();
testMovesOnlyATopCardToAnEmptyPile();
testDealsOneCardToEachPileAndKnowsWhenTheGameIsWon();
testBuildsAFullDistinctDeck();

console.log('에이스 업 솔리테어 로직 테스트 통과');
