const assert = require('node:assert/strict');
const {
  createGame,
  applyMove,
  getWinner,
  isBoardFull,
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

test('starts with an empty X turn game', () => {
  const game = createGame();

  assert.deepEqual(game.board, Array(9).fill(null));
  assert.equal(game.currentPlayer, 'X');
  assert.equal(game.status, 'playing');
});

test('places a mark and switches turns', () => {
  const game = applyMove(createGame(), 0);

  assert.equal(game.board[0], 'X');
  assert.equal(game.currentPlayer, 'O');
  assert.equal(game.status, 'playing');
});

test('rejects moves on occupied cells', () => {
  const firstMove = applyMove(createGame(), 0);
  const secondMove = applyMove(firstMove, 0);

  assert.deepEqual(secondMove, firstMove);
});

test('rejects moves outside whole-number board indexes', () => {
  const game = createGame();

  assert.deepEqual(applyMove(game, -1), game);
  assert.deepEqual(applyMove(game, 9), game);
  assert.deepEqual(applyMove(game, 1.5), game);
  assert.deepEqual(applyMove(game, NaN), game);
  assert.deepEqual(applyMove(game, 'x'), game);
});

test('detects a winning row', () => {
  const board = ['X', 'X', 'X', null, 'O', null, 'O', null, null];

  assert.equal(getWinner(board), 'X');
});

test('marks the game won after a winning move', () => {
  const game = [
    0, 3,
    1, 4,
    2,
  ].reduce((state, index) => applyMove(state, index), createGame());

  assert.equal(game.status, 'won');
  assert.equal(game.winner, 'X');
  assert.equal(game.currentPlayer, 'X');
});

test('marks the game drawn when the board fills without a winner', () => {
  const game = [
    0, 1,
    2, 4,
    3, 5,
    7, 6,
    8,
  ].reduce((state, index) => applyMove(state, index), createGame());

  assert.equal(isBoardFull(game.board), true);
  assert.equal(game.status, 'draw');
  assert.equal(game.winner, null);
});
