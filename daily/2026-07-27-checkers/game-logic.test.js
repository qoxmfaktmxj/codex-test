const assert = require('assert');
const Checkers = require('./game-logic');

function emptyBoard() {
  return Array.from({ length: Checkers.SIZE }, () => Array(Checkers.SIZE).fill(null));
}

function testCreatesStartingBoard() {
  const game = Checkers.createGame();

  assert.strictEqual(game.size, 6);
  assert.strictEqual(game.current, Checkers.BLACK);
  assert.strictEqual(game.status, '진행 중');
  assert.strictEqual(game.board[0][1], Checkers.BLACK);
  assert.strictEqual(game.board[5][0], Checkers.WHITE);
}

function testMovesPieceDiagonally() {
  const game = Checkers.createGame();
  const next = Checkers.movePiece(game, 1, 0, 2, 1);

  assert.strictEqual(next.board[1][0], null);
  assert.strictEqual(next.board[2][1], Checkers.BLACK);
  assert.strictEqual(next.current, Checkers.WHITE);
  assert.match(next.message, /백돌 차례/);
}

function testCapturesAnOpponentPiece() {
  const board = emptyBoard();
  board[2][1] = Checkers.BLACK;
  board[3][2] = Checkers.WHITE;
  board[5][4] = Checkers.WHITE;
  const game = Checkers.createGame({ board, current: Checkers.BLACK });
  const next = Checkers.movePiece(game, 2, 1, 4, 3);

  assert.strictEqual(next.board[3][2], null);
  assert.strictEqual(next.board[4][3], Checkers.BLACK);
  assert.strictEqual(next.whiteCount, 1);
  assert.strictEqual(next.current, Checkers.WHITE);
}

function testWinsAfterLastCapture() {
  const board = emptyBoard();
  board[2][1] = Checkers.BLACK;
  board[3][2] = Checkers.WHITE;
  const game = Checkers.createGame({ board, current: Checkers.BLACK });
  const next = Checkers.movePiece(game, 2, 1, 4, 3);

  assert.strictEqual(next.status, '흑 승리');
  assert.match(next.message, /흑돌 승리/);
}

function testLosesWhenCurrentPlayerCannotMove() {
  const board = emptyBoard();
  board[4][1] = Checkers.BLACK;
  board[5][0] = Checkers.WHITE;
  board[5][2] = Checkers.WHITE;
  const game = Checkers.createGame({ board, current: Checkers.BLACK });

  assert.strictEqual(game.status, '백 승리');
  assert.match(game.message, /움직일 수 없습니다/);
}

function testRejectsInvalidMoves() {
  const game = Checkers.createGame();
  const directionBoard = emptyBoard();
  directionBoard[2][1] = Checkers.BLACK;
  directionBoard[5][4] = Checkers.WHITE;
  const directionGame = Checkers.createGame({ board: directionBoard, current: Checkers.BLACK });

  assert.throws(() => Checkers.movePiece(game, 4, 1, 3, 0), /자기 말/);
  assert.throws(() => Checkers.movePiece(game, 1, 0, 3, 0), /대각선/);
  assert.throws(() => Checkers.movePiece(directionGame, 2, 1, 1, 0), /방향/);
  assert.throws(() => Checkers.movePiece(game, 1, 0, 0, 1), /비어 있지/);
}

testCreatesStartingBoard();
testMovesPieceDiagonally();
testCapturesAnOpponentPiece();
testWinsAfterLastCapture();
testLosesWhenCurrentPlayerCannotMove();
testRejectsInvalidMoves();

console.log('체커 로직 테스트 통과');
