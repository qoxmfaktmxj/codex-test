const assert = require('assert');
const Mastermind = require('./game-logic');

function testCreateGameBuildsFourColorSecret() {
  const game = Mastermind.createGame({
    secret: ['빨강', '파랑', '초록', '노랑'],
    maxTurns: 8,
  });

  assert.deepStrictEqual(game.secret, ['빨강', '파랑', '초록', '노랑']);
  assert.strictEqual(game.maxTurns, 8);
  assert.strictEqual(game.turn, 1);
  assert.strictEqual(game.status, '진행 중');
  assert.strictEqual(game.message, '네 칸의 색을 고르고 암호를 추리하세요.');
  assert.deepStrictEqual(game.history, []);
}

function testScoreGuessCountsExactAndColorOnlyMatches() {
  const score = Mastermind.scoreGuess(
    ['빨강', '파랑', '초록', '노랑'],
    ['빨강', '초록', '보라', '파랑'],
  );

  assert.deepStrictEqual(score, { exact: 1, colorOnly: 2 });
}

function testSubmitGuessWinsOnPerfectMatch() {
  const game = Mastermind.createGame({
    secret: ['빨강', '파랑', '초록', '노랑'],
  });

  const result = Mastermind.submitGuess(game, ['빨강', '파랑', '초록', '노랑']);

  assert.strictEqual(result.status, '승리');
  assert.strictEqual(result.turn, 1);
  assert.strictEqual(result.history.length, 1);
  assert.deepStrictEqual(result.history[0].score, { exact: 4, colorOnly: 0 });
  assert.strictEqual(result.message, '정답입니다. 1번 만에 암호를 풀었습니다.');
}

function testSubmitGuessAdvancesUntilLoss() {
  const game = Mastermind.createGame({
    secret: ['빨강', '파랑', '초록', '노랑'],
    maxTurns: 2,
  });

  const first = Mastermind.submitGuess(game, ['보라', '주황', '보라', '주황']);
  const second = Mastermind.submitGuess(first, ['주황', '보라', '주황', '보라']);

  assert.strictEqual(first.status, '진행 중');
  assert.strictEqual(first.turn, 2);
  assert.strictEqual(first.message, '정확한 위치 0개, 색만 맞음 0개입니다.');
  assert.strictEqual(second.status, '패배');
  assert.strictEqual(second.turn, 2);
  assert.strictEqual(second.message, '기회를 모두 썼습니다. 정답은 빨강, 파랑, 초록, 노랑입니다.');
}

function testInvalidGuessIsRejected() {
  const game = Mastermind.createGame({
    secret: ['빨강', '파랑', '초록', '노랑'],
  });

  assert.throws(
    () => Mastermind.submitGuess(game, ['빨강', '파랑', '초록']),
    /네 칸의 색을 모두 골라야 합니다/,
  );
  assert.throws(
    () => Mastermind.submitGuess(game, ['빨강', '파랑', '초록', '검정']),
    /사용할 수 없는 색입니다/,
  );
}

testCreateGameBuildsFourColorSecret();
testScoreGuessCountsExactAndColorOnlyMatches();
testSubmitGuessWinsOnPerfectMatch();
testSubmitGuessAdvancesUntilLoss();
testInvalidGuessIsRejected();

console.log('마스터마인드 로직 테스트 통과');
