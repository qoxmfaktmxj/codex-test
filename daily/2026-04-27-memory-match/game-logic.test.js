const assert = require('node:assert/strict');
const {
  createGame,
  flipCard,
  hideUnmatched,
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

test('starts with all cards face down', () => {
  const game = createGame(['A', 'B', 'A', 'B']);

  assert.equal(game.cards.length, 4);
  assert.deepEqual(
    game.cards.map((card) => ({
      value: card.value,
      isFaceUp: card.isFaceUp,
      isMatched: card.isMatched,
    })),
    [
      { value: 'A', isFaceUp: false, isMatched: false },
      { value: 'B', isFaceUp: false, isMatched: false },
      { value: 'A', isFaceUp: false, isMatched: false },
      { value: 'B', isFaceUp: false, isMatched: false },
    ],
  );
  assert.deepEqual(game.flippedIds, []);
  assert.equal(game.moves, 0);
  assert.equal(game.status, 'playing');
});

test('flips one card without counting a move', () => {
  const game = flipCard(createGame(['A', 'B', 'A', 'B']), 0);

  assert.equal(game.cards[0].isFaceUp, true);
  assert.deepEqual(game.flippedIds, [0]);
  assert.equal(game.moves, 0);
});

test('matches a pair and counts one move', () => {
  const first = flipCard(createGame(['A', 'B', 'A', 'B']), 0);
  const second = flipCard(first, 2);

  assert.equal(second.cards[0].isMatched, true);
  assert.equal(second.cards[2].isMatched, true);
  assert.deepEqual(second.flippedIds, []);
  assert.equal(second.moves, 1);
  assert.equal(second.status, 'playing');
});

test('keeps an unmatched pair visible until hidden', () => {
  const first = flipCard(createGame(['A', 'B', 'A', 'B']), 0);
  const second = flipCard(first, 1);

  assert.equal(second.cards[0].isFaceUp, true);
  assert.equal(second.cards[1].isFaceUp, true);
  assert.deepEqual(second.flippedIds, [0, 1]);
  assert.equal(second.moves, 1);

  const hidden = hideUnmatched(second);
  assert.equal(hidden.cards[0].isFaceUp, false);
  assert.equal(hidden.cards[1].isFaceUp, false);
  assert.deepEqual(hidden.flippedIds, []);
});

test('rejects invalid flips and a third flip before hiding unmatched cards', () => {
  const game = createGame(['A', 'B', 'A', 'B']);
  assert.deepEqual(flipCard(game, -1), game);
  assert.deepEqual(flipCard(game, 4), game);

  const waiting = flipCard(flipCard(game, 0), 1);
  assert.deepEqual(flipCard(waiting, 2), waiting);

  const matched = flipCard(flipCard(game, 0), 2);
  assert.deepEqual(flipCard(matched, 0), matched);
});

test('marks the game won after all pairs are matched', () => {
  const game = [
    (state) => flipCard(state, 0),
    (state) => flipCard(state, 2),
    (state) => flipCard(state, 1),
    (state) => flipCard(state, 3),
  ].reduce((state, step) => step(state), createGame(['A', 'B', 'A', 'B']));

  assert.equal(game.status, 'won');
  assert.equal(game.moves, 2);
});
