const assert = require('assert');
const {
  COLORS,
  createBoard,
  createGame,
  floodBoard,
  getFloodedCells,
  isComplete,
  pickColor,
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

test('정해진 난수로 지정 크기의 색깔 판을 만든다', () => {
  const rolls = [0, 0.2, 0.4, 0.6, 0.8, 0.99, 0.1, 0.3, 0.5];
  const board = createBoard(3, () => rolls.shift());
  assert.deepStrictEqual(board, [
    ['빨강', '주황', '노랑'],
    ['초록', '파랑', '보라'],
    ['빨강', '주황', '초록'],
  ]);
});

test('새 게임은 판, 이동 제한, 시작 메시지를 준비한다', () => {
  const game = createGame({
    board: [
      ['빨강', '빨강'],
      ['파랑', '노랑'],
    ],
    moveLimit: 6,
  });
  assert.strictEqual(game.size, 2);
  assert.strictEqual(game.moveLimit, 6);
  assert.strictEqual(game.moves, 0);
  assert.strictEqual(game.status, '진행 중');
  assert.strictEqual(game.currentColor, '빨강');
  assert.strictEqual(game.message, '왼쪽 위와 이어진 영역을 한 가지 색으로 채우세요.');
});

test('왼쪽 위와 이어진 같은 색 영역을 찾는다', () => {
  const cells = getFloodedCells([
    ['빨강', '빨강', '파랑'],
    ['노랑', '빨강', '파랑'],
    ['노랑', '초록', '초록'],
  ]);
  assert.deepStrictEqual(cells, [
    [0, 0],
    [0, 1],
    [1, 1],
  ]);
});

test('색을 고르면 이어진 영역이 바뀌고 같은 색 이웃까지 흡수한다', () => {
  const game = createGame({
    board: [
      ['빨강', '빨강', '파랑'],
      ['노랑', '파랑', '파랑'],
      ['노랑', '초록', '초록'],
    ],
    moveLimit: 6,
  });
  const next = pickColor(game, '파랑');
  assert.deepStrictEqual(next.board, [
    ['파랑', '파랑', '파랑'],
    ['노랑', '파랑', '파랑'],
    ['노랑', '초록', '초록'],
  ]);
  assert.strictEqual(next.moves, 1);
  assert.strictEqual(next.currentColor, '파랑');
  assert.strictEqual(next.status, '진행 중');
  assert.strictEqual(next.message, '파랑으로 넓혔습니다. 남은 이동은 5회입니다.');
});

test('이미 같은 색을 고르면 이동 수를 쓰지 않는다', () => {
  const game = createGame({
    board: [
      ['빨강', '파랑'],
      ['노랑', '초록'],
    ],
    moveLimit: 4,
  });
  const next = pickColor(game, '빨강');
  assert.strictEqual(next.moves, 0);
  assert.strictEqual(next.message, '이미 선택된 색입니다. 다른 색을 고르세요.');
});

test('모든 칸이 같은 색이 되면 승리로 끝난다', () => {
  const game = createGame({
    board: [
      ['빨강', '파랑'],
      ['파랑', '파랑'],
    ],
    moveLimit: 4,
  });
  const next = pickColor(game, '파랑');
  assert.strictEqual(isComplete(next.board), true);
  assert.strictEqual(next.status, '승리');
  assert.strictEqual(next.message, '성공! 모든 칸을 파랑으로 채웠습니다.');
});

test('이동 제한을 모두 쓰면 실패로 끝난다', () => {
  const game = createGame({
    board: [
      ['빨강', '파랑'],
      ['노랑', '초록'],
    ],
    moveLimit: 1,
  });
  const next = pickColor(game, '파랑');
  assert.strictEqual(next.status, '실패');
  assert.strictEqual(next.message, '이동을 모두 사용했습니다. 다시 도전하세요.');
});

test('순수 함수로 판을 직접 채울 수 있다', () => {
  const board = floodBoard([
    ['빨강', '파랑'],
    ['빨강', '초록'],
  ], '노랑');
  assert.deepStrictEqual(board, [
    ['노랑', '파랑'],
    ['노랑', '초록'],
  ]);
  assert.deepStrictEqual(COLORS, ['빨강', '주황', '노랑', '초록', '파랑', '보라']);
});
