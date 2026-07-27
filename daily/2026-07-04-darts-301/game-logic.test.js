const assert = require('assert');
const Darts301 = require('./game-logic');

function testCreateGameStartsAt301() {
  const game = Darts301.createGame();

  assert.strictEqual(game.score, 301);
  assert.strictEqual(game.round, 1);
  assert.strictEqual(game.dartsLeft, 3);
  assert.deepStrictEqual(game.turnThrows, []);
  assert.strictEqual(game.status, '진행 중');
  assert.strictEqual(game.message, '점수판에서 맞힌 구역을 고르세요.');
}

function testScoresSingleDoubleTripleAndBull() {
  assert.strictEqual(Darts301.scoreThrow({ ring: 'single', value: 20 }), 20);
  assert.strictEqual(Darts301.scoreThrow({ ring: 'double', value: 20 }), 40);
  assert.strictEqual(Darts301.scoreThrow({ ring: 'triple', value: 19 }), 57);
  assert.strictEqual(Darts301.scoreThrow({ ring: 'singleBull' }), 25);
  assert.strictEqual(Darts301.scoreThrow({ ring: 'doubleBull' }), 50);
  assert.strictEqual(Darts301.scoreThrow({ ring: 'miss' }), 0);
}

function testThrowReducesScoreAndTracksDarts() {
  const game = Darts301.throwDart(Darts301.createGame(), { ring: 'triple', value: 20 });

  assert.strictEqual(game.score, 241);
  assert.strictEqual(game.dartsLeft, 2);
  assert.strictEqual(game.round, 1);
  assert.deepStrictEqual(game.turnThrows.map((dart) => dart.points), [60]);
  assert.strictEqual(game.message, '60점을 맞혔습니다. 남은 점수는 241점입니다.');
}

function testThirdThrowStartsNextRound() {
  let game = Darts301.createGame();
  game = Darts301.throwDart(game, { ring: 'single', value: 20 });
  game = Darts301.throwDart(game, { ring: 'single', value: 19 });
  game = Darts301.throwDart(game, { ring: 'single', value: 18 });

  assert.strictEqual(game.score, 244);
  assert.strictEqual(game.round, 2);
  assert.strictEqual(game.dartsLeft, 3);
  assert.deepStrictEqual(game.turnThrows, []);
  assert.deepStrictEqual(game.history[0].throws.map((dart) => dart.points), [20, 19, 18]);
  assert.strictEqual(game.message, '1라운드에 57점을 줄였습니다. 다음 라운드입니다.');
}

function testBustRestoresRoundStartScore() {
  const game = Darts301.createGame({ score: 12, roundStartScore: 12 });
  const result = Darts301.throwDart(game, { ring: 'single', value: 13 });

  assert.strictEqual(result.score, 12);
  assert.strictEqual(result.round, 2);
  assert.strictEqual(result.dartsLeft, 3);
  assert.deepStrictEqual(result.turnThrows, []);
  assert.strictEqual(result.history[0].bust, true);
  assert.strictEqual(result.message, '13점은 버스트입니다. 점수는 12점으로 돌아가고 다음 라운드입니다.');
}

function testMustFinishOnDouble() {
  const game = Darts301.createGame({ score: 20, roundStartScore: 20 });
  const result = Darts301.throwDart(game, { ring: 'single', value: 20 });

  assert.strictEqual(result.score, 20);
  assert.strictEqual(result.round, 2);
  assert.strictEqual(result.status, '진행 중');
  assert.strictEqual(result.message, '마지막 점수는 더블로 끝내야 합니다. 점수는 20점으로 돌아갑니다.');
}

function testWinningDoubleEndsGame() {
  const game = Darts301.createGame({ score: 40, roundStartScore: 40 });
  const result = Darts301.throwDart(game, { ring: 'double', value: 20 });

  assert.strictEqual(result.score, 0);
  assert.strictEqual(result.status, '성공');
  assert.strictEqual(result.dartsLeft, 2);
  assert.strictEqual(result.message, '더블 20으로 정확히 0점! 1라운드 만에 승리했습니다.');
}

function testCompletedGameIgnoresThrows() {
  const game = Darts301.createGame({ score: 0, status: '성공' });
  const result = Darts301.throwDart(game, { ring: 'double', value: 20 });

  assert.strictEqual(result.score, 0);
  assert.strictEqual(result.status, '성공');
  assert.strictEqual(result.message, '이미 끝난 판입니다. 새 판을 시작하세요.');
}

testCreateGameStartsAt301();
testScoresSingleDoubleTripleAndBull();
testThrowReducesScoreAndTracksDarts();
testThirdThrowStartsNextRound();
testBustRestoresRoundStartScore();
testMustFinishOnDouble();
testWinningDoubleEndsGame();
testCompletedGameIgnoresThrows();

console.log('301 다트 로직 테스트 통과');
