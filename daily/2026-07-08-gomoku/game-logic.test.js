const assert = require('assert');
const {
  BOARD_SIZE,
  createGame,
  isValidMove,
  placeStone,
  getWinner,
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

test('새 게임은 빈 9칸 보드와 흑돌 차례를 준비한다', () => {
  const game = createGame();
  assert.strictEqual(game.board.length, BOARD_SIZE);
  assert.strictEqual(game.board[0].length, BOARD_SIZE);
  assert.strictEqual(game.currentStone, '흑');
  assert.strictEqual(game.status, '진행 중');
  assert.strictEqual(game.message, '흑돌을 놓을 칸을 고르세요.');
  assert.strictEqual(game.winner, null);
});

test('진행 중인 빈 칸에만 돌을 놓을 수 있다', () => {
  const game = createGame();
  const occupied = placeStone(game, 4, 4);
  const ended = createGame({ status: '승리', winner: '흑' });

  assert.strictEqual(isValidMove(game, 0, 0), true);
  assert.strictEqual(isValidMove(occupied, 4, 4), false);
  assert.strictEqual(isValidMove(game, -1, 0), false);
  assert.strictEqual(isValidMove(game, 0, BOARD_SIZE), false);
  assert.strictEqual(isValidMove(ended, 0, 0), false);
});

test('돌을 놓으면 보드가 바뀌고 차례가 넘어간다', () => {
  const game = placeStone(createGame(), 4, 4);

  assert.strictEqual(game.board[4][4], '흑');
  assert.strictEqual(game.currentStone, '백');
  assert.strictEqual(game.status, '진행 중');
  assert.strictEqual(game.message, '백돌 차례입니다.');
});

test('가로로 다섯 돌을 이으면 승리한다', () => {
  let game = createGame();
  game = placeStone(game, 2, 0);
  game = placeStone(game, 3, 0);
  game = placeStone(game, 2, 1);
  game = placeStone(game, 3, 1);
  game = placeStone(game, 2, 2);
  game = placeStone(game, 3, 2);
  game = placeStone(game, 2, 3);
  game = placeStone(game, 3, 3);
  game = placeStone(game, 2, 4);

  assert.strictEqual(game.status, '승리');
  assert.strictEqual(game.winner, '흑');
  assert.strictEqual(getWinner(game.board), '흑');
  assert.strictEqual(game.message, '흑돌이 다섯 줄을 완성했습니다.');
});

test('대각선으로 다섯 돌을 이으면 승리한다', () => {
  const board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));
  for (let i = 0; i < 5; i += 1) {
    board[i][i] = '백';
  }

  assert.strictEqual(getWinner(board), '백');
});

test('반대 대각선으로 다섯 돌을 이으면 승리한다', () => {
  const board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));
  for (let i = 0; i < 5; i += 1) {
    board[i][4 - i] = '흑';
  }

  assert.strictEqual(getWinner(board), '흑');
});

test('마지막 칸을 채워도 다섯 줄이 없으면 무승부가 된다', () => {
  const board = [
    ['흑', '흑', '백', '백', '흑', '흑', '백', '백', null],
    ['백', '백', '흑', '흑', '백', '백', '흑', '흑', '백'],
    ['흑', '흑', '백', '백', '흑', '흑', '백', '백', '흑'],
    ['백', '백', '흑', '흑', '백', '백', '흑', '흑', '백'],
    ['흑', '흑', '백', '백', '흑', '흑', '백', '백', '흑'],
    ['백', '백', '흑', '흑', '백', '백', '흑', '흑', '백'],
    ['흑', '흑', '백', '백', '흑', '흑', '백', '백', '흑'],
    ['백', '백', '흑', '흑', '백', '백', '흑', '흑', '백'],
    ['흑', '백', '흑', '백', '흑', '백', '흑', '백', '흑'],
  ];
  const game = placeStone(createGame({ board, currentStone: '흑' }), 0, 8);

  assert.strictEqual(game.status, '무승부');
  assert.strictEqual(game.winner, null);
  assert.strictEqual(game.message, '빈 칸이 없어 무승부입니다.');
});

test('잘못된 수는 기존 상태를 바꾸지 않는다', () => {
  const game = placeStone(createGame(), 0, 0);
  const unchanged = placeStone(game, 0, 0);

  assert.deepStrictEqual(unchanged, game);
});
