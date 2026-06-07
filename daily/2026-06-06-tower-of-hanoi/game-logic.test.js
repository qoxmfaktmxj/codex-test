const assert = require('assert');
const {
  createGame,
  canMove,
  moveDisk,
  availableMoves,
  isSolved,
  moveCountText,
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

test('새 게임은 모든 원반이 첫 번째 기둥에 큰 원반부터 놓인다', () => {
  const game = createGame(4);
  assert.deepStrictEqual(game.pegs, [[4, 3, 2, 1], [], []]);
  assert.strictEqual(game.moves, 0);
  assert.strictEqual(game.status, 'playing');
  assert.strictEqual(game.selectedPeg, null);
});

test('빈 기둥에서 원반을 옮길 수 없다', () => {
  const game = createGame(3);
  assert.strictEqual(canMove(game, 1, 2), false);
});

test('작은 원반 위에 큰 원반을 올릴 수 없다', () => {
  const game = createGame(3);
  const afterFirst = moveDisk(game, 0, 1);
  assert.strictEqual(canMove(afterFirst, 0, 1), false);
  assert.throws(() => moveDisk(afterFirst, 0, 1), /큰 원반/);
});

test('합법 이동은 원반 위치와 이동 수를 갱신한다', () => {
  const game = createGame(3);
  const next = moveDisk(game, 0, 2);
  assert.deepStrictEqual(next.pegs, [[3, 2], [], [1]]);
  assert.strictEqual(next.moves, 1);
  assert.strictEqual(next.message, '1번 원반을 3번 기둥으로 옮겼습니다.');
  assert.deepStrictEqual(game.pegs, [[3, 2, 1], [], []]);
});

test('가능한 이동 목록은 현재 상태의 합법 이동만 담는다', () => {
  const game = moveDisk(createGame(3), 0, 2);
  assert.deepStrictEqual(availableMoves(game), [
    { from: 0, to: 1 },
    { from: 2, to: 0 },
    { from: 2, to: 1 },
  ]);
});

test('마지막 기둥에 모든 원반을 옮기면 승리한다', () => {
  let game = createGame(3);
  game = moveDisk(game, 0, 2);
  game = moveDisk(game, 0, 1);
  game = moveDisk(game, 2, 1);
  game = moveDisk(game, 0, 2);
  game = moveDisk(game, 1, 0);
  game = moveDisk(game, 1, 2);
  game = moveDisk(game, 0, 2);

  assert.strictEqual(isSolved(game), true);
  assert.strictEqual(game.status, 'won');
  assert.strictEqual(game.message, '성공! 7번 만에 모든 원반을 옮겼습니다.');
  assert.strictEqual(moveCountText(game), '이동 7회 · 최소 7회');
});
