const assert = require('assert');
const {
  TARGET_STREAK,
  createGame,
  compareCards,
  guessNext,
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

test('새 게임은 첫 카드를 열고 남은 카드와 기회를 준비한다', () => {
  const game = createGame({ deck: [4, 9, 2, 12] });
  assert.strictEqual(game.targetStreak, TARGET_STREAK);
  assert.strictEqual(game.currentCard, 4);
  assert.deepStrictEqual(game.deck, [9, 2, 12]);
  assert.strictEqual(game.streak, 0);
  assert.strictEqual(game.bestStreak, 0);
  assert.strictEqual(game.lives, 3);
  assert.strictEqual(game.status, '진행 중');
  assert.strictEqual(game.message, '다음 카드가 더 높을지 낮을지 맞혀 보세요.');
});

test('카드 비교는 높음, 낮음, 같음을 판정한다', () => {
  assert.strictEqual(compareCards(4, 9), 'higher');
  assert.strictEqual(compareCards(11, 3), 'lower');
  assert.strictEqual(compareCards(7, 7), 'same');
});

test('정답을 맞히면 연속 정답과 최고 기록이 오른다', () => {
  const game = guessNext(createGame({ deck: [4, 9, 2] }), 'higher');
  assert.strictEqual(game.currentCard, 9);
  assert.deepStrictEqual(game.deck, [2]);
  assert.strictEqual(game.streak, 1);
  assert.strictEqual(game.bestStreak, 1);
  assert.strictEqual(game.lives, 3);
  assert.strictEqual(game.message, '정답입니다! 9 카드는 더 높았습니다.');
});

test('오답이면 기회가 줄고 연속 정답은 초기화된다', () => {
  const started = createGame({ deck: [10, 2, 12], streak: 2, bestStreak: 3 });
  const game = guessNext(started, 'higher');
  assert.strictEqual(game.currentCard, 2);
  assert.strictEqual(game.streak, 0);
  assert.strictEqual(game.bestStreak, 3);
  assert.strictEqual(game.lives, 2);
  assert.strictEqual(game.message, '틀렸습니다. 2 카드는 더 낮았습니다.');
});

test('목표 연속 정답에 도달하면 승리한다', () => {
  const game = guessNext(
    createGame({ deck: [5, 6, 7], targetStreak: 2, streak: 1, bestStreak: 1 }),
    'higher',
  );
  assert.strictEqual(game.status, '승리');
  assert.strictEqual(game.streak, 2);
  assert.strictEqual(game.message, '목표 연속 정답을 달성했습니다!');
});

test('기회를 모두 잃으면 게임이 끝난다', () => {
  const game = guessNext(createGame({ deck: [8, 3], lives: 1 }), 'higher');
  assert.strictEqual(game.status, '패배');
  assert.strictEqual(game.lives, 0);
  assert.strictEqual(game.message, '기회를 모두 썼습니다. 다시 도전하세요.');
});

test('카드가 떨어지면 현재 기록으로 종료한다', () => {
  const game = guessNext(createGame({ deck: [4, 6] }), 'higher');
  assert.strictEqual(game.status, '종료');
  assert.strictEqual(game.message, '남은 카드가 없습니다. 새 게임을 시작하세요.');
});

test('새로 시작하면 상태가 초기화된다', () => {
  const game = resetGame({ deck: [13, 1, 9] });
  assert.deepStrictEqual(game, createGame({ deck: [13, 1, 9] }));
});
