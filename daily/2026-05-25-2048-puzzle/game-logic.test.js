const assert = require('assert');
const {
  SIZE,
  createEmptyBoard,
  createGame,
  slideLineLeft,
  moveBoard,
  hasAvailableMoves,
  scoreText,
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

test('빈 판은 4x4 크기로 만들어진다', () => {
  const board = createEmptyBoard();
  assert.strictEqual(board.length, SIZE);
  assert.strictEqual(board[0].length, SIZE);
  assert.strictEqual(board.flat().every((cell) => cell === 0), true);
});

test('새 게임은 지정한 난수 위치에 숫자 두 개를 놓고 시작한다', () => {
  const game = createGame([0, 0]);
  assert.deepStrictEqual(game.board.flat().filter(Boolean), [2, 2]);
  assert.strictEqual(game.score, 0);
  assert.strictEqual(game.status, 'playing');
});

test('한 줄을 왼쪽으로 밀 때 같은 숫자는 한 번만 합쳐진다', () => {
  assert.deepStrictEqual(slideLineLeft([2, 0, 2, 4]), { line: [4, 4, 0, 0], gained: 4, changed: true });
  assert.deepStrictEqual(slideLineLeft([2, 2, 2, 2]), { line: [4, 4, 0, 0], gained: 8, changed: true });
  assert.deepStrictEqual(slideLineLeft([4, 4, 8, 0]), { line: [8, 8, 0, 0], gained: 8, changed: true });
});

test('왼쪽 이동은 모든 행을 압축하고 점수를 더한다', () => {
  const board = [
    [2, 0, 2, 0],
    [4, 4, 0, 0],
    [2, 2, 2, 0],
    [0, 0, 0, 0],
  ];
  const result = moveBoard(board, 'left');
  assert.deepStrictEqual(result.board, [
    [4, 0, 0, 0],
    [8, 0, 0, 0],
    [4, 2, 0, 0],
    [0, 0, 0, 0],
  ]);
  assert.strictEqual(result.gained, 16);
  assert.strictEqual(result.changed, true);
});

test('상하좌우 이동을 모두 지원한다', () => {
  const board = [
    [2, 0, 0, 2],
    [2, 0, 0, 2],
    [4, 0, 4, 0],
    [0, 0, 4, 0],
  ];
  assert.deepStrictEqual(moveBoard(board, 'up').board, [
    [4, 0, 8, 4],
    [4, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ]);
  assert.deepStrictEqual(moveBoard(board, 'right').board[0], [0, 0, 0, 4]);
  assert.deepStrictEqual(moveBoard(board, 'down').board[3], [4, 0, 8, 4]);
});

test('빈칸이나 합칠 수 있는 이웃이 있으면 계속 진행할 수 있다', () => {
  assert.strictEqual(hasAvailableMoves([
    [2, 4, 8, 16],
    [32, 64, 128, 256],
    [512, 1024, 2, 4],
    [8, 16, 32, 64],
  ]), false);
  assert.strictEqual(hasAvailableMoves([
    [2, 4, 8, 16],
    [32, 64, 128, 256],
    [512, 1024, 2, 4],
    [8, 16, 32, 32],
  ]), true);
  assert.strictEqual(scoreText({ score: 128, best: 256 }), '점수 128 · 최고 256');
});
