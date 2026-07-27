const assert = require('assert');
const {
  BOARD_SIZE,
  BOX_SIZE,
  PLAYERS,
  createGame,
  claimEdge,
  getEdgeState,
  getBoxState,
  getWinner,
  isBoxClosed,
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

test('새 게임은 4x4 점과 3x3 칸을 비운 상태로 시작한다', () => {
  const game = createGame();
  assert.strictEqual(BOARD_SIZE, 4);
  assert.strictEqual(BOX_SIZE, 3);
  assert.strictEqual(game.horizontal.length, BOARD_SIZE);
  assert.strictEqual(game.horizontal[0].length, BOX_SIZE);
  assert.strictEqual(game.vertical.length, BOX_SIZE);
  assert.strictEqual(game.vertical[0].length, BOARD_SIZE);
  assert.deepStrictEqual(game.scores, { 파랑: 0, 빨강: 0 });
  assert.strictEqual(game.currentPlayer, PLAYERS[0]);
  assert.strictEqual(game.status, '진행 중');
});

test('빈 선을 그으면 차례가 넘어가고 선 상태가 표시된다', () => {
  const game = claimEdge(createGame(), '가로', 0, 0);
  assert.strictEqual(game.horizontal[0][0], '파랑');
  assert.strictEqual(game.currentPlayer, '빨강');
  assert.strictEqual(game.moves, 1);
  assert.deepStrictEqual(getEdgeState(game, '가로', 0, 0), {
    owner: '파랑',
    available: false,
  });
});

test('이미 그은 선이나 범위 밖 선은 점수와 차례를 바꾸지 않는다', () => {
  const first = claimEdge(createGame(), '가로', 0, 0);
  const repeated = claimEdge(first, '가로', 0, 0);
  const outside = claimEdge(first, '세로', 9, 9);
  assert.strictEqual(repeated.currentPlayer, '빨강');
  assert.deepStrictEqual(repeated.scores, first.scores);
  assert.strictEqual(repeated.message, '이미 그은 선입니다.');
  assert.strictEqual(outside.message, '그을 수 없는 선입니다.');
});

test('칸의 네 변을 완성하면 점수를 얻고 한 번 더 둔다', () => {
  let game = createGame();
  game = claimEdge(game, '가로', 0, 0);
  game = claimEdge(game, '가로', 1, 0);
  game = claimEdge(game, '세로', 0, 0);
  game = claimEdge(game, '세로', 0, 1);
  assert.strictEqual(isBoxClosed(game, 0, 0), true);
  assert.strictEqual(game.boxes[0][0], '빨강');
  assert.strictEqual(game.scores['빨강'], 1);
  assert.strictEqual(game.currentPlayer, '빨강');
  assert.deepStrictEqual(getBoxState(game, 0, 0), {
    owner: '빨강',
    closed: true,
  });
});

test('가운데 선은 두 칸을 동시에 완성할 수 있다', () => {
  const prepared = createGame({
    currentPlayer: '파랑',
    horizontal: [
      [true, false, false],
      [false, false, false],
      [true, false, false],
      [false, false, false],
    ],
    vertical: [
      [true, true, false, false],
      [true, true, false, false],
      [false, false, false, false],
    ],
    boxes: [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ],
  });
  const game = claimEdge(prepared, '가로', 1, 0);
  assert.strictEqual(game.scores['파랑'], 2);
  assert.strictEqual(game.boxes[0][0], '파랑');
  assert.strictEqual(game.boxes[1][0], '파랑');
  assert.strictEqual(game.currentPlayer, '파랑');
});

test('모든 칸을 채우면 승자를 알려 주고 게임을 끝낸다', () => {
  const game = createGame({
    horizontal: [
      [true, true, true],
      [true, true, true],
      [true, true, true],
      [true, true, false],
    ],
    vertical: Array.from({ length: BOX_SIZE }, () => Array(BOARD_SIZE).fill(true)),
    boxes: [
      ['파랑', '파랑', '파랑'],
      ['파랑', '파랑', '빨강'],
      ['빨강', '빨강', null],
    ],
    scores: { 파랑: 5, 빨강: 3 },
    currentPlayer: '빨강',
  });
  const finished = claimEdge(game, '가로', 3, 2);
  assert.strictEqual(finished.status, '완료');
  assert.strictEqual(finished.scores['빨강'], 4);
  assert.strictEqual(getWinner(finished), '파랑');
  assert.strictEqual(finished.message, '파랑 승리! 더 많은 칸을 차지했습니다.');
});

test('새로 시작하면 처음 상태로 돌아간다', () => {
  const changed = claimEdge(createGame(), '가로', 0, 0);
  assert.deepStrictEqual(resetGame(), createGame());
  assert.notDeepStrictEqual(changed, resetGame());
});
