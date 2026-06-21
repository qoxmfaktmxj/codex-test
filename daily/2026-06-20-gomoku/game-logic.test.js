const assert = require('assert');
const {
  BOARD_SIZE,
  createGame,
  getCell,
  getWinner,
  isBoardFull,
  placeStone,
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

test('새 오목판은 9x9 빈 칸과 흑 차례로 시작한다', () => {
  const game = createGame();
  assert.strictEqual(game.board.length, BOARD_SIZE);
  assert.strictEqual(game.board[0].length, BOARD_SIZE);
  assert.strictEqual(game.currentPlayer, '흑');
  assert.strictEqual(game.status, '진행 중');
  assert.strictEqual(game.message, '흑돌 차례입니다.');
  assert.strictEqual(game.board.flat().every((cell) => cell === null), true);
});

test('빈 칸에 돌을 놓으면 원본을 바꾸지 않고 차례를 넘긴다', () => {
  const game = createGame();
  const next = placeStone(game, 4, 4);
  assert.strictEqual(getCell(game.board, 4, 4), null);
  assert.strictEqual(getCell(next.board, 4, 4), '흑');
  assert.strictEqual(next.currentPlayer, '백');
  assert.strictEqual(next.message, '백돌 차례입니다.');
});

test('이미 놓인 칸에는 다시 둘 수 없다', () => {
  const game = placeStone(createGame(), 2, 2);
  const next = placeStone(game, 2, 2);
  assert.notStrictEqual(next, game);
  assert.strictEqual(next.message, '그 칸에는 둘 수 없습니다.');
  assert.strictEqual(getCell(next.board, 2, 2), '흑');
  assert.strictEqual(game.message, '백돌 차례입니다.');
  assert.strictEqual(next.currentPlayer, '백');
});

test('가로 다섯 돌을 만들면 승리한다', () => {
  let game = createGame();
  game = placeStone(game, 0, 0);
  game = placeStone(game, 1, 0);
  game = placeStone(game, 0, 1);
  game = placeStone(game, 1, 1);
  game = placeStone(game, 0, 2);
  game = placeStone(game, 1, 2);
  game = placeStone(game, 0, 3);
  game = placeStone(game, 1, 3);
  game = placeStone(game, 0, 4);
  assert.strictEqual(getWinner(game.board), '흑');
  assert.strictEqual(game.status, '승리');
  assert.strictEqual(game.winner, '흑');
  assert.strictEqual(game.message, '흑돌이 오목을 완성했습니다!');
});

test('대각선 다섯 돌도 승리로 판정한다', () => {
  const board = [
    ['백', null, null, null, null, null, null, null, null],
    [null, '백', null, null, null, null, null, null, null],
    [null, null, '백', null, null, null, null, null, null],
    [null, null, null, '백', null, null, null, null, null],
    [null, null, null, null, '백', null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null],
  ];
  assert.strictEqual(getWinner(board), '백');
});

test('가득 찬 판에 승자가 없으면 무승부가 된다', () => {
  const board = [
    ['백', '흑', '흑', '백', '백', '백', '백', '흑', '흑'],
    ['흑', '백', '흑', '흑', '흑', '흑', '백', '백', '흑'],
    ['백', '백', '백', '흑', '백', '흑', '흑', '흑', '백'],
    ['흑', '백', '흑', '백', '백', '백', '흑', '흑', '백'],
    ['백', '흑', '백', '백', null, '흑', '백', '백', '흑'],
    ['백', '흑', '흑', '흑', '백', '흑', '백', '흑', '흑'],
    ['흑', '백', '백', '백', '흑', '백', '흑', '백', '백'],
    ['흑', '흑', '백', '흑', '흑', '백', '백', '백', '흑'],
    ['흑', '백', '흑', '백', '흑', '백', '백', '흑', '흑'],
  ];
  const game = createGame({ board, currentPlayer: '흑' });
  const next = placeStone(game, 4, 4);
  assert.strictEqual(isBoardFull(next.board), true);
  assert.strictEqual(next.status, '무승부');
  assert.strictEqual(next.message, '빈 칸이 없어 무승부입니다.');
});

test('초기화하면 새 게임으로 돌아간다', () => {
  const game = placeStone(createGame(), 3, 3);
  const reset = resetGame(game);
  assert.strictEqual(getCell(reset.board, 3, 3), null);
  assert.strictEqual(reset.currentPlayer, '흑');
  assert.strictEqual(reset.status, '진행 중');
});
