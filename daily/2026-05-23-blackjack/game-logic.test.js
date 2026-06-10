const assert = require('assert');
const {
  createDeck,
  handValue,
  createGame,
  hitPlayer,
  standDealer,
  canPlayerAct,
  cardLabel,
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
  return { suit, rank };
}

test('새 덱은 서로 다른 카드 52장으로 만든다', () => {
  const deck = createDeck();
  assert.strictEqual(deck.length, 52);
  assert.strictEqual(new Set(deck.map((item) => `${item.suit}-${item.rank}`)).size, 52);
  assert.strictEqual(cardLabel(card('스페이드', 'A')), '스페이드 에이스');
});

test('패 값은 에이스를 11 또는 1로 조정한다', () => {
  assert.strictEqual(handValue([card('하트', 'A'), card('클럽', 'K')]), 21);
  assert.strictEqual(handValue([card('하트', 'A'), card('클럽', '9'), card('다이아몬드', '5')]), 15);
  assert.strictEqual(handValue([card('하트', 'A'), card('클럽', 'A'), card('스페이드', '9')]), 21);
});

test('새 게임은 플레이어와 딜러에게 두 장씩 나누고 플레이 상태를 만든다', () => {
  const game = createGame({
    deck: [
      card('스페이드', '7'),
      card('하트', '6'),
      card('클럽', '9'),
      card('다이아몬드', 'K'),
      card('스페이드', '5'),
    ],
  });
  assert.deepStrictEqual(game.playerHand, [card('스페이드', '7'), card('클럽', '9')]);
  assert.deepStrictEqual(game.dealerHand, [card('하트', '6'), card('다이아몬드', 'K')]);
  assert.strictEqual(game.deck.length, 1);
  assert.strictEqual(game.status, '플레이 중');
  assert.strictEqual(canPlayerAct(game), true);
});

test('플레이어가 카드를 받아 21을 넘으면 패배한다', () => {
  const game = createGame({
    deck: [
      card('스페이드', 'K'),
      card('하트', '6'),
      card('클럽', '8'),
      card('다이아몬드', '9'),
      card('스페이드', '5'),
    ],
  });
  const next = hitPlayer(game);
  assert.strictEqual(handValue(next.playerHand), 23);
  assert.strictEqual(next.status, '패배');
  assert.strictEqual(next.message, '21을 넘었습니다. 딜러의 승리입니다.');
  assert.strictEqual(canPlayerAct(next), false);
});

test('플레이어가 멈추면 딜러는 17 이상까지 받고 점수를 비교한다', () => {
  const game = createGame({
    deck: [
      card('스페이드', '10'),
      card('하트', '6'),
      card('클럽', '8'),
      card('다이아몬드', '9'),
      card('스페이드', '2'),
      card('클럽', 'K'),
    ],
  });
  const next = standDealer(game);
  assert.strictEqual(handValue(next.playerHand), 18);
  assert.strictEqual(handValue(next.dealerHand), 17);
  assert.strictEqual(next.status, '승리');
  assert.strictEqual(next.message, '플레이어 18점, 딜러 17점. 승리했습니다!');
});

test('처음 두 장으로 21을 만들면 즉시 승리한다', () => {
  const game = createGame({
    deck: [
      card('스페이드', 'A'),
      card('하트', '9'),
      card('클럽', 'K'),
      card('다이아몬드', '7'),
    ],
  });
  assert.strictEqual(handValue(game.playerHand), 21);
  assert.strictEqual(game.status, '승리');
  assert.strictEqual(game.message, '블랙잭! 시작하자마자 승리했습니다.');
});
