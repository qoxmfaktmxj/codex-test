const assert = require('assert');
const {
  RANKS,
  SUITS,
  DEFAULT_ROUND_LIMIT,
  createDeck,
  createGame,
  drawRound,
  formatCard,
  getWinner,
  resetGame,
} = require('./game-logic');

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}`);
    throw error;
  }
}

function card(suit, rank) {
  const found = createDeck().find((item) => item.suit === suit && item.rank === rank);
  return { ...found };
}

test('새 카드 묶음은 네 문양의 열세 등급으로 만든다', () => {
  const deck = createDeck();
  assert.strictEqual(deck.length, 52);
  assert.strictEqual(SUITS.length, 4);
  assert.strictEqual(RANKS.length, 13);
  assert.strictEqual(deck.filter((item) => item.rank === 'A').length, 4);
  assert.strictEqual(deck.find((item) => item.rank === 'A').value, 14);
  assert.strictEqual(deck.find((item) => item.rank === '2').value, 2);
});

test('새 게임은 점수 없이 지정 라운드와 섞인 카드로 시작한다', () => {
  const deck = [card('하트', 'A'), card('클럽', 'K')];
  const game = createGame({ deck, roundLimit: 1 });
  assert.deepStrictEqual(game.deck, deck);
  assert.strictEqual(game.round, 0);
  assert.strictEqual(game.roundLimit, 1);
  assert.deepStrictEqual(game.scores, { 나: 0, 컴퓨터: 0 });
  assert.strictEqual(game.status, '진행 중');
  assert.strictEqual(game.message, '카드 뽑기를 눌러 더 높은 카드를 겨루세요.');
});

test('내 카드가 높으면 내 점수가 오르고 카드 두 장을 소비한다', () => {
  const game = createGame({
    deck: [card('하트', 'A'), card('클럽', 'K'), card('스페이드', '3'), card('다이아몬드', '2')],
    roundLimit: 2,
  });
  const next = drawRound(game);
  assert.strictEqual(next.scores['나'], 1);
  assert.strictEqual(next.scores['컴퓨터'], 0);
  assert.strictEqual(next.round, 1);
  assert.strictEqual(next.deck.length, 2);
  assert.strictEqual(next.lastRound.result, '나');
  assert.strictEqual(next.message, '하트 에이스로 이겼습니다. 다음 카드를 뽑으세요.');
});

test('컴퓨터 카드가 높으면 컴퓨터 점수가 오른다', () => {
  const game = createGame({
    deck: [card('하트', '4'), card('클럽', 'Q'), card('스페이드', '7'), card('다이아몬드', '8')],
    roundLimit: 2,
  });
  const next = drawRound(game);
  assert.deepStrictEqual(next.scores, { 나: 0, 컴퓨터: 1 });
  assert.strictEqual(next.lastRound.result, '컴퓨터');
  assert.strictEqual(next.message, '클럽 퀸에 졌습니다. 다음 카드를 뽑으세요.');
});

test('같은 등급이면 점수 없이 라운드만 진행한다', () => {
  const game = createGame({
    deck: [card('하트', '9'), card('클럽', '9'), card('스페이드', '7'), card('다이아몬드', '8')],
    roundLimit: 2,
  });
  const next = drawRound(game);
  assert.deepStrictEqual(next.scores, { 나: 0, 컴퓨터: 0 });
  assert.strictEqual(next.lastRound.result, '무승부');
  assert.strictEqual(next.message, '같은 9입니다. 점수 없이 넘어갑니다.');
});

test('마지막 라운드가 끝나면 승자를 안내한다', () => {
  const game = createGame({
    deck: [card('하트', 'A'), card('클럽', 'K')],
    roundLimit: 1,
  });
  const next = drawRound(game);
  assert.strictEqual(next.status, '완료');
  assert.strictEqual(getWinner(next), '나');
  assert.strictEqual(next.message, '내 승리! 더 높은 카드를 많이 냈습니다.');
});

test('카드가 부족하면 즉시 완료하고 현재 점수로 승자를 정한다', () => {
  const game = createGame({
    deck: [card('하트', 'A')],
    scores: { 나: 2, 컴퓨터: 2 },
    roundLimit: 5,
  });
  const next = drawRound(game);
  assert.strictEqual(next.status, '완료');
  assert.strictEqual(next.message, '무승부입니다. 같은 수의 라운드를 가져갔습니다.');
  assert.strictEqual(getWinner(next), '무승부');
});

test('카드 표시와 다시 시작이 동작한다', () => {
  assert.strictEqual(formatCard(card('다이아몬드', 'J')), '다이아몬드 잭');
  const game = resetGame(() => 0.5);
  assert.strictEqual(game.deck.length, 52);
  assert.strictEqual(game.roundLimit, DEFAULT_ROUND_LIMIT);
  assert.deepStrictEqual(game.scores, { 나: 0, 컴퓨터: 0 });
});
