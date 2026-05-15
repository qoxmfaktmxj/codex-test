const assert = require('node:assert/strict');
const {
  TILE_LABELS,
  TARGET_ROUNDS,
  createGame,
  startInput,
  chooseTile,
  sequenceText,
  remainingCount,
  visibleSequenceText,
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

test('starts a Korean Simon memory game by showing one random tile to memorize', () => {
  const game = createGame({ random: () => 0.3 });

  assert.deepEqual(TILE_LABELS, ['빨강', '파랑', '노랑', '초록']);
  assert.equal(TARGET_ROUNDS, 5);
  assert.deepEqual(game.sequence, ['파랑']);
  assert.equal(game.playerIndex, 0);
  assert.equal(game.round, 1);
  assert.equal(game.phase, 'memorizing');
  assert.equal(game.status, 'playing');
  assert.equal(game.message, '1라운드 순서를 외우세요.');
});

test('starts input only after the player chooses to begin', () => {
  const game = createGame(['빨강', '파랑']);
  const next = startInput(game);

  assert.equal(next.phase, 'input');
  assert.equal(next.playerIndex, 0);
  assert.equal(next.message, '순서대로 색을 누르세요.');
});

test('hides the answer sequence during player input', () => {
  const memorizing = createGame(['빨강', '파랑', '노랑']);
  const input = startInput(memorizing);

  assert.equal(visibleSequenceText(memorizing), '빨강 → 파랑 → 노랑');
  assert.equal(visibleSequenceText(input), '순서를 숨겼습니다');
});

test('accepts a correct tile and adds a random next round after the sequence is completed', () => {
  const input = startInput(createGame(['빨강']));
  const next = chooseTile(input, '빨강', () => 0.8);

  assert.deepEqual(next.sequence, ['빨강', '초록']);
  assert.equal(next.playerIndex, 0);
  assert.equal(next.round, 2);
  assert.equal(next.phase, 'memorizing');
  assert.equal(next.status, 'playing');
  assert.equal(next.message, '2라운드 순서를 외우세요.');
});

test('tracks progress inside a longer hidden sequence', () => {
  const input = startInput(createGame(['빨강', '파랑', '노랑']));
  const next = chooseTile(input, '빨강');

  assert.deepEqual(next.sequence, ['빨강', '파랑', '노랑']);
  assert.equal(next.playerIndex, 1);
  assert.equal(next.round, 3);
  assert.equal(next.phase, 'input');
  assert.equal(next.status, 'playing');
  assert.equal(next.message, '좋아요. 2개 남았습니다.');
});

test('marks the game lost when the tile does not match the hidden sequence', () => {
  const input = startInput(createGame(['빨강', '파랑']));
  const next = chooseTile(input, '초록');

  assert.equal(next.status, 'lost');
  assert.equal(next.phase, 'input');
  assert.equal(next.playerIndex, 0);
  assert.equal(next.message, '틀렸습니다. 정답은 빨강입니다.');
});

test('wins after completing the target round', () => {
  const beforeLast = {
    sequence: ['빨강', '파랑', '노랑', '초록', '빨강'],
    playerIndex: 4,
    round: 5,
    phase: 'input',
    status: 'playing',
    message: '좋아요. 1개 남았습니다.',
  };

  const next = chooseTile(beforeLast, '빨강');

  assert.equal(next.status, 'won');
  assert.equal(next.round, 5);
  assert.equal(next.message, '성공! 5라운드를 외웠습니다.');
});

test('ignores invalid tiles, memorize phase input, and finished games', () => {
  const game = createGame(['빨강']);
  const input = startInput(game);
  const won = { ...input, status: 'won' };

  assert.deepEqual(chooseTile(input, '보라'), input);
  assert.deepEqual(chooseTile(game, '빨강'), game);
  assert.deepEqual(chooseTile(won, '빨강'), won);
});

test('formats sequence and remaining count for the Korean UI', () => {
  const game = createGame(['빨강', '파랑', '노랑']);

  assert.equal(sequenceText(game), '빨강 → 파랑 → 노랑');
  assert.equal(remainingCount(startInput(game)), 3);
  assert.equal(remainingCount({ ...startInput(game), playerIndex: 2 }), 1);
});
