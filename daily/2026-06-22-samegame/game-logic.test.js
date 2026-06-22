const assert = require('assert');
const SameGame = require('./game-logic');

function sortCells(cells) {
  return cells.map(([x, y]) => [x, y]).sort((a, b) => a[1] - b[1] || a[0] - b[0]);
}

function testCreateGameNormalizesBoard() {
  const game = SameGame.createGame({
    width: 3,
    height: 2,
    colors: ['빨강', '파랑'],
    board: [
      ['빨강', '파랑', '노랑'],
      ['파랑', '', '빨강'],
    ],
  });

  assert.strictEqual(game.width, 3);
  assert.strictEqual(game.height, 2);
  assert.deepStrictEqual(game.board, [
    ['빨강', '파랑', '빨강'],
    ['파랑', null, '빨강'],
  ]);
  assert.strictEqual(game.score, 0);
  assert.strictEqual(game.status, '진행 중');
}

function testFindGroupUsesFourDirections() {
  const game = SameGame.createGame({
    width: 4,
    height: 3,
    board: [
      ['빨강', '빨강', '파랑', '파랑'],
      ['노랑', '빨강', '초록', '파랑'],
      ['노랑', '노랑', '초록', '초록'],
    ],
  });

  assert.deepStrictEqual(sortCells(SameGame.findGroup(game, 1, 0)), [
    [0, 0],
    [1, 0],
    [1, 1],
  ]);
  assert.deepStrictEqual(sortCells(SameGame.findGroup(game, 2, 2)), [
    [2, 1],
    [2, 2],
    [3, 2],
  ]);
}

function testRemoveGroupDropsCellsAndCompactsColumns() {
  const game = SameGame.createGame({
    width: 4,
    height: 4,
    board: [
      ['빨강', '파랑', '초록', '노랑'],
      ['빨강', '파랑', '초록', '노랑'],
      ['빨강', '파랑', '노랑', '노랑'],
      ['빨강', '파랑', '초록', '노랑'],
    ],
  });

  const next = SameGame.removeGroup(game, 1, 0);

  assert.strictEqual(next.removed, 4);
  assert.strictEqual(next.score, 16);
  assert.deepStrictEqual(next.board, [
    ['빨강', '초록', '노랑', null],
    ['빨강', '초록', '노랑', null],
    ['빨강', '노랑', '노랑', null],
    ['빨강', '초록', '노랑', null],
  ]);
  assert.strictEqual(next.message, '블록 4개를 지웠습니다.');
}

function testSingleBlockIsRejected() {
  const game = SameGame.createGame({
    width: 3,
    height: 2,
    board: [
      ['빨강', '파랑', '초록'],
      ['노랑', '파랑', '초록'],
    ],
  });

  const next = SameGame.removeGroup(game, 0, 0);

  assert.strictEqual(next.removed, 0);
  assert.strictEqual(next.score, 0);
  assert.deepStrictEqual(next.board, game.board);
  assert.strictEqual(next.message, '붙어 있는 같은 색 블록 2개 이상을 고르세요.');
}

function testGameEndsWhenNoMovesRemain() {
  const game = SameGame.createGame({
    width: 3,
    height: 3,
    score: 9,
    board: [
      ['빨강', '파랑', '빨강'],
      ['파랑', '빨강', '파랑'],
      ['빨강', '파랑', '빨강'],
    ],
  });

  assert.strictEqual(SameGame.hasMoves(game), false);
  assert.strictEqual(SameGame.finishIfNoMoves(game).status, '완료');
  assert.strictEqual(SameGame.finishIfNoMoves(game).message, '더 지울 블록이 없습니다. 최종 점수는 9점입니다.');
}

testCreateGameNormalizesBoard();
testFindGroupUsesFourDirections();
testRemoveGroupDropsCellsAndCompactsColumns();
testSingleBlockIsRejected();
testGameEndsWhenNoMovesRemain();

console.log('같은 블록 지우기 로직 테스트 통과');
