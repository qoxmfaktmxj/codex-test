const assert = require('assert');
const Hanoi = require('./game-logic');

function testCreateGameStacksDisksOnFirstPeg() {
  const game = Hanoi.createGame(4);

  assert.deepStrictEqual(game.pegs, [[4, 3, 2, 1], [], []]);
  assert.strictEqual(game.moves, 0);
  assert.strictEqual(game.status, '진행 중');
  assert.strictEqual(game.selectedPeg, null);
  assert.strictEqual(game.message, '옮길 원반이 있는 기둥을 고르세요.');
}

function testSelectPegChoosesMovableTopDisk() {
  const game = Hanoi.createGame(3);
  const selected = Hanoi.selectPeg(game, 0);

  assert.strictEqual(selected.selectedPeg, 0);
  assert.strictEqual(selected.message, '1번 기둥의 원반을 선택했습니다. 놓을 기둥을 고르세요.');
  assert.deepStrictEqual(game.pegs, [[3, 2, 1], [], []]);
}

function testMoveDiskMovesOnlyTopDisk() {
  const game = Hanoi.createGame(3);
  const selected = Hanoi.selectPeg(game, 0);
  const moved = Hanoi.moveDisk(selected, 2);

  assert.deepStrictEqual(moved.pegs, [[3, 2], [], [1]]);
  assert.strictEqual(moved.moves, 1);
  assert.strictEqual(moved.selectedPeg, null);
  assert.strictEqual(moved.message, '원반을 옮겼습니다. 다음 원반을 고르세요.');
}

function testMoveDiskRejectsLargerDiskOnSmallerDisk() {
  const game = {
    ...Hanoi.createGame(3),
    pegs: [[3], [2, 1], []],
    selectedPeg: 0,
  };

  const moved = Hanoi.moveDisk(game, 1);

  assert.deepStrictEqual(moved.pegs, [[3], [2, 1], []]);
  assert.strictEqual(moved.moves, 0);
  assert.strictEqual(moved.selectedPeg, 0);
  assert.strictEqual(moved.message, '큰 원반은 작은 원반 위에 놓을 수 없습니다.');
}

function testMoveDiskDetectsWin() {
  const game = {
    ...Hanoi.createGame(3),
    pegs: [[], [1], [3, 2]],
    moves: 6,
    selectedPeg: 1,
  };

  const moved = Hanoi.moveDisk(game, 2);

  assert.deepStrictEqual(moved.pegs, [[], [], [3, 2, 1]]);
  assert.strictEqual(moved.moves, 7);
  assert.strictEqual(moved.status, '승리');
  assert.strictEqual(moved.message, '성공입니다. 7번 만에 모든 원반을 옮겼습니다.');
}

function testInvalidDiskCountIsRejected() {
  assert.throws(
    () => Hanoi.createGame(1),
    /원반은 2개부터 6개까지 사용할 수 있습니다/,
  );
}

testCreateGameStacksDisksOnFirstPeg();
testSelectPegChoosesMovableTopDisk();
testMoveDiskMovesOnlyTopDisk();
testMoveDiskRejectsLargerDiskOnSmallerDisk();
testMoveDiskDetectsWin();
testInvalidDiskCountIsRejected();

console.log('하노이의 탑 로직 테스트 통과');
