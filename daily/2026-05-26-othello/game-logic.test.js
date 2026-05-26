const assert = require('assert');
const {
  SIZE,
  PLAYERS,
  createGame,
  getFlipsForMove,
  getValidMoves,
  placeDisc,
  countDiscs,
  statusText,
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

test('새 오셀로 게임은 8x8 기본 배치와 흑돌 차례로 시작한다', () => {
  const game = createGame();
  assert.strictEqual(game.board.length, SIZE);
  assert.strictEqual(game.board[0].length, SIZE);
  assert.strictEqual(game.currentPlayer, PLAYERS.BLACK);
  assert.strictEqual(game.status, 'playing');
  assert.strictEqual(game.board[3][3], PLAYERS.WHITE);
  assert.strictEqual(game.board[3][4], PLAYERS.BLACK);
  assert.strictEqual(game.board[4][3], PLAYERS.BLACK);
  assert.strictEqual(game.board[4][4], PLAYERS.WHITE);
  assert.deepStrictEqual(countDiscs(game.board), { black: 2, white: 2, empty: 60 });
  assert.strictEqual(statusText(game), '흑돌 차례입니다.');
});

test('초기 흑돌의 합법 수 네 곳과 뒤집힐 돌을 계산한다', () => {
  const game = createGame();
  assert.deepStrictEqual(getValidMoves(game.board, PLAYERS.BLACK), [
    [2, 3],
    [3, 2],
    [4, 5],
    [5, 4],
  ]);
  assert.deepStrictEqual(getFlipsForMove(game.board, 2, 3, PLAYERS.BLACK), [[3, 3]]);
  assert.deepStrictEqual(getFlipsForMove(game.board, 0, 0, PLAYERS.BLACK), []);
});

test('돌을 놓으면 상대 돌을 뒤집고 차례가 바뀐다', () => {
  const game = placeDisc(createGame(), 2, 3);
  assert.strictEqual(game.board[2][3], PLAYERS.BLACK);
  assert.strictEqual(game.board[3][3], PLAYERS.BLACK);
  assert.strictEqual(game.currentPlayer, PLAYERS.WHITE);
  assert.strictEqual(game.status, 'playing');
  assert.deepStrictEqual(countDiscs(game.board), { black: 4, white: 1, empty: 59 });
});

test('합법 수가 아닌 칸에는 돌을 놓을 수 없다', () => {
  assert.throws(() => placeDisc(createGame(), 0, 0), /놓을 수 없는 칸/);
  assert.throws(() => placeDisc(createGame(), 3, 3), /이미 돌/);
});

test('상대가 둘 곳이 없으면 차례를 건너뛴다', () => {
  const board = Array.from({ length: SIZE }, () => Array(SIZE).fill(PLAYERS.BLACK));
  board[0][0] = null;
  board[0][1] = PLAYERS.WHITE;
  board[0][2] = PLAYERS.BLACK;
  board[7][7] = null;
  board[7][6] = PLAYERS.WHITE;
  board[7][5] = PLAYERS.BLACK;
  const game = createGame({ board, currentPlayer: PLAYERS.BLACK });
  const next = placeDisc(game, 0, 0);
  assert.strictEqual(next.board[0][1], PLAYERS.BLACK);
  assert.strictEqual(next.currentPlayer, PLAYERS.BLACK);
  assert.strictEqual(next.status, 'playing');
  assert.strictEqual(next.message, '백돌이 둘 곳이 없어 흑돌이 한 번 더 둡니다.');
});

test('양쪽 모두 둘 곳이 없으면 더 많은 돌을 가진 쪽이 승리한다', () => {
  const board = Array.from({ length: SIZE }, () => Array(SIZE).fill(PLAYERS.BLACK));
  board[0][0] = null;
  board[0][1] = PLAYERS.WHITE;
  board[0][2] = PLAYERS.BLACK;
  const game = placeDisc(createGame({ board, currentPlayer: PLAYERS.BLACK }), 0, 0);
  assert.strictEqual(game.status, 'won');
  assert.strictEqual(game.winner, PLAYERS.BLACK);
  assert.strictEqual(statusText(game), '흑돌 승리! 64 대 0입니다.');
});
