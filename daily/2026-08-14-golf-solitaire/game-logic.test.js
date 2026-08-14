const assert = require('assert');
const GolfSolitaire = require('./game-logic');

const card = (rank, id) => ({ rank, id: id || rank, suit: '테스트' });

function testBuildsACompleteDeck() {
  const deck = GolfSolitaire.createDeck();
  assert.strictEqual(deck.length, 52);
  assert.strictEqual(new Set(deck.map((item) => item.id)).size, 52);
}

function testRecognizesAdjacentRanksWithoutWrapping() {
  assert.strictEqual(GolfSolitaire.isAdjacentRank('7', '6'), true);
  assert.strictEqual(GolfSolitaire.isAdjacentRank('7', '8'), true);
  assert.strictEqual(GolfSolitaire.isAdjacentRank('A', 'K'), false);
}

function testDealsSevenColumnsAndAStartingWasteCard() {
  const game = GolfSolitaire.createGame(GolfSolitaire.createDeck());
  assert.strictEqual(game.tableau.length, 7);
  assert.deepStrictEqual(game.tableau.map((column) => column.length), [5, 5, 5, 5, 5, 5, 5]);
  assert.strictEqual(game.stock.length, 16);
  assert.strictEqual(game.waste.rank, 'K');
}

function testRemovesOnlyAnExposedAdjacentCard() {
  const game = {
    tableau: [[card('4', 'a'), card('7', 'b')], [card('Q', 'c')]], stock: [], waste: card('6', 'w'),
    status: '진행 중', message: '', moves: 0,
  };
  const next = GolfSolitaire.removeCard(game, 0);
  assert.strictEqual(next.tableau[0].length, 1);
  assert.strictEqual(next.waste.id, 'b');
  assert.strictEqual(next.moves, 1);
  assert.throws(() => GolfSolitaire.removeCard(game, 1), /놓을 수 없는 카드입니다/);
}

function testDrawsFromStockAndEndsWhenNoMoveRemains() {
  const game = {
    tableau: [[card('4', 'a')]], stock: [card('9', 's')], waste: card('6', 'w'),
    status: '진행 중', message: '', moves: 0,
  };
  const next = GolfSolitaire.drawStock(game);
  assert.strictEqual(next.waste.id, 's');
  assert.strictEqual(next.stock.length, 0);
  assert.strictEqual(next.status, '패배');
}

function testWinsAfterTheLastTableauCardIsRemoved() {
  const game = {
    tableau: [[card('7', 'a')]], stock: [card('2', 's')], waste: card('6', 'w'),
    status: '진행 중', message: '', moves: 3,
  };
  const next = GolfSolitaire.removeCard(game, 0);
  assert.strictEqual(next.status, '승리');
  assert.match(next.message, /모든 카드를 치웠습니다/);
}

function testRejectsInvalidDecksAndAnEmptyStock() {
  assert.throws(() => GolfSolitaire.createGame([]), /카드 정보가 올바르지 않습니다/);
  const game = { tableau: [[card('4', 'a')]], stock: [], waste: card('6', 'w'), status: '진행 중', message: '', moves: 0 };
  assert.throws(() => GolfSolitaire.drawStock(game), /더 꺼낼 카드가 없습니다/);
}

testBuildsACompleteDeck();
testRecognizesAdjacentRanksWithoutWrapping();
testDealsSevenColumnsAndAStartingWasteCard();
testRemovesOnlyAnExposedAdjacentCard();
testDrawsFromStockAndEndsWhenNoMoveRemains();
testWinsAfterTheLastTableauCardIsRemoved();
testRejectsInvalidDecksAndAnEmptyStock();

console.log('골프 솔리테어 로직 테스트 통과');
