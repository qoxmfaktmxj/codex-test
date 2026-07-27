const assert = require('assert');
const {
  TARGET_SCORE,
  createGame,
  rollDie,
  holdTurn,
  shouldComputerHold,
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

test('새 게임은 목표 점수와 내 차례를 준비한다', () => {
  const game = createGame();
  assert.strictEqual(game.targetScore, TARGET_SCORE);
  assert.deepStrictEqual(game.scores, { player: 0, computer: 0 });
  assert.strictEqual(game.turn, 'player');
  assert.strictEqual(game.turnTotal, 0);
  assert.strictEqual(game.status, '진행 중');
  assert.strictEqual(game.message, '주사위를 굴리거나 점수를 저장하세요.');
});

test('2부터 6까지는 이번 차례 점수에 더한다', () => {
  const game = rollDie(createGame(), 5);
  assert.strictEqual(game.lastRoll, 5);
  assert.strictEqual(game.turnTotal, 5);
  assert.strictEqual(game.turn, 'player');
  assert.strictEqual(game.message, '5이 나왔습니다. 계속 굴릴까요, 저장할까요?');
});

test('1이 나오면 이번 차례 점수를 잃고 차례가 넘어간다', () => {
  const started = createGame({ turnTotal: 12 });
  const game = rollDie(started, 1);
  assert.strictEqual(game.lastRoll, 1);
  assert.strictEqual(game.turnTotal, 0);
  assert.strictEqual(game.turn, 'computer');
  assert.deepStrictEqual(game.scores, { player: 0, computer: 0 });
  assert.strictEqual(game.message, '1이 나와 이번 차례 점수를 잃었습니다.');
});

test('점수를 저장하면 누적 점수가 오르고 차례가 바뀐다', () => {
  const game = holdTurn(createGame({ turnTotal: 18 }));
  assert.deepStrictEqual(game.scores, { player: 18, computer: 0 });
  assert.strictEqual(game.turn, 'computer');
  assert.strictEqual(game.turnTotal, 0);
  assert.strictEqual(game.message, '18점을 저장했습니다. 컴퓨터 차례입니다.');
});

test('목표 점수에 도달하면 승자를 확정한다', () => {
  const game = holdTurn(createGame({ scores: { player: 91, computer: 74 }, turnTotal: 9 }));
  assert.strictEqual(game.status, '종료');
  assert.strictEqual(game.winner, 'player');
  assert.strictEqual(game.message, '나의 승리입니다! 목표 점수에 먼저 도달했습니다.');
});

test('컴퓨터는 위험 점수나 승리 가능 점수에서 저장을 고른다', () => {
  assert.strictEqual(shouldComputerHold(createGame({ turn: 'computer', turnTotal: 8 })), false);
  assert.strictEqual(shouldComputerHold(createGame({ turn: 'computer', turnTotal: 16 })), true);
  assert.strictEqual(
    shouldComputerHold(createGame({ turn: 'computer', scores: { player: 40, computer: 94 }, turnTotal: 6 })),
    true,
  );
});

test('새로 시작하면 점수와 상태가 초기화된다', () => {
  const game = resetGame(createGame({ scores: { player: 99, computer: 88 }, turnTotal: 12, status: '종료' }));
  assert.deepStrictEqual(game, createGame());
});
