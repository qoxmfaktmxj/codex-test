const assert = require('assert');
const Chomp = require('./game-logic');

function testCreateGameBuildsFullChocolateBar() {
  const game = Chomp.createGame();

  assert.strictEqual(game.rows, 4);
  assert.strictEqual(game.cols, 5);
  assert.strictEqual(game.status, '진행 중');
  assert.strictEqual(game.currentPlayer, '사람');
  assert.strictEqual(game.remainingSafeCells, 19);
  assert.strictEqual(game.message, '독이 든 왼쪽 위 조각을 피해서 초콜릿을 고르세요.');
  assert.deepStrictEqual(game.board[0], [true, true, true, true, true]);
}

function testSafeMoveEatsChosenRectangleAndChangesTurn() {
  const result = Chomp.chooseCell(Chomp.createGame(), 1, 2);

  assert.deepStrictEqual(result.board, [
    [true, true, true, true, true],
    [true, true, false, false, false],
    [true, true, false, false, false],
    [true, true, false, false, false],
  ]);
  assert.strictEqual(result.remainingSafeCells, 10);
  assert.strictEqual(result.currentPlayer, '컴퓨터');
  assert.strictEqual(result.message, '사람이 2행 3열부터 오른쪽 아래를 먹었습니다.');
}

function testEatingPoisonLosesImmediately() {
  const result = Chomp.chooseCell(Chomp.createGame(), 0, 0);

  assert.strictEqual(result.status, '패배');
  assert.strictEqual(result.currentPlayer, '사람');
  assert.strictEqual(result.remainingSafeCells, 0);
  assert.strictEqual(result.message, '사람이 독 초콜릿을 먹었습니다. 패배입니다.');
  assert.deepStrictEqual(result.board, Chomp.createBoard(4, 5, false));
}

function testAlreadyEatenCellDoesNotChangeTurn() {
  const game = Chomp.chooseCell(Chomp.createGame(), 1, 2);
  const result = Chomp.chooseCell(game, 2, 3);

  assert.deepStrictEqual(result.board, game.board);
  assert.strictEqual(result.currentPlayer, '컴퓨터');
  assert.strictEqual(result.remainingSafeCells, 10);
  assert.strictEqual(result.message, '이미 먹은 조각입니다. 남은 초콜릿을 고르세요.');
}

function testComputerTakesLastSafeCellWhenAvailable() {
  const board = Chomp.createBoard(2, 2, false);
  board[0][0] = true;
  board[0][1] = true;
  const game = Chomp.createGame({ rows: 2, cols: 2, board, currentPlayer: '컴퓨터' });
  const result = Chomp.computerMove(game);

  assert.strictEqual(result.board[0][1], false);
  assert.strictEqual(result.board[0][0], true);
  assert.strictEqual(result.status, '진행 중');
  assert.strictEqual(result.currentPlayer, '사람');
  assert.strictEqual(result.remainingSafeCells, 0);
  assert.strictEqual(result.message, '컴퓨터가 1행 2열부터 오른쪽 아래를 먹었습니다.');
}

function testComputerLosesWhenOnlyPoisonRemains() {
  const board = Chomp.createBoard(2, 2, false);
  board[0][0] = true;
  const game = Chomp.createGame({ rows: 2, cols: 2, board, currentPlayer: '컴퓨터' });
  const result = Chomp.computerMove(game);

  assert.strictEqual(result.status, '승리');
  assert.strictEqual(result.currentPlayer, '컴퓨터');
  assert.strictEqual(result.message, '컴퓨터가 독 초콜릿을 먹었습니다. 승리입니다.');
}

function testFinishedGameDoesNotChange() {
  const game = Chomp.chooseCell(Chomp.createGame(), 0, 0);
  const result = Chomp.chooseCell(game, 0, 1);

  assert.deepStrictEqual(result.board, game.board);
  assert.strictEqual(result.status, '패배');
  assert.strictEqual(result.message, '이미 끝난 판입니다. 새 판을 시작하세요.');
}

function testInvalidPositionIsRejected() {
  assert.throws(() => Chomp.chooseCell(Chomp.createGame(), 4, 0), /초콜릿 안의 조각/);
}

testCreateGameBuildsFullChocolateBar();
testSafeMoveEatsChosenRectangleAndChangesTurn();
testEatingPoisonLosesImmediately();
testAlreadyEatenCellDoesNotChangeTurn();
testComputerTakesLastSafeCellWhenAvailable();
testComputerLosesWhenOnlyPoisonRemains();
testFinishedGameDoesNotChange();
testInvalidPositionIsRejected();

console.log('독 초콜릿 피하기 로직 테스트 통과');
