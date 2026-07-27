const assert = require('assert');
const PokerSquares = require('./game-logic');

function card(rank, suit) {
  return { rank, suit };
}

function testCreatesGameWithFirstCardReady() {
  const deck = [
    card('A', 'S'), card('2', 'H'), card('3', 'D'), card('4', 'C'), card('5', 'S'),
    card('6', 'H'), card('7', 'D'), card('8', 'C'), card('9', 'S'), card('10', 'H'),
    card('J', 'D'), card('Q', 'C'), card('K', 'S'), card('A', 'H'), card('2', 'D'),
    card('3', 'C'), card('4', 'S'), card('5', 'H'), card('6', 'D'), card('7', 'C'),
    card('8', 'S'), card('9', 'H'), card('10', 'D'), card('J', 'C'), card('Q', 'S'),
  ];

  const game = PokerSquares.createGame({ deck });

  assert.deepStrictEqual(game.currentCard, card('A', 'S'));
  assert.strictEqual(game.deck.length, 24);
  assert.strictEqual(game.placedCount, 0);
  assert.strictEqual(game.status, '진행 중');
  assert.strictEqual(game.totalScore, 0);
}

function testPlacesCurrentCardAndDrawsNext() {
  const game = PokerSquares.createGame({
    deck: [card('A', 'S'), card('K', 'H'), card('Q', 'D')],
  });

  const next = PokerSquares.placeCard(game, 2, 3);

  assert.deepStrictEqual(next.grid[2][3], card('A', 'S'));
  assert.deepStrictEqual(next.currentCard, card('K', 'H'));
  assert.strictEqual(next.deck.length, 1);
  assert.strictEqual(next.placedCount, 1);
  assert.match(next.message, /다음 카드/);
}

function testRejectsInvalidPlacement() {
  const game = PokerSquares.placeCard(PokerSquares.createGame({
    deck: [card('A', 'S'), card('K', 'H')],
  }), 0, 0);

  assert.throws(() => PokerSquares.placeCard(game, 0, 0), /이미 카드/);
  assert.throws(() => PokerSquares.placeCard(game, 5, 0), /범위/);
}

function testScoresPokerHands() {
  assert.strictEqual(PokerSquares.scoreHand([
    card('10', 'S'), card('J', 'S'), card('Q', 'S'), card('K', 'S'), card('A', 'S'),
  ]).score, 100);
  assert.strictEqual(PokerSquares.scoreHand([
    card('9', 'H'), card('10', 'H'), card('J', 'H'), card('Q', 'H'), card('K', 'H'),
  ]).name, '스트레이트 플러시');
  assert.strictEqual(PokerSquares.scoreHand([
    card('7', 'S'), card('7', 'H'), card('7', 'D'), card('7', 'C'), card('2', 'S'),
  ]).score, 16);
  assert.strictEqual(PokerSquares.scoreHand([
    card('4', 'S'), card('4', 'H'), card('4', 'D'), card('9', 'C'), card('9', 'S'),
  ]).name, '풀 하우스');
  assert.strictEqual(PokerSquares.scoreHand([
    card('A', 'S'), card('2', 'D'), card('3', 'H'), card('4', 'C'), card('5', 'S'),
  ]).name, '스트레이트');
}

function testCompletesBoardAndTotalsRowsAndColumns() {
  const cards = [
    card('10', 'S'), card('J', 'S'), card('Q', 'S'), card('K', 'S'), card('A', 'S'),
    card('7', 'H'), card('7', 'D'), card('7', 'C'), card('2', 'S'), card('2', 'H'),
    card('3', 'S'), card('4', 'D'), card('5', 'H'), card('6', 'C'), card('7', 'S'),
    card('9', 'S'), card('9', 'H'), card('5', 'D'), card('5', 'C'), card('A', 'D'),
    card('2', 'C'), card('4', 'C'), card('6', 'C'), card('8', 'C'), card('10', 'C'),
  ];
  let game = PokerSquares.createGame({ deck: cards });

  for (let row = 0; row < 5; row += 1) {
    for (let col = 0; col < 5; col += 1) {
      game = PokerSquares.placeCard(game, row, col);
    }
  }

  assert.strictEqual(game.status, '완료');
  assert.strictEqual(game.currentCard, null);
  assert.strictEqual(game.rows[0].name, '로열 플러시');
  assert.strictEqual(game.rows[0].score, 100);
  assert.strictEqual(game.rows.reduce((total, line) => total + line.score, 0), 130);
  assert.deepStrictEqual(game.columns.map((line) => line.score), [0, 1, 1, 0, 1]);
  assert.strictEqual(game.totalScore, 133);
  assert.match(game.message, /완성/);
}

testCreatesGameWithFirstCardReady();
testPlacesCurrentCardAndDrawsNext();
testRejectsInvalidPlacement();
testScoresPokerHands();
testCompletesBoardAndTotalsRowsAndColumns();

console.log('카드 열 맞추기 로직 테스트 통과');
