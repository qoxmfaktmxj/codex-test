const assert = require('assert');
const Pyramid = require('./game-logic');

const card = (rank, suit = '♠') => ({ rank, suit });

function testDealsTwentyEightCardsIntoSevenRows() {
  const game = Pyramid.createGame(Pyramid.createDeck());

  assert.strictEqual(game.pyramid.length, 28);
  assert.strictEqual(game.stock.length, 24);
  assert.strictEqual(game.status, '진행 중');
  assert.deepStrictEqual(game.pyramid.slice(0, 6).map((item) => item.row), [0, 1, 1, 2, 2, 2]);
}

function testExposesOnlyCardsWithoutCardsBelowThem() {
  const game = Pyramid.createGame(Pyramid.createDeck());

  assert.deepStrictEqual(Pyramid.availablePyramidIndexes(game), [21, 22, 23, 24, 25, 26, 27]);
}

function testRemovesTwoAvailableCardsThatAddToThirteen() {
  const game = {
    pyramid: [
      { ...card('6'), row: 0, removed: false },
      { ...card('7'), row: 1, removed: false },
      { ...card('6'), row: 1, removed: false },
    ],
    stock: [], waste: [], moves: 0, status: '진행 중', message: '',
  };
  const next = Pyramid.removePair(game, { source: 'pyramid', index: 1 }, { source: 'pyramid', index: 2 });

  assert.deepStrictEqual(next.pyramid.map((item) => item.removed), [false, true, true]);
  assert.strictEqual(next.moves, 1);
}

function testAllowsAKingToBeRemovedByItself() {
  const game = {
    pyramid: [{ ...card('K'), row: 0, removed: false }], stock: [], waste: [], moves: 2, status: '진행 중', message: '',
  };
  const next = Pyramid.removeKing(game, { source: 'pyramid', index: 0 });

  assert.strictEqual(next.pyramid[0].removed, true);
  assert.strictEqual(next.status, '성공');
}

function testDrawsTheNextCardToTheWastePile() {
  const game = {
    pyramid: [{ ...card('K'), row: 0, removed: false }], stock: [card('3'), card('9')], waste: [], moves: 0, status: '진행 중', message: '',
  };
  const next = Pyramid.drawCard(game);

  assert.deepStrictEqual(next.stock, [card('3')]);
  assert.deepStrictEqual(next.waste, [card('9')]);
}

function testRejectsCoveredOrWrongSumCards() {
  const game = Pyramid.createGame(Pyramid.createDeck());

  assert.throws(() => Pyramid.removeKing(game, { source: 'pyramid', index: 0 }), /제거할 수 없습니다/);
  assert.throws(() => Pyramid.removePair(game, { source: 'pyramid', index: 21 }, { source: 'pyramid', index: 22 }), /제거할 수 없습니다/);
}

function testMarksGameFailedAfterAllCardsAreBlocked() {
  const game = {
    pyramid: [
      { ...card('5'), row: 0, removed: false },
      { ...card('K'), row: 1, removed: false },
      { ...card('6'), row: 1, removed: false },
    ], stock: [], waste: [], moves: 0, status: '진행 중', message: '',
  };
  const next = Pyramid.removeKing(game, { source: 'pyramid', index: 1 });

  assert.strictEqual(next.status, '실패');
  assert.match(next.message, /더 이상 가능한 짝이 없습니다/);
}

testDealsTwentyEightCardsIntoSevenRows();
testExposesOnlyCardsWithoutCardsBelowThem();
testRemovesTwoAvailableCardsThatAddToThirteen();
testAllowsAKingToBeRemovedByItself();
testDrawsTheNextCardToTheWastePile();
testRejectsCoveredOrWrongSumCards();
testMarksGameFailedAfterAllCardsAreBlocked();

console.log('피라미드 솔리테어 로직 테스트 통과');
