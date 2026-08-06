const assert = require('assert');
const Mastermind = require('./game-logic');

function testCreatesAHiddenFourColorCode() {
  const game = Mastermind.createGame({ secret: ['빨강', '파랑', '초록', '노랑'] });
  assert.strictEqual(game.secret.length, 4);
  assert.strictEqual(game.status, '진행 중');
  assert.strictEqual(game.remaining, 8);
}

function testScoresExactAndMisplacedColorsSeparately() {
  const game = Mastermind.createGame({ secret: ['빨강', '파랑', '초록', '노랑'] });
  const next = Mastermind.submitGuess(game, ['빨강', '초록', '파랑', '보라']);
  assert.deepStrictEqual(next.guesses[0].score, { exact: 1, colorOnly: 2 });
  assert.strictEqual(next.remaining, 7);
}

function testWinsWhenAllPositionsMatch() {
  const game = Mastermind.createGame({ secret: ['빨강', '파랑', '초록', '노랑'] });
  const next = Mastermind.submitGuess(game, ['빨강', '파랑', '초록', '노랑']);
  assert.strictEqual(next.status, '승리');
  assert.match(next.message, /정답/);
}

function testRejectsUnknownOrRepeatedColors() {
  const game = Mastermind.createGame({ secret: ['빨강', '파랑', '초록', '노랑'] });
  assert.throws(() => Mastermind.submitGuess(game, ['빨강', '파랑', '초록', '검정']), /색/);
  assert.throws(() => Mastermind.submitGuess(game, ['빨강', '빨강', '초록', '노랑']), /중복/);
}

testCreatesAHiddenFourColorCode();
testScoresExactAndMisplacedColorsSeparately();
testWinsWhenAllPositionsMatch();
testRejectsUnknownOrRepeatedColors();

console.log('마스터마인드 로직 테스트 통과');
