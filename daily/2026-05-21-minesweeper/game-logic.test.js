const assert = require('assert');
const {
  BOARD_SIZE,
  MINE_COUNT,
  createGame,
  revealCell,
  toggleFlag,
  cellIndex,
  neighborIndexes,
  countNeighborMines,
  remainingSafeCells,
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

test('새 게임은 8x8 판에 지뢰 10개를 숨긴다', () => {
  const game = createGame();
  assert.strictEqual(BOARD_SIZE, 8);
  assert.strictEqual(MINE_COUNT, 10);
  assert.strictEqual(game.cells.length, 64);
  assert.strictEqual(game.cells.filter((cell) => cell.hasMine).length, 10);
  assert.strictEqual(game.status, '진행 중');
  assert.strictEqual(game.message, '칸을 열어 지뢰를 피하세요.');
});

test('좌표는 한 줄 인덱스로 바뀌고 이웃 칸은 모서리를 넘지 않는다', () => {
  assert.strictEqual(cellIndex(2, 3), 26);
  assert.deepStrictEqual(neighborIndexes(0).sort((a, b) => a - b), [1, 8, 9]);
  assert.deepStrictEqual(neighborIndexes(63).sort((a, b) => a - b), [54, 55, 62]);
});

test('주변 지뢰 수를 정확히 계산한다', () => {
  const game = createGame({ mines: [0, 1, 9, 63] });
  assert.strictEqual(countNeighborMines(game, 10), 2);
  assert.strictEqual(countNeighborMines(game, 62), 1);
});

test('빈 칸을 열면 연결된 안전 칸이 함께 열린다', () => {
  const game = createGame({ mines: [63] });
  const revealed = revealCell(game, 0);
  assert.strictEqual(revealed.status, '승리');
  assert.strictEqual(remainingSafeCells(revealed), 0);
  assert.ok(revealed.cells[0].isRevealed);
  assert.ok(revealed.cells[62].isRevealed);
  assert.strictEqual(revealed.cells[63].isRevealed, false);
});

test('숫자 칸을 열면 해당 칸만 열린다', () => {
  const game = createGame({ mines: [0, 63] });
  const revealed = revealCell(game, 1);
  assert.strictEqual(revealed.cells[1].isRevealed, true);
  assert.strictEqual(revealed.cells[2].isRevealed, false);
  assert.strictEqual(revealed.status, '진행 중');
});

test('지뢰를 열면 모든 지뢰가 보이고 게임이 끝난다', () => {
  const game = createGame({ mines: [5, 10] });
  const lost = revealCell(game, 5);
  assert.strictEqual(lost.status, '게임 종료');
  assert.strictEqual(lost.message, '지뢰를 밟았습니다. 다시 도전하세요.');
  assert.strictEqual(lost.cells[5].isRevealed, true);
  assert.strictEqual(lost.cells[10].isRevealed, true);
});

test('깃발은 닫힌 칸에서만 켜고 끌 수 있다', () => {
  const game = createGame({ mines: [5] });
  const flagged = toggleFlag(game, 5);
  assert.strictEqual(flagged.cells[5].isFlagged, true);
  assert.strictEqual(flagged.message, '깃발을 표시했습니다.');
  const unflagged = toggleFlag(flagged, 5);
  assert.strictEqual(unflagged.cells[5].isFlagged, false);
  const revealed = revealCell(unflagged, 0);
  const ignored = toggleFlag(revealed, 0);
  assert.deepStrictEqual(ignored, revealed);
});

test('깃발 칸과 끝난 게임은 열리지 않는다', () => {
  const game = toggleFlag(createGame({ mines: [5] }), 0);
  assert.deepStrictEqual(revealCell(game, 0), game);
  const lost = revealCell(createGame({ mines: [5] }), 5);
  assert.deepStrictEqual(revealCell(lost, 1), lost);
});
