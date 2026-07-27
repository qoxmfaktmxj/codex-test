const assert = require('assert');
const AceyDeucey = require('./game-logic');

function testCreateGameDealsTwoSortedCards() {
  const deck = [
    { rank: 9, suit: 'spades' },
    { rank: 3, suit: 'hearts' },
    { rank: 7, suit: 'clubs' },
  ];
  const game = AceyDeucey.createGame({ deck, chips: 25 });

  assert.strictEqual(game.chips, 25);
  assert.deepStrictEqual(game.lowCard, { rank: 3, suit: 'hearts' });
  assert.deepStrictEqual(game.highCard, { rank: 9, suit: 'spades' });
  assert.strictEqual(game.deck.length, 1);
  assert.strictEqual(game.status, '진행 중');
  assert.strictEqual(game.message, '두 카드 사이에 다음 카드가 들어갈지 배팅하세요.');
}

function testBetWinsWhenNextCardIsBetweenOpenCards() {
  const game = AceyDeucey.createGame({
    chips: 20,
    deck: [
      { rank: 4, suit: 'clubs' },
      { rank: 10, suit: 'diamonds' },
      { rank: 8, suit: 'spades' },
      { rank: 2, suit: 'hearts' },
      { rank: 12, suit: 'clubs' },
    ],
  });

  const result = AceyDeucey.placeBet(game, 5);

  assert.strictEqual(result.chips, 25);
  assert.strictEqual(result.lastCard.rank, 8);
  assert.strictEqual(result.round, 2);
  assert.strictEqual(result.history[0].outcome, '승리');
  assert.strictEqual(result.message, '8 스페이드 카드가 사이에 들어왔습니다. 5칩을 얻었습니다.');
  assert.deepStrictEqual(result.lowCard, { rank: 2, suit: 'hearts' });
  assert.deepStrictEqual(result.highCard, { rank: 12, suit: 'clubs' });
}

function testBetLosesOnEqualOrOutsideCard() {
  const game = AceyDeucey.createGame({
    chips: 12,
    deck: [
      { rank: 5, suit: 'hearts' },
      { rank: 11, suit: 'clubs' },
      { rank: 11, suit: 'spades' },
      { rank: 4, suit: 'diamonds' },
      { rank: 9, suit: 'hearts' },
    ],
  });

  const result = AceyDeucey.placeBet(game, 4);

  assert.strictEqual(result.chips, 8);
  assert.strictEqual(result.history[0].outcome, '패배');
  assert.strictEqual(result.message, 'J 스페이드 카드는 사이에 없습니다. 4칩을 잃었습니다.');
  assert.deepStrictEqual(result.lowCard, { rank: 4, suit: 'diamonds' });
  assert.deepStrictEqual(result.highCard, { rank: 9, suit: 'hearts' });
}

function testPassKeepsChipsAndDealsFreshCards() {
  const game = AceyDeucey.createGame({
    chips: 15,
    deck: [
      { rank: 2, suit: 'clubs' },
      { rank: 14, suit: 'spades' },
      { rank: 6, suit: 'diamonds' },
      { rank: 9, suit: 'clubs' },
    ],
  });

  const result = AceyDeucey.passRound(game);

  assert.strictEqual(result.chips, 15);
  assert.strictEqual(result.round, 2);
  assert.strictEqual(result.history[0].outcome, '패스');
  assert.deepStrictEqual(result.lowCard, { rank: 6, suit: 'diamonds' });
  assert.deepStrictEqual(result.highCard, { rank: 9, suit: 'clubs' });
  assert.strictEqual(result.message, '이번 판을 넘겼습니다. 새 카드 두 장을 펼쳤습니다.');
}

function testBetCannotExceedChipsOrUseEndedGame() {
  const game = AceyDeucey.createGame({
    chips: 3,
    deck: [
      { rank: 2, suit: 'clubs' },
      { rank: 8, suit: 'spades' },
      { rank: 6, suit: 'diamonds' },
    ],
  });

  const invalid = AceyDeucey.placeBet(game, 5);
  assert.strictEqual(invalid.chips, 3);
  assert.strictEqual(invalid.message, '가진 칩 안에서 1칩 이상 배팅하세요.');

  const ended = AceyDeucey.createGame({ chips: 0, status: '파산' });
  const ignored = AceyDeucey.placeBet(ended, 1);
  assert.strictEqual(ignored.status, '파산');
  assert.strictEqual(ignored.message, '이미 끝난 판입니다. 새 판을 시작하세요.');
}

function testGameEndsWhenChipsReachZeroOrTarget() {
  const busted = AceyDeucey.placeBet(
    AceyDeucey.createGame({
      chips: 4,
      deck: [
        { rank: 4, suit: 'clubs' },
        { rank: 9, suit: 'hearts' },
        { rank: 12, suit: 'spades' },
      ],
    }),
    4,
  );
  assert.strictEqual(busted.chips, 0);
  assert.strictEqual(busted.status, '파산');

  const cleared = AceyDeucey.placeBet(
    AceyDeucey.createGame({
      chips: 28,
      targetChips: 30,
      deck: [
        { rank: 3, suit: 'diamonds' },
        { rank: 12, suit: 'clubs' },
        { rank: 7, suit: 'hearts' },
      ],
    }),
    2,
  );
  assert.strictEqual(cleared.chips, 30);
  assert.strictEqual(cleared.status, '성공');
}

testCreateGameDealsTwoSortedCards();
testBetWinsWhenNextCardIsBetweenOpenCards();
testBetLosesOnEqualOrOutsideCard();
testPassKeepsChipsAndDealsFreshCards();
testBetCannotExceedChipsOrUseEndedGame();
testGameEndsWhenChipsReachZeroOrTarget();

console.log('에이스 듀스 로직 테스트 통과');
