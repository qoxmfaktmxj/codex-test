const assert = require('node:assert/strict');
const {
  CHOICES,
  createGame,
  playRound,
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

test('starts with zero scores and no round result', () => {
  const game = createGame();

  assert.deepEqual(game, {
    score: { player: 0, computer: 0 },
    playerChoice: null,
    computerChoice: null,
    result: null,
  });
});

test('keeps score unchanged when both choices match', () => {
  const game = playRound(createGame(), 'rock', () => 'rock');

  assert.equal(game.result, 'draw');
  assert.deepEqual(game.score, { player: 0, computer: 0 });
});

test('adds one player point when player choice beats computer choice', () => {
  const game = playRound(createGame(), 'paper', () => 'rock');

  assert.equal(game.result, 'win');
  assert.deepEqual(game.score, { player: 1, computer: 0 });
});

test('adds one computer point when computer choice beats player choice', () => {
  const game = playRound(createGame(), 'scissors', () => 'rock');

  assert.equal(game.result, 'lose');
  assert.deepEqual(game.score, { player: 0, computer: 1 });
});

test('rejects moves outside the choice set', () => {
  const game = createGame();

  assert.deepEqual(playRound(game, 'lizard', () => 'rock'), game);
  assert.deepEqual(CHOICES, ['rock', 'paper', 'scissors']);
});
