const assert = require('assert');
const OldMaid = require('./game-logic');

const card = (rank, id) => ({ rank, id: id || rank });

function testCreatesFifteenCardDeckWithOneJoker() {
  const deck = OldMaid.createDeck();
  assert.strictEqual(deck.length, 15);
  assert.strictEqual(deck.filter((item) => item.rank === '조커').length, 1);
  assert.strictEqual(new Set(deck.map((item) => item.id)).size, 15);
}

function testRemovesMatchingPairsButKeepsTheJoker() {
  const hand = [card('1', 'a'), card('1', 'b'), card('3', 'c'), card('조커', 'j')];
  assert.deepStrictEqual(OldMaid.removePairs(hand), [card('3', 'c'), card('조커', 'j')]);
}

function testPlayerDrawsChosenComputerCardAndPassesTurn() {
  const game = {
    player: [card('1', 'p1')], computer: [card('1', 'c1'), card('조커', 'j')],
    turn: '플레이어', status: '진행 중', message: '', moves: 0,
  };
  const next = OldMaid.playerDraw(game, 0);
  assert.deepStrictEqual(next.player, []);
  assert.deepStrictEqual(next.computer, [card('조커', 'j')]);
  assert.strictEqual(next.status, '승리');
}

function testComputerDrawsUsingProvidedRandomValue() {
  const game = {
    player: [card('1', 'p1'), card('조커', 'j')], computer: [card('1', 'c1')],
    turn: '컴퓨터', status: '진행 중', message: '', moves: 2,
  };
  const next = OldMaid.computerDraw(game, () => 0);
  assert.deepStrictEqual(next.player, [card('조커', 'j')]);
  assert.deepStrictEqual(next.computer, []);
  assert.strictEqual(next.status, '패배');
}

function testRejectsDrawsOutsideTheCurrentTurn() {
  const game = OldMaid.createGame(OldMaid.createDeck());
  assert.throws(() => OldMaid.computerDraw(game), /컴퓨터 차례가 아닙니다/);
  assert.throws(() => OldMaid.playerDraw(game, 99), /고를 수 없는 카드입니다/);
}

testCreatesFifteenCardDeckWithOneJoker();
testRemovesMatchingPairsButKeepsTheJoker();
testPlayerDrawsChosenComputerCardAndPassesTurn();
testComputerDrawsUsingProvidedRandomValue();
testRejectsDrawsOutsideTheCurrentTurn();

console.log('올드 메이드 로직 테스트 통과');
