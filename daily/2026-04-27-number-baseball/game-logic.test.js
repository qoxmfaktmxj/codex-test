const assert = require('node:assert/strict');
const {
  createAnswer,
  createGame,
  evaluateGuess,
  makeGuess,
} = require('./game-logic');

function test(name, fn) {
  try {
    fn();
    console.log(`ok - ${name}`);
  } catch (error) {
    console.error(`not ok - ${name}`);
    throw error;
  }
}

test('starts with the provided answer and no attempts', () => {
  const game = createGame('123');

  assert.deepEqual(game, {
    answer: '123',
    attempts: [],
    status: 'playing',
    message: '세 자리 숫자를 맞혀 보세요',
  });
});

test('creates a three digit answer without duplicate digits', () => {
  const values = [0.1, 0.5, 0.9];
  const answer = createAnswer(() => values.shift());

  assert.equal(answer, '159');
});

test('creates an answer that does not start with zero', () => {
  assert.equal(createAnswer(() => 0), '102');
});

test('rejects guesses that start with zero', () => {
  const game = createGame('123');

  assert.deepEqual(makeGuess(game, '012'), {
    ...game,
    message: '서로 다른 세 자리 숫자를 입력하세요',
  });
});

test('counts strikes and balls for a valid guess', () => {
  assert.deepEqual(evaluateGuess('123', '132'), {
    guess: '132',
    strikes: 1,
    balls: 2,
  });
});

test('rejects guesses that are not three unique digits', () => {
  const game = createGame('123');

  assert.deepEqual(makeGuess(game, '12'), {
    ...game,
    message: '서로 다른 세 자리 숫자를 입력하세요',
  });

  assert.deepEqual(makeGuess(game, '112'), {
    ...game,
    message: '서로 다른 세 자리 숫자를 입력하세요',
  });

  assert.deepEqual(makeGuess(game, 'abc'), {
    ...game,
    message: '서로 다른 세 자리 숫자를 입력하세요',
  });
});

test('records valid attempts and keeps playing until solved', () => {
  const game = makeGuess(createGame('123'), '456');

  assert.equal(game.status, 'playing');
  assert.equal(game.message, '0 스트라이크, 0 볼');
  assert.deepEqual(game.attempts, [
    { guess: '456', strikes: 0, balls: 0 },
  ]);
});

test('marks the game as won when all three digits are strikes', () => {
  const game = makeGuess(createGame('123'), '123');

  assert.equal(game.status, 'won');
  assert.equal(game.message, '정답입니다! 1번 만에 맞혔어요');
  assert.deepEqual(game.attempts, [
    { guess: '123', strikes: 3, balls: 0 },
  ]);
});
