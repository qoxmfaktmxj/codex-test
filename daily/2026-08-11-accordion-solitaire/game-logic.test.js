const assert = require('assert');
const Accordion = require('./game-logic');

const deck = [
  { suit: '♠', rank: 'A' }, { suit: '♠', rank: '4' }, { suit: '♣', rank: 'K' }, { suit: '♦', rank: 'A' },
];

function testCreatesOnePileForEachCard() {
  const game = Accordion.createGame(deck);

  assert.strictEqual(game.piles.length, 4);
  assert.deepStrictEqual(game.piles.map((pile) => pile.length), [1, 1, 1, 1]);
  assert.strictEqual(game.status, '진행 중');
}

function testFindsMovesOneOrThreePilesToTheLeftWithSameSuitOrRank() {
  const game = Accordion.createGame(deck);

  assert.deepStrictEqual(Accordion.legalMoves(game), [
    { from: 1, to: 0 },
    { from: 3, to: 0 },
  ]);
}

function testMovesTheTopCardAndClosesTheSourcePile() {
  const next = Accordion.moveCard(Accordion.createGame(deck), 3, 0);

  assert.deepStrictEqual(next.piles.map((pile) => pile.length), [2, 1, 1]);
  assert.deepStrictEqual(next.piles[0][1], { suit: '♦', rank: 'A' });
  assert.strictEqual(next.moves, 1);
}

function testRejectsMovesThatDoNotMatchOrHaveTheWrongDistance() {
  const game = Accordion.createGame(deck);

  assert.throws(() => Accordion.moveCard(game, 2, 1), /옮길 수 없습니다/);
  assert.throws(() => Accordion.moveCard(game, 3, 1), /옮길 수 없습니다/);
}

function testMarksTheGameCompleteWhenOnlyOnePileRemains() {
  const game = { piles: [[deck[0]], [deck[3]]], moves: 4, status: '진행 중', message: '' };
  const next = Accordion.moveCard(game, 1, 0);

  assert.strictEqual(next.status, '성공');
  assert.strictEqual(next.piles.length, 1);
}

function testMarksTheGameFailedWhenNoCardsCanMove() {
  const game = Accordion.createGame([{ suit: '♠', rank: 'A' }, { suit: '♥', rank: '2' }]);

  assert.strictEqual(game.status, '실패');
  assert.deepStrictEqual(Accordion.legalMoves(game), []);
  assert.match(game.message, /옮길 수 있는 카드가 없습니다/);
}

function testBuildsAndShufflesAFullDeck() {
  const full = Accordion.createDeck();
  const shuffled = Accordion.shuffleDeck(full, () => 0);

  assert.strictEqual(full.length, 52);
  assert.strictEqual(new Set(full.map((card) => `${card.suit}${card.rank}`)).size, 52);
  assert.notDeepStrictEqual(shuffled, full);
  assert.strictEqual(full[0].rank, 'A');
}

testCreatesOnePileForEachCard();
testFindsMovesOneOrThreePilesToTheLeftWithSameSuitOrRank();
testMovesTheTopCardAndClosesTheSourcePile();
testRejectsMovesThatDoNotMatchOrHaveTheWrongDistance();
testMarksTheGameCompleteWhenOnlyOnePileRemains();
testMarksTheGameFailedWhenNoCardsCanMove();
testBuildsAndShufflesAFullDeck();

console.log('아코디언 솔리테어 로직 테스트 통과');
