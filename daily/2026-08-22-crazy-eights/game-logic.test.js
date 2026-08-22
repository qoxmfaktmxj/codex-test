const assert = require('assert');
const CrazyEights = require('./game-logic');

function card(rank, suit) {
  return { rank, suit };
}

function testAllowsMatchingSuitRankAndEight() {
  const top = card(5, '♥');
  assert.strictEqual(CrazyEights.canPlayCard(card(2, '♥'), top), true);
  assert.strictEqual(CrazyEights.canPlayCard(card(5, '♣'), top), true);
  assert.strictEqual(CrazyEights.canPlayCard(card(8, '♠'), top), true);
  assert.strictEqual(CrazyEights.canPlayCard(card(3, '♣'), top), false);
}

function testPlaysACardAndChangesSuitForEight() {
  const state = CrazyEights.createState({
    hands: [[card(8, '♠'), card(3, '♦')], [card(4, '♥')]],
    drawPile: [card(6, '♣')],
    discardPile: [card(5, '♥')],
    activeSuit: '♥',
    turn: 0,
  });
  const next = CrazyEights.playCard(state, 0, 0, '♦');
  assert.deepStrictEqual(next.hands[0], [card(3, '♦')]);
  assert.deepStrictEqual(next.discardPile.at(-1), card(8, '♠'));
  assert.strictEqual(next.activeSuit, '♦');
  assert.strictEqual(next.turn, 1);
  assert.strictEqual(state.hands[0].length, 2);
}

function testRejectsIllegalMovesAndDrawsOneCard() {
  const state = CrazyEights.createState({
    hands: [[card(3, '♣')], [card(4, '♥')]],
    drawPile: [card(6, '♣'), card(2, '♦')],
    discardPile: [card(5, '♥')],
    activeSuit: '♥',
    turn: 0,
  });
  assert.throws(() => CrazyEights.playCard(state, 0, 0), /낼 수 없는/);
  const next = CrazyEights.drawCard(state, 0);
  assert.deepStrictEqual(next.hands[0].at(-1), card(2, '♦'));
  assert.strictEqual(next.drawPile.length, 1);
  assert.strictEqual(next.turn, 1);
}

function testRecyclesDiscardCardsAndEndsAfterBothPlayersPass() {
  const recycleState = CrazyEights.createState({
    hands: [[card(3, '♣')], [card(4, '♥')]],
    drawPile: [],
    discardPile: [card(2, '♦'), card(5, '♥')],
    activeSuit: '♥',
    turn: 0,
  });
  const recycled = CrazyEights.drawCard(recycleState, 0);
  assert.deepStrictEqual(recycled.hands[0].at(-1), card(2, '♦'));
  assert.deepStrictEqual(recycled.discardPile, [card(5, '♥')]);

  const blockedState = CrazyEights.createState({
    hands: [[card(3, '♣')], [card(4, '♦')]],
    drawPile: [],
    discardPile: [card(5, '♥')],
    activeSuit: '♥',
    turn: 0,
  });
  const firstPass = CrazyEights.passTurn(blockedState, 0);
  const secondPass = CrazyEights.passTurn(firstPass, 1);
  assert.strictEqual(CrazyEights.getStatus(secondPass), 'draw');
}

function testDetectsWinner() {
  const state = CrazyEights.createState({
    hands: [[], [card(1, '♣')]],
    drawPile: [],
    discardPile: [card(4, '♠')],
    activeSuit: '♠',
    turn: 1,
  });
  assert.strictEqual(CrazyEights.getStatus(state), 'player-won');
}

testAllowsMatchingSuitRankAndEight();
testPlaysACardAndChangesSuitForEight();
testRejectsIllegalMovesAndDrawsOneCard();
testRecyclesDiscardCardsAndEndsAfterBothPlayersPass();
testDetectsWinner();

console.log('팔자 카드 로직 테스트 통과');
