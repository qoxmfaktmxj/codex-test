const assert = require('assert');
const KnightsTour = require('./game-logic');

function testCreateGameStartsInCorner() {
  const game = KnightsTour.createGame({ size: 5, startX: 0, startY: 0 });

  assert.strictEqual(game.size, 5);
  assert.deepStrictEqual(game.knight, { x: 0, y: 0 });
  assert.strictEqual(game.moves, 0);
  assert.strictEqual(game.status, '진행 중');
  assert.strictEqual(game.visited[0][0], true);
  assert.strictEqual(KnightsTour.countVisited(game), 1);
}

function testLegalMovesUseKnightShapeAndSkipVisited() {
  const game = KnightsTour.createGame({ size: 5, startX: 0, startY: 0 });

  assert.deepStrictEqual(KnightsTour.getLegalMoves(game), [
    { x: 1, y: 2 },
    { x: 2, y: 1 },
  ]);

  const next = KnightsTour.moveKnight(game, 1, 2);
  assert.deepStrictEqual(KnightsTour.getLegalMoves(next), [
    { x: 2, y: 4 },
    { x: 3, y: 3 },
    { x: 3, y: 1 },
    { x: 2, y: 0 },
    { x: 0, y: 4 },
  ]);
}

function testMoveKnightUpdatesBoardAndMessage() {
  const game = KnightsTour.createGame({ size: 5, startX: 0, startY: 0 });
  const next = KnightsTour.moveKnight(game, 2, 1);

  assert.deepStrictEqual(next.knight, { x: 2, y: 1 });
  assert.strictEqual(next.moves, 1);
  assert.strictEqual(next.visited[1][2], true);
  assert.strictEqual(next.message, '좋습니다. 2칸을 방문했습니다.');
}

function testVisitNumbersFollowMoveOrder() {
  let game = KnightsTour.createGame({ size: 5, startX: 0, startY: 0 });
  game = KnightsTour.moveKnight(game, 1, 2);
  game = KnightsTour.moveKnight(game, 2, 0);

  assert.strictEqual(KnightsTour.getVisitNumber(game, 0, 0), 1);
  assert.strictEqual(KnightsTour.getVisitNumber(game, 1, 2), 2);
  assert.strictEqual(KnightsTour.getVisitNumber(game, 2, 0), 3);
  assert.strictEqual(KnightsTour.getVisitNumber(game, 4, 4), '');
}

function testIllegalMoveDoesNotChangePosition() {
  const game = KnightsTour.createGame({ size: 5, startX: 0, startY: 0 });
  const next = KnightsTour.moveKnight(game, 0, 1);

  assert.deepStrictEqual(next.knight, { x: 0, y: 0 });
  assert.strictEqual(next.moves, 0);
  assert.strictEqual(next.message, '기사는 ㄱ자 모양으로만 이동할 수 있습니다.');
}

function testGameFailsWhenNoMovesRemain() {
  const visited = Array.from({ length: 5 }, () => Array(5).fill(false));
  visited[2][2] = true;
  [
    [0, 1],
    [1, 0],
    [3, 0],
    [4, 1],
    [4, 3],
    [3, 4],
    [1, 4],
    [0, 3],
  ].forEach(([x, y]) => {
    visited[y][x] = true;
  });
  const game = KnightsTour.createGame({
    size: 5,
    startX: 2,
    startY: 2,
    moves: 7,
    visited,
  });

  const finished = KnightsTour.finishIfNeeded(game);

  assert.strictEqual(finished.status, '실패');
  assert.strictEqual(finished.message, '더 이동할 곳이 없습니다. 25칸 중 9칸을 방문했습니다.');
}

function testGameWinsWhenEverySquareIsVisitedByLastMove() {
  const visited = Array.from({ length: 5 }, () => Array(5).fill(true));
  visited[2][1] = false;
  const game = KnightsTour.createGame({
    size: 5,
    startX: 0,
    startY: 0,
    moves: 23,
    visited,
  });

  const next = KnightsTour.moveKnight(game, 1, 2);

  assert.strictEqual(next.status, '성공');
  assert.strictEqual(next.moves, 24);
  assert.strictEqual(next.message, '성공입니다. 모든 칸을 한 번씩 방문했습니다!');
}

testCreateGameStartsInCorner();
testLegalMovesUseKnightShapeAndSkipVisited();
testMoveKnightUpdatesBoardAndMessage();
testVisitNumbersFollowMoveOrder();
testIllegalMoveDoesNotChangePosition();
testGameFailsWhenNoMovesRemain();
testGameWinsWhenEverySquareIsVisitedByLastMove();

console.log('기사 순회 로직 테스트 통과');
