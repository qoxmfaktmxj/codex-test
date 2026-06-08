const assert = require('assert');
const {
  createGame,
  getValidMoves,
  makeMove,
  selectHole,
  boardSummary,
  resultText,
  CELL,
  STATUS,
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

test('새 게임은 중앙 구멍만 비운 십자형 판을 만든다', () => {
  const game = createGame();

  assert.strictEqual(game.board.length, 7);
  assert.strictEqual(game.board[0][0], CELL.BLOCKED);
  assert.strictEqual(game.board[3][3], CELL.EMPTY);
  assert.strictEqual(game.pegsLeft, 32);
  assert.strictEqual(game.moves, 0);
  assert.strictEqual(game.status, STATUS.PLAYING);
  assert.strictEqual(game.message, '말을 하나 건너 빈칸으로 뛰어넘으세요.');
});

test('처음에는 중앙으로 뛰어드는 네 가지 이동만 가능하다', () => {
  const moves = getValidMoves(createGame());

  assert.strictEqual(moves.length, 4);
  assert.deepStrictEqual(
    moves.map((move) => `${move.from.row},${move.from.col}->${move.to.row},${move.to.col}`).sort(),
    ['1,3->3,3', '3,1->3,3', '3,5->3,3', '5,3->3,3'],
  );
});

test('유효한 이동은 출발 말과 건넌 말을 비우고 도착 칸에 말을 둔다', () => {
  const game = createGame();
  const next = makeMove(game, { row: 1, col: 3 }, { row: 3, col: 3 });

  assert.strictEqual(next.board[1][3], CELL.EMPTY);
  assert.strictEqual(next.board[2][3], CELL.EMPTY);
  assert.strictEqual(next.board[3][3], CELL.PEG);
  assert.strictEqual(next.pegsLeft, 31);
  assert.strictEqual(next.moves, 1);
  assert.strictEqual(next.status, STATUS.PLAYING);
});

test('규칙에 맞지 않는 이동은 판을 바꾸지 않고 안내 문구를 보여준다', () => {
  const game = createGame();
  const next = makeMove(game, { row: 0, col: 3 }, { row: 3, col: 3 });

  assert.notStrictEqual(next, game);
  assert.deepStrictEqual(next.board, game.board);
  assert.strictEqual(next.pegsLeft, 32);
  assert.strictEqual(next.message, '말 하나를 정확히 건너 빈칸으로 이동해야 합니다.');
});

test('첫 선택 뒤 같은 말을 다시 누르면 선택이 취소된다', () => {
  const game = selectHole(createGame(), { row: 1, col: 3 });
  const next = selectHole(game, { row: 1, col: 3 });

  assert.strictEqual(game.selected.row, 1);
  assert.strictEqual(next.selected, null);
  assert.strictEqual(next.message, '선택을 취소했습니다.');
});

test('이동할 수 없는 판은 남은 말 수에 따라 성공과 실패를 판정한다', () => {
  const won = {
    ...createGame(),
    board: Array.from({ length: 7 }, () => Array(7).fill(CELL.BLOCKED)),
    pegsLeft: 1,
  };
  won.board[3][3] = CELL.PEG;

  const lost = {
    ...won,
    board: won.board.map((row) => row.slice()),
    pegsLeft: 2,
  };
  lost.board[3][4] = CELL.PEG;

  assert.strictEqual(makeMove(won, { row: 0, col: 0 }, { row: 0, col: 0 }).status, STATUS.WON);
  assert.strictEqual(makeMove(lost, { row: 0, col: 0 }, { row: 0, col: 0 }).status, STATUS.LOST);
});

test('요약 문구는 한국어로 남은 말과 이동 횟수를 설명한다', () => {
  const game = createGame();

  assert.strictEqual(boardSummary(game), '남은 말 32개 · 이동 0회');
  assert.strictEqual(resultText(game), '진행 중 · 가능한 이동 4개');
  assert.strictEqual(resultText({ ...game, status: STATUS.WON, pegsLeft: 1 }), '성공 · 마지막 말 1개');
  assert.strictEqual(resultText({ ...game, status: STATUS.LOST }), '종료 · 더 움직일 수 없습니다');
});
