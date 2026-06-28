const assert = require('assert');
const MatchThree = require('./game-logic');

function sampleBoard() {
  return [
    ['빨강', '노랑', '빨강', '초록', '파랑'],
    ['파랑', '빨강', '노랑', '보라', '초록'],
    ['초록', '보라', '파랑', '노랑', '빨강'],
    ['노랑', '초록', '보라', '파랑', '노랑'],
    ['보라', '파랑', '초록', '빨강', '보라'],
  ];
}

function testFindMatchesReturnsUniqueHorizontalAndVerticalCells() {
  const board = [
    ['빨강', '빨강', '빨강', '초록', '파랑'],
    ['노랑', '초록', '파랑', '보라', '보라'],
    ['초록', '노랑', '파랑', '노랑', '빨강'],
    ['보라', '노랑', '파랑', '초록', '노랑'],
    ['빨강', '초록', '초록', '초록', '보라'],
  ];

  assert.deepStrictEqual(MatchThree.findMatches(board), [
    { row: 0, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: 2 },
    { row: 1, col: 2 },
    { row: 2, col: 2 },
    { row: 3, col: 2 },
    { row: 4, col: 1 },
    { row: 4, col: 2 },
    { row: 4, col: 3 },
  ]);
}

function testValidSwapClearsMatchRefillsBoardAndScores() {
  const game = MatchThree.createGame(sampleBoard(), 12);
  const nextGems = ['보라', '초록', '노랑'];
  const result = MatchThree.swapTiles(game, { row: 0, col: 1 }, { row: 1, col: 1 }, nextGems);

  assert.strictEqual(result.movesLeft, 11);
  assert.strictEqual(result.score, 30);
  assert.strictEqual(result.status, '진행 중');
  assert.strictEqual(result.message, '보석 3개를 지웠습니다.');
  assert.deepStrictEqual(result.lastCleared, [
    { row: 0, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: 2 },
  ]);
  assert.deepStrictEqual(result.board[0], ['보라', '초록', '노랑', '초록', '파랑']);
}

function testInvalidSwapDoesNotChangeBoardOrMoves() {
  const game = MatchThree.createGame(sampleBoard(), 12);
  const result = MatchThree.swapTiles(game, { row: 0, col: 0 }, { row: 4, col: 4 }, ['초록']);

  assert.strictEqual(result.movesLeft, 12);
  assert.strictEqual(result.score, 0);
  assert.strictEqual(result.message, '바로 붙은 보석 두 개만 바꿀 수 있습니다.');
  assert.deepStrictEqual(result.board, sampleBoard());
}

function testAdjacentSwapWithoutMatchIsReverted() {
  const game = MatchThree.createGame(sampleBoard(), 12);
  const result = MatchThree.swapTiles(game, { row: 0, col: 0 }, { row: 0, col: 1 }, ['초록']);

  assert.strictEqual(result.movesLeft, 12);
  assert.strictEqual(result.score, 0);
  assert.strictEqual(result.message, '맞는 보석이 없습니다. 다시 골라 보세요.');
  assert.deepStrictEqual(result.board, sampleBoard());
}

function testGameFinishesWhenMovesRunOut() {
  const game = MatchThree.createGame(sampleBoard(), 1);
  const result = MatchThree.swapTiles(game, { row: 0, col: 1 }, { row: 1, col: 1 }, ['보라', '초록', '노랑']);

  assert.strictEqual(result.movesLeft, 0);
  assert.strictEqual(result.status, '완료');
  assert.strictEqual(result.message, '마지막 이동으로 보석 3개를 지웠습니다. 최종 점수 30점!');
}

testFindMatchesReturnsUniqueHorizontalAndVerticalCells();
testValidSwapClearsMatchRefillsBoardAndScores();
testInvalidSwapDoesNotChangeBoardOrMoves();
testAdjacentSwapWithoutMatchIsReverted();
testGameFinishesWhenMovesRunOut();

console.log('보석 맞추기 로직 테스트 통과');
