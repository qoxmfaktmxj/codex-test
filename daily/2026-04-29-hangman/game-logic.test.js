const assert = require('node:assert/strict');
const {
  MAX_MISSES,
  createGame,
  guessLetter,
  pickWord,
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

test('starts with hidden Korean word and no misses', () => {
  const game = createGame('바나나');

  assert.deepEqual(game.answer, ['바', '나', '나']);
  assert.deepEqual(game.revealed, ['_', '_', '_']);
  assert.deepEqual(game.guesses, []);
  assert.equal(game.misses, 0);
  assert.equal(game.status, 'playing');
});

test('reveals every matching Korean letter', () => {
  const game = guessLetter(createGame('바나나'), '나');

  assert.deepEqual(game.revealed, ['_', '나', '나']);
  assert.deepEqual(game.guesses, ['나']);
  assert.equal(game.misses, 0);
  assert.equal(game.status, 'playing');
});

test('counts a wrong unused letter as one miss', () => {
  const game = guessLetter(createGame('바나나'), '사');

  assert.deepEqual(game.revealed, ['_', '_', '_']);
  assert.deepEqual(game.guesses, ['사']);
  assert.equal(game.misses, 1);
  assert.equal(game.status, 'playing');
});

test('ignores duplicate guesses without changing misses', () => {
  const first = guessLetter(createGame('바나나'), '사');
  const second = guessLetter(first, '사');

  assert.deepEqual(second.guesses, ['사']);
  assert.equal(second.misses, 1);
});

test('wins when every Korean letter is revealed', () => {
  const first = guessLetter(createGame('바나나'), '바');
  const second = guessLetter(first, '나');

  assert.deepEqual(second.revealed, ['바', '나', '나']);
  assert.equal(second.status, 'won');
});

test('loses after maximum misses', () => {
  let game = createGame('바나나');
  for (const letter of ['가', '다', '라', '마', '사', '아']) {
    game = guessLetter(game, letter);
  }

  assert.equal(MAX_MISSES, 6);
  assert.equal(game.misses, 6);
  assert.equal(game.status, 'lost');
});

test('rejects guesses that are not one Korean syllable', () => {
  const game = createGame('바나나');

  assert.deepEqual(guessLetter(game, ''), game);
  assert.deepEqual(guessLetter(game, 'AB'), game);
  assert.deepEqual(guessLetter(game, '나나'), game);
});

test('picks a word by clamping random value into the word list', () => {
  const words = ['가방', '나무', '다리'];

  assert.equal(pickWord(words, () => 0), '가방');
  assert.equal(pickWord(words, () => 0.5), '나무');
  assert.equal(pickWord(words, () => 1), '다리');
});

test('falls back to the default word when word list is empty', () => {
  assert.equal(pickWord([], () => 0), '바나나');
});
