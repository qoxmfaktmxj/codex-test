const assert = require('assert');
const {
  DEFAULT_PILES,
  createGame,
  takeStones,
  isValidMove,
  availableMoves,
} = require('./game-logic');

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}`);
    throw error;
  }
}

test('새 게임은 세 더미와 첫 번째 차례를 준비한다', () => {
  const game = createGame();
  assert.deepStrictEqual(game.piles, DEFAULT_PILES);
  assert.strictEqual(game.currentPlayer, '나');
  assert.strictEqual(game.status, '진행 중');
  assert.strictEqual(game.message, '돌을 가져갈 더미와 개수를 고르세요.');
});

test('한 차례에는 한 더미에서 가능한 개수만 가져갈 수 있다', () => {
  const game = createGame({ piles: [1, 3, 5] });
  assert.strictEqual(isValidMove(game, 1, 2), true);
  assert.strictEqual(isValidMove(game, 1, 4), false);
  assert.strictEqual(isValidMove(game, -1, 1), false);
  assert.strictEqual(isValidMove(game, 0, 0), false);
});

test('돌을 가져가면 더미가 줄고 차례가 바뀐다', () => {
  const game = takeStones(createGame({ piles: [1, 3, 5] }), 2, 4);
  assert.deepStrictEqual(game.piles, [1, 3, 1]);
  assert.strictEqual(game.currentPlayer, '상대');
  assert.strictEqual(game.status, '진행 중');
  assert.strictEqual(game.message, '상대 차례입니다.');
});

test('마지막 돌을 가져간 사람이 승리한다', () => {
  const game = takeStones(createGame({ piles: [0, 0, 2], currentPlayer: '상대' }), 2, 2);
  assert.deepStrictEqual(game.piles, [0, 0, 0]);
  assert.strictEqual(game.status, '승리');
  assert.strictEqual(game.winner, '상대');
  assert.strictEqual(game.message, '상대가 마지막 돌을 가져가 이겼습니다.');
});

test('끝난 게임이나 잘못된 수는 상태를 바꾸지 않는다', () => {
  const ended = createGame({ piles: [0, 0, 0], status: '승리', winner: '나' });
  const invalid = createGame({ piles: [1, 2, 3] });
  assert.deepStrictEqual(takeStones(ended, 0, 1), ended);
  assert.deepStrictEqual(takeStones(invalid, 1, 3), invalid);
});

test('가능한 수 목록은 남은 돌 기준으로 만든다', () => {
  const moves = availableMoves(createGame({ piles: [0, 2, 1] }));
  assert.deepStrictEqual(moves, [
    { pileIndex: 1, count: 1 },
    { pileIndex: 1, count: 2 },
    { pileIndex: 2, count: 1 },
  ]);
});
