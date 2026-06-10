const assert = require('assert');
const {
  ROWS,
  COLUMNS,
  PLAYERS,
  createGame,
  dropDisc,
  getAvailableRow,
  checkWinner,
  isBoardFull,
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

function withMoves(moves) {
  return moves.reduce((game, column) => dropDisc(game, column), createGame());
}

test('새 게임은 6행 7열 빈 판과 노란 말 차례로 시작한다', () => {
  const game = createGame();
  assert.strictEqual(game.board.length, ROWS);
  assert.strictEqual(game.board[0].length, COLUMNS);
  assert.strictEqual(game.currentPlayer, PLAYERS.YELLOW);
  assert.strictEqual(game.status, 'playing');
  assert.strictEqual(game.winner, null);
  assert.strictEqual(game.board.flat().every((cell) => cell === null), true);
  assert.strictEqual(statusText(game), '노란 말 차례입니다.');
});

test('말은 선택한 열의 가장 아래 빈칸에 놓이고 차례가 바뀐다', () => {
  const first = dropDisc(createGame(), 3);
  assert.strictEqual(first.board[ROWS - 1][3], PLAYERS.YELLOW);
  assert.strictEqual(first.currentPlayer, PLAYERS.RED);
  assert.strictEqual(getAvailableRow(first.board, 3), ROWS - 2);

  const second = dropDisc(first, 3);
  assert.strictEqual(second.board[ROWS - 2][3], PLAYERS.RED);
  assert.strictEqual(second.currentPlayer, PLAYERS.YELLOW);
});

test('가로 네 줄을 만들면 승리한다', () => {
  const game = withMoves([0, 0, 1, 1, 2, 2, 3]);
  assert.strictEqual(game.status, 'won');
  assert.strictEqual(game.winner, PLAYERS.YELLOW);
  assert.deepStrictEqual(checkWinner(game.board), {
    player: PLAYERS.YELLOW,
    cells: [
      [ROWS - 1, 0],
      [ROWS - 1, 1],
      [ROWS - 1, 2],
      [ROWS - 1, 3],
    ],
  });
  assert.strictEqual(statusText(game), '노란 말이 네 줄을 완성했습니다!');
});

test('세로 네 줄을 만들면 승리한다', () => {
  const game = withMoves([2, 3, 2, 3, 2, 3, 2]);
  assert.strictEqual(game.status, 'won');
  assert.strictEqual(game.winner, PLAYERS.YELLOW);
  assert.deepStrictEqual(checkWinner(game.board).cells, [
    [ROWS - 4, 2],
    [ROWS - 3, 2],
    [ROWS - 2, 2],
    [ROWS - 1, 2],
  ]);
});

test('대각선 네 줄을 만들면 승리한다', () => {
  const game = withMoves([0, 1, 1, 2, 3, 2, 2, 3, 4, 3, 3]);
  assert.strictEqual(game.status, 'won');
  assert.strictEqual(game.winner, PLAYERS.YELLOW);
  assert.deepStrictEqual(checkWinner(game.board).cells, [
    [ROWS - 1, 0],
    [ROWS - 2, 1],
    [ROWS - 3, 2],
    [ROWS - 4, 3],
  ]);
});

test('가득 찬 열이나 끝난 게임에는 말을 놓을 수 없다', () => {
  const fullColumn = withMoves([0, 0, 0, 0, 0, 0]);
  assert.throws(() => dropDisc(fullColumn, 0), /가득 찬 열/);

  const won = withMoves([0, 0, 1, 1, 2, 2, 3]);
  assert.throws(() => dropDisc(won, 4), /끝난 게임/);
});

test('판이 모두 차면 무승부가 된다', () => {
  const board = [
    ['노랑', '빨강', '노랑', '빨강', '노랑', '빨강', '노랑'],
    ['노랑', '빨강', '노랑', '빨강', '노랑', '빨강', '노랑'],
    ['빨강', '노랑', '빨강', '노랑', '빨강', '노랑', '빨강'],
    ['빨강', '노랑', '빨강', '노랑', '빨강', '노랑', '빨강'],
    ['노랑', '빨강', '노랑', '빨강', '노랑', '빨강', '노랑'],
    ['노랑', '빨강', '노랑', '빨강', '노랑', '빨강', '노랑'],
  ];
  const game = createGame({ board, currentPlayer: PLAYERS.RED });
  assert.strictEqual(checkWinner(game.board), null);
  assert.strictEqual(isBoardFull(game.board), true);
  assert.strictEqual(game.status, 'draw');
  assert.strictEqual(statusText(game), '빈칸이 없어 무승부입니다.');
});
