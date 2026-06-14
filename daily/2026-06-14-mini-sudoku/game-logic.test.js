const assert = require('assert');
const {
  EMPTY,
  SIZE,
  createGame,
  getCellState,
  isComplete,
  isMoveValid,
  selectCell,
  setCellValue,
  clearCell,
  resetGame,
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

test('새 게임은 4x4 퍼즐과 고정 칸을 준비한다', () => {
  const game = createGame();
  assert.strictEqual(game.board.length, SIZE);
  assert.strictEqual(game.board[0].length, SIZE);
  assert.strictEqual(game.fixed[0][1], true);
  assert.strictEqual(game.board[0][0], EMPTY);
  assert.deepStrictEqual(game.selected, { row: 0, col: 0 });
  assert.strictEqual(game.status, '진행 중');
});

test('행, 열, 2x2 구역에 같은 숫자가 있으면 입력할 수 없다', () => {
  const game = createGame();
  assert.strictEqual(isMoveValid(game.board, 0, 0, 2), false);
  assert.strictEqual(isMoveValid(game.board, 0, 0, 3), false);
  assert.strictEqual(isMoveValid(game.board, 0, 0, 1), false);
  assert.strictEqual(isMoveValid(game.board, 0, 0, 4), true);
  assert.strictEqual(isMoveValid(game.board, 0, 3, 1), true);
});

test('고정 칸은 선택할 수 있지만 값을 바꿀 수 없다', () => {
  const selected = selectCell(createGame(), 0, 1);
  const game = setCellValue(selected, 4);
  assert.deepStrictEqual(game.selected, { row: 0, col: 1 });
  assert.strictEqual(game.board[0][1], 2);
  assert.strictEqual(game.message, '처음부터 놓인 숫자는 바꿀 수 없습니다.');
});

test('빈 칸에 올바른 숫자를 넣으면 보드가 갱신된다', () => {
  const game = setCellValue(createGame(), 4);
  assert.strictEqual(game.board[0][0], 4);
  assert.strictEqual(game.moves, 1);
  assert.strictEqual(game.errors, 0);
  assert.strictEqual(game.message, '좋습니다. 다음 빈칸을 채워 보세요.');
});

test('잘못된 숫자를 넣으면 오류가 늘고 칸은 비어 있다', () => {
  const game = setCellValue(createGame(), 2);
  assert.strictEqual(game.board[0][0], EMPTY);
  assert.strictEqual(game.moves, 0);
  assert.strictEqual(game.errors, 1);
  assert.strictEqual(game.message, '그 숫자는 행, 열, 구역 중 하나와 겹칩니다.');
});

test('입력한 칸만 지울 수 있다', () => {
  const filled = setCellValue(createGame(), 4);
  const cleared = clearCell(filled);
  assert.strictEqual(cleared.board[0][0], EMPTY);
  assert.strictEqual(cleared.moves, 2);
  assert.strictEqual(cleared.message, '칸을 비웠습니다.');
});

test('모든 칸이 해답과 일치하면 게임이 완료된다', () => {
  const game = createGame({
    board: [
      [4, 2, 1, 3],
      [1, 3, 4, 2],
      [3, 4, 2, 1],
      [2, 1, 3, EMPTY],
    ],
    selected: { row: 3, col: 3 },
  });
  const finished = setCellValue(game, 4);
  assert.strictEqual(isComplete(finished.board), true);
  assert.strictEqual(finished.status, '완료');
  assert.strictEqual(finished.message, '완성했습니다. 모든 숫자가 제자리에 있습니다!');
});

test('겹침 없는 다른 완성판도 완료로 인정한다', () => {
  assert.strictEqual(isComplete([
    [1, 2, 3, 4],
    [3, 4, 1, 2],
    [2, 1, 4, 3],
    [4, 3, 2, 1],
  ]), true);
});

test('칸 상태는 고정, 선택, 오류 여부를 알려준다', () => {
  const invalid = setCellValue(createGame(), 2);
  assert.deepStrictEqual(getCellState(invalid, 0, 0), {
    value: EMPTY,
    fixed: false,
    selected: true,
    conflicted: true,
  });
});

test('새로 시작하면 처음 퍼즐로 돌아간다', () => {
  const changed = setCellValue(createGame(), 4);
  assert.deepStrictEqual(resetGame(), createGame());
  assert.notDeepStrictEqual(changed.board, resetGame().board);
});
