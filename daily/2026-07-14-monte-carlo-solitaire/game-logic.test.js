const assert = require('assert');
const MonteCarlo = require('./game-logic');

function card(rank, suit) {
  return { rank, suit };
}

function testCreateDeckHasClassicCards() {
  const deck = MonteCarlo.createDeck();

  assert.strictEqual(deck.length, 52);
  assert.deepStrictEqual(deck[0], card('A', '♠'));
  assert.deepStrictEqual(deck[51], card('K', '♣'));
}

function testCreateGameDealsTwentyFiveCards() {
  const game = MonteCarlo.createGame({
    deck: MonteCarlo.createDeck(),
    shuffle: false,
  });

  assert.strictEqual(game.board.length, 25);
  assert.strictEqual(game.stock.length, 27);
  assert.strictEqual(game.removedPairs, 0);
  assert.strictEqual(game.status, '진행 중');
  assert.strictEqual(game.message, '같은 숫자의 가로, 세로, 대각선 이웃 카드 두 장을 고르세요.');
}

function testAdjacentSameRankPairCanBeRemovedAndCompacted() {
  const game = MonteCarlo.createGame({
    deck: [
      card('A', '♠'), card('A', '♥'), card('2', '♠'), card('3', '♠'), card('4', '♠'),
      card('5', '♠'), card('6', '♠'), card('7', '♠'), card('8', '♠'), card('9', '♠'),
      card('10', '♠'), card('J', '♠'), card('Q', '♠'), card('K', '♠'), card('2', '♥'),
      card('3', '♥'), card('4', '♥'), card('5', '♥'), card('6', '♥'), card('7', '♥'),
      card('8', '♥'), card('9', '♥'), card('10', '♥'), card('J', '♥'), card('Q', '♥'),
      card('K', '♥'), card('2', '♦'),
    ],
    shuffle: false,
  });

  const next = MonteCarlo.removePair(game, 0, 1);

  assert.strictEqual(next.removedPairs, 1);
  assert.deepStrictEqual(next.board[0], card('2', '♠'));
  assert.deepStrictEqual(next.board[23], card('K', '♥'));
  assert.deepStrictEqual(next.board[24], card('2', '♦'));
  assert.strictEqual(next.stock.length, 0);
  assert.strictEqual(next.status, '막힘');
  assert.strictEqual(next.message, '더 이상 이웃한 같은 숫자가 없습니다.');
}

function testRejectsInvalidPairs() {
  const game = MonteCarlo.createGame({
    deck: [
      card('A', '♠'), card('2', '♥'), card('A', '♦'), card('3', '♠'), card('4', '♠'),
      card('5', '♠'), card('6', '♠'), card('7', '♠'), card('8', '♠'), card('9', '♠'),
      card('10', '♠'), card('J', '♠'), card('Q', '♠'), card('K', '♠'), card('2', '♠'),
      card('3', '♥'), card('4', '♥'), card('5', '♥'), card('6', '♥'), card('7', '♥'),
      card('8', '♥'), card('9', '♥'), card('10', '♥'), card('J', '♥'), card('Q', '♥'),
    ],
    shuffle: false,
  });

  assert.throws(() => MonteCarlo.removePair(game, 0, 1), /같은 숫자/);
  assert.throws(() => MonteCarlo.removePair(game, 0, 2), /서로 이웃/);
}

function testHintsFindAdjacentSameRankCards() {
  const game = MonteCarlo.createGame({
    deck: [
      card('A', '♠'), card('2', '♥'), card('3', '♦'), card('4', '♠'), card('5', '♠'),
      card('6', '♠'), card('A', '♥'), card('7', '♠'), card('8', '♠'), card('9', '♠'),
      card('10', '♠'), card('J', '♠'), card('Q', '♠'), card('K', '♠'), card('2', '♠'),
      card('3', '♥'), card('4', '♥'), card('5', '♥'), card('6', '♥'), card('7', '♥'),
      card('8', '♥'), card('9', '♥'), card('10', '♥'), card('J', '♥'), card('Q', '♥'),
    ],
    shuffle: false,
  });

  assert.deepStrictEqual(MonteCarlo.findPairs(game), [{ first: 0, second: 6 }]);
}

function testGameReportsWinAndBlockedStates() {
  const winning = MonteCarlo.createGame({
    board: [],
    stock: [],
    removedPairs: 26,
  });
  const blocked = MonteCarlo.createGame({
    board: [card('A', '♠'), card('2', '♥')],
    stock: [],
    removedPairs: 25,
  });

  assert.strictEqual(MonteCarlo.evaluateGame(winning).status, '승리');
  assert.strictEqual(MonteCarlo.evaluateGame(blocked).status, '막힘');
}

testCreateDeckHasClassicCards();
testCreateGameDealsTwentyFiveCards();
testAdjacentSameRankPairCanBeRemovedAndCompacted();
testRejectsInvalidPairs();
testHintsFindAdjacentSameRankCards();
testGameReportsWinAndBlockedStates();

console.log('몬테카를로 솔리테어 로직 테스트 통과');
