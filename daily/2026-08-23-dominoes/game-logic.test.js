const assert = require('assert');
const Dominoes = require('./game-logic');

function tile(left, right) {
  return { left, right };
}

function testPlacesTilesAtEitherOpenEnd() {
  const state = Dominoes.createState({
    hands: [[tile(6, 3), tile(1, 5)], [tile(2, 4)]],
    drawPile: [tile(0, 0)],
    board: [tile(3, 5)],
    turn: 0,
    passes: 0,
  });
  const left = Dominoes.playTile(state, 0, 0, 'left');
  assert.deepStrictEqual(left.board, [tile(6, 3), tile(3, 5)]);
  assert.strictEqual(left.turn, 1);

  const right = Dominoes.playTile(state, 0, 1, 'right');
  assert.deepStrictEqual(right.board, [tile(3, 5), tile(5, 1)]);
  assert.strictEqual(right.hands[0].length, 1);
}

function testRejectsUnmatchedTileAndSupportsDouble() {
  const state = Dominoes.createState({
    hands: [[tile(2, 4), tile(5, 5)], [tile(1, 1)]],
    drawPile: [],
    board: [tile(5, 3)],
    turn: 0,
    passes: 0,
  });
  assert.throws(() => Dominoes.playTile(state, 0, 0, 'left'), /놓을 수 없는/);
  const next = Dominoes.playTile(state, 0, 1, 'left');
  assert.deepStrictEqual(next.board[0], tile(5, 5));
}

function testDrawsOneTileAndEndsAfterTwoPasses() {
  const drawing = Dominoes.createState({
    hands: [[tile(1, 2)], [tile(3, 3)]],
    drawPile: [tile(4, 5), tile(0, 6)],
    board: [tile(6, 6)],
    turn: 0,
    passes: 0,
  });
  const drawn = Dominoes.drawTile(drawing, 0);
  assert.deepStrictEqual(drawn.hands[0].at(-1), tile(0, 6));
  assert.strictEqual(drawn.turn, 1);

  const playable = Dominoes.createState({
    hands: [[tile(6, 1)], [tile(3, 3)]],
    drawPile: [tile(4, 5)],
    board: [tile(6, 6)],
    turn: 0,
    passes: 0,
  });
  assert.throws(() => Dominoes.drawTile(playable, 0), /놓을 수 있는/);

  const blocked = Dominoes.createState({
    hands: [[tile(1, 2)], [tile(3, 4)]],
    drawPile: [],
    board: [tile(6, 6)],
    turn: 0,
    passes: 0,
  });
  const once = Dominoes.passTurn(blocked, 0);
  const twice = Dominoes.passTurn(once, 1);
  assert.strictEqual(Dominoes.getStatus(twice), 'blocked');
  assert.strictEqual(Dominoes.scoreHand(twice.hands[0]), 3);
}

function testDetectsEmptyHandWinnerAndFindsPlayableTiles() {
  const state = Dominoes.createState({
    hands: [[], [tile(2, 2)]],
    drawPile: [],
    board: [tile(2, 4)],
    turn: 1,
    passes: 0,
  });
  assert.strictEqual(Dominoes.getStatus(state), 'player-won');

  const playable = Dominoes.playableMoves(Dominoes.createState({
    hands: [[tile(2, 1), tile(3, 4), tile(5, 2)], [tile(0, 0)]],
    drawPile: [],
    board: [tile(2, 3)],
    turn: 0,
    passes: 0,
  }), 0);
  assert.deepStrictEqual(playable, [{ index: 0, ends: ['left'] }, { index: 1, ends: ['right'] }, { index: 2, ends: ['left'] }]);
}

testPlacesTilesAtEitherOpenEnd();
testRejectsUnmatchedTileAndSupportsDouble();
testDrawsOneTileAndEndsAfterTwoPasses();
testDetectsEmptyHandWinnerAndFindsPlayableTiles();

console.log('도미노 로직 테스트 통과');
