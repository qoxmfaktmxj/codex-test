const assert = require('assert');
const LightsOut = require('./game-logic');

function testCreateGameBuildsDeterministicPuzzle() {
  const game = LightsOut.createGame();

  assert.strictEqual(game.size, 5);
  assert.strictEqual(game.status, '진행 중');
  assert.strictEqual(game.moves, 0);
  assert.strictEqual(game.lightCount, 13);
  assert.strictEqual(game.message, '켜진 칸을 모두 끄세요. 칸을 누르면 십자 모양으로 바뀝니다.');
  assert.deepStrictEqual(game.board[0], [true, false, false, false, false]);
}

function testDefaultPuzzleHasKnownSolution() {
  const solution = [[1, 0], [2, 0], [2, 4], [4, 0], [4, 1], [4, 2], [4, 3]];
  const result = solution.reduce((currentGame, [row, col]) => LightsOut.toggleAt(currentGame, row, col), LightsOut.createGame());

  assert.strictEqual(result.status, '완료');
  assert.strictEqual(result.lightCount, 0);
  assert.strictEqual(result.moves, 7);
  assert.strictEqual(result.message, '성공! 7번 만에 모든 불을 껐습니다.');
}

function testToggleFlipsCrossShapeOnly() {
  const game = LightsOut.createGame({ board: LightsOut.createBoard(3, false) });
  const result = LightsOut.toggleAt(game, 1, 1);

  assert.deepStrictEqual(result.board, [
    [false, true, false],
    [true, true, true],
    [false, true, false],
  ]);
  assert.strictEqual(result.moves, 1);
  assert.strictEqual(result.lightCount, 5);
}

function testCornerToggleStaysInsideBoard() {
  const game = LightsOut.createGame({ board: LightsOut.createBoard(3, false) });
  const result = LightsOut.toggleAt(game, 0, 0);

  assert.deepStrictEqual(result.board, [
    [true, true, false],
    [true, false, false],
    [false, false, false],
  ]);
  assert.strictEqual(result.lightCount, 3);
}

function testSolvedBoardCompletesGame() {
  const board = LightsOut.createBoard(3, false);
  board[0][1] = true;
  board[1][0] = true;
  board[1][1] = true;
  board[1][2] = true;
  board[2][1] = true;
  const game = LightsOut.createGame({ board });
  const result = LightsOut.toggleAt(game, 1, 1);

  assert.strictEqual(result.status, '완료');
  assert.strictEqual(result.lightCount, 0);
  assert.strictEqual(result.message, '성공! 1번 만에 모든 불을 껐습니다.');
}

function testCompletedGameDoesNotChange() {
  const game = LightsOut.createGame({
    board: LightsOut.createBoard(3, false),
    status: '완료',
    moves: 4,
  });
  const result = LightsOut.toggleAt(game, 1, 1);

  assert.deepStrictEqual(result.board, game.board);
  assert.strictEqual(result.moves, 4);
  assert.strictEqual(result.message, '이미 끝난 판입니다. 새 판을 시작하세요.');
}

function testInvalidPositionIsRejected() {
  const game = LightsOut.createGame();

  assert.throws(() => LightsOut.toggleAt(game, 5, 0), /말판 안의 칸/);
}

testCreateGameBuildsDeterministicPuzzle();
testDefaultPuzzleHasKnownSolution();
testToggleFlipsCrossShapeOnly();
testCornerToggleStaysInsideBoard();
testSolvedBoardCompletesGame();
testCompletedGameDoesNotChange();
testInvalidPositionIsRejected();

console.log('불 끄기 로직 테스트 통과');
