const assert = require('assert');
const Klondike = require('./game-logic');

function card(rank, suit, faceUp = true) {
  return { rank, suit, faceUp };
}

function testRecognizesAlternatingDescendingTableauMoves() {
  assert.strictEqual(Klondike.canPlaceOnTableau(card(7, '♥'), card(8, '♣')), true);
  assert.strictEqual(Klondike.canPlaceOnTableau(card(7, '♦'), card(8, '♠')), true);
  assert.strictEqual(Klondike.canPlaceOnTableau(card(7, '♣'), card(8, '♠')), false);
  assert.strictEqual(Klondike.canPlaceOnTableau(card(7, '♥'), card(7, '♣')), false);
  assert.strictEqual(Klondike.canPlaceOnTableau(card(7, '♥'), null), false);
  assert.strictEqual(Klondike.canPlaceOnTableau(card(13, '♠'), null), true);
}

function testBuildsFoundationInSuitOrder() {
  const foundation = [card(1, '♥')];
  assert.strictEqual(Klondike.canPlaceOnFoundation(card(2, '♥'), foundation), true);
  assert.strictEqual(Klondike.canPlaceOnFoundation(card(2, '♦'), foundation), false);
  assert.strictEqual(Klondike.canPlaceOnFoundation(card(3, '♥'), foundation), false);
  assert.strictEqual(Klondike.canPlaceOnFoundation(card(1, '♣'), []), true);
}

function testMovesOnlyTheExposedCardAndRevealsTheNextOne() {
  const state = Klondike.createState({
    tableau: [[card(9, '♣', false), card(8, '♥')], [card(9, '♠')]],
    foundations: { '♥': [], '♦': [], '♣': [], '♠': [] },
  });
  const next = Klondike.moveTableauCard(state, 0, 1);
  assert.strictEqual(next.tableau[0].length, 1);
  assert.strictEqual(next.tableau[0][0].faceUp, true);
  assert.deepStrictEqual(next.tableau[1].at(-1), card(8, '♥'));
  assert.strictEqual(state.tableau[0].length, 2);
  assert.throws(() => Klondike.moveTableauCard(state, 0, 1, 0), /맨 위/);
}

function testMovesAnExposedAceToItsFoundationAndDetectsVictory() {
  const state = Klondike.createState({
    tableau: [[card(1, '♥')]],
    foundations: {
      '♥': [],
      '♦': [card(1, '♦'), card(2, '♦'), card(3, '♦'), card(4, '♦'), card(5, '♦'), card(6, '♦'), card(7, '♦'), card(8, '♦'), card(9, '♦'), card(10, '♦'), card(11, '♦'), card(12, '♦'), card(13, '♦')],
      '♣': [card(1, '♣'), card(2, '♣'), card(3, '♣'), card(4, '♣'), card(5, '♣'), card(6, '♣'), card(7, '♣'), card(8, '♣'), card(9, '♣'), card(10, '♣'), card(11, '♣'), card(12, '♣'), card(13, '♣')],
      '♠': [card(1, '♠'), card(2, '♠'), card(3, '♠'), card(4, '♠'), card(5, '♠'), card(6, '♠'), card(7, '♠'), card(8, '♠'), card(9, '♠'), card(10, '♠'), card(11, '♠'), card(12, '♠'), card(13, '♠')],
    },
  });
  const next = Klondike.moveToFoundation(state, 0);
  assert.strictEqual(next.foundations['♥'].length, 1);
  assert.strictEqual(Klondike.getStatus(next), 'playing');
  next.foundations['♥'] = Array.from({ length: 13 }, (_, index) => card(index + 1, '♥'));
  assert.strictEqual(Klondike.getStatus(next), 'won');
}

testRecognizesAlternatingDescendingTableauMoves();
testBuildsFoundationInSuitOrder();
testMovesOnlyTheExposedCardAndRevealsTheNextOne();
testMovesAnExposedAceToItsFoundationAndDetectsVictory();

console.log('클론다이크 솔리테어 로직 테스트 통과');
