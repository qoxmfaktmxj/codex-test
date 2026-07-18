const assert = require('assert');
const ClockSolitaire = require('./game-logic');

function makeCard(rank, suit = '스페이드') {
  return { rank, suit };
}

function makeOrderedDeck() {
  const deck = [];
  ClockSolitaire.SUITS.forEach((suit) => {
    ClockSolitaire.RANKS.forEach((rank) => {
      deck.push({ rank, suit });
    });
  });
  return deck;
}

function testDealsThirteenPilesWithFourCardsEach() {
  const game = ClockSolitaire.createGame({ deck: makeOrderedDeck() });

  assert.strictEqual(game.piles.length, 13);
  assert.strictEqual(game.currentPile, ClockSolitaire.KING_PILE);
  assert.strictEqual(game.revealedCount, 0);
  assert.strictEqual(game.status, '진행 중');
  game.piles.forEach((pile) => {
    assert.strictEqual(pile.faceDown.length, 4);
    assert.deepStrictEqual(pile.faceUp, []);
  });
}

function testRankChoosesNextPileAfterTurn() {
  const deck = makeOrderedDeck();
  [deck[6], deck[12]] = [deck[12], deck[6]];
  const game = ClockSolitaire.createGame({ deck });
  const next = ClockSolitaire.turnCard(game);

  assert.strictEqual(next.piles[ClockSolitaire.KING_PILE].faceUp[0].rank, '7');
  assert.strictEqual(next.currentPile, 6);
  assert.strictEqual(next.revealedCount, 1);
  assert.match(next.message, /7/);
}

function testFourthKingLosesWhenCardsRemainHidden() {
  const game = ClockSolitaire.createGame({ deck: makeOrderedDeck() });
  const prepared = {
    ...game,
    currentPile: ClockSolitaire.KING_PILE,
    revealedCount: 3,
    piles: game.piles.map((pile, index) => ({
      faceDown: index === ClockSolitaire.KING_PILE ? [makeCard('K', '클럽')] : pile.faceDown.slice(0, 1),
      faceUp: index === ClockSolitaire.KING_PILE
        ? [makeCard('K', '스페이드'), makeCard('K', '하트'), makeCard('K', '다이아몬드')]
        : [],
    })),
  };

  const next = ClockSolitaire.turnCard(prepared);

  assert.strictEqual(next.status, '패배');
  assert.strictEqual(next.currentPile, ClockSolitaire.KING_PILE);
  assert.match(next.message, /왕 네 장/);
}

function testLastHiddenCardWinsEvenIfItIsKing() {
  const game = ClockSolitaire.createGame({ deck: makeOrderedDeck() });
  const prepared = {
    ...game,
    currentPile: ClockSolitaire.KING_PILE,
    revealedCount: 51,
    piles: game.piles.map((pile, index) => ({
      faceDown: index === ClockSolitaire.KING_PILE ? [makeCard('K', '클럽')] : [],
      faceUp: index === ClockSolitaire.KING_PILE
        ? [makeCard('K', '스페이드'), makeCard('K', '하트'), makeCard('K', '다이아몬드')]
        : pile.faceDown.slice(),
    })),
  };

  const next = ClockSolitaire.turnCard(prepared);

  assert.strictEqual(next.status, '승리');
  assert.strictEqual(next.revealedCount, 52);
  assert.match(next.message, /모든 카드/);
}

function testRejectsDuplicateDeckCards() {
  const deck = makeOrderedDeck();
  deck[10] = { ...deck[9] };

  assert.throws(() => ClockSolitaire.createGame({ deck }), /중복/);
}

testDealsThirteenPilesWithFourCardsEach();
testRankChoosesNextPileAfterTurn();
testFourthKingLosesWhenCardsRemainHidden();
testLastHiddenCardWinsEvenIfItIsKing();
testRejectsDuplicateDeckCards();

console.log('시계 솔리테어 로직 테스트 통과');
