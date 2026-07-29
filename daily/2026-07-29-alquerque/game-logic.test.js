const assert = require('assert');
const Alquerque = require('./game-logic');

function testCreatesClassicOpening() {
  const game = Alquerque.createGame();

  assert.strictEqual(game.size, 5);
  assert.strictEqual(game.board[0][0], Alquerque.WHITE);
  assert.strictEqual(game.board[4][4], Alquerque.BLACK);
  assert.strictEqual(game.board[2][2], Alquerque.EMPTY);
  assert.strictEqual(game.turn, Alquerque.WHITE);
  assert.strictEqual(game.status, '진행 중');
}

function testMovesOneAdjacentPointAlongAllowedLine() {
  const game = Alquerque.createGame();
  const next = Alquerque.movePiece(game, 1, 2, 2, 2);

  assert.strictEqual(next.board[1][2], Alquerque.EMPTY);
  assert.strictEqual(next.board[2][2], Alquerque.WHITE);
  assert.strictEqual(next.turn, Alquerque.BLACK);
}

function testRequiresCaptureWhenAJumpIsAvailable() {
  const board = Alquerque.emptyBoard();
  board[2][0] = Alquerque.WHITE;
  board[2][1] = Alquerque.BLACK;
  board[0][0] = Alquerque.WHITE;
  const game = Alquerque.createGame({ board, turn: Alquerque.WHITE });

  assert.throws(() => Alquerque.movePiece(game, 0, 0, 1, 0), /잡을 수 있는 말이 있으면/);
}

function testCapturesByJumpingOverOpponent() {
  const board = Alquerque.emptyBoard();
  board[2][0] = Alquerque.WHITE;
  board[2][1] = Alquerque.BLACK;
  const game = Alquerque.createGame({ board, turn: Alquerque.WHITE });
  const next = Alquerque.movePiece(game, 2, 0, 2, 2);

  assert.strictEqual(next.board[2][0], Alquerque.EMPTY);
  assert.strictEqual(next.board[2][1], Alquerque.EMPTY);
  assert.strictEqual(next.board[2][2], Alquerque.WHITE);
  assert.strictEqual(next.captured.white, 1);
}

function testRequiresTheSamePieceToContinueCapturing() {
  const board = Alquerque.emptyBoard();
  board[2][0] = Alquerque.WHITE;
  board[2][1] = Alquerque.BLACK;
  board[2][3] = Alquerque.BLACK;
  const game = Alquerque.createGame({ board, turn: Alquerque.WHITE });
  const afterFirstCapture = Alquerque.movePiece(game, 2, 0, 2, 2);

  assert.strictEqual(afterFirstCapture.turn, Alquerque.WHITE);
  assert.deepStrictEqual(afterFirstCapture.forcedPiece, { row: 2, col: 2 });
  assert.throws(() => Alquerque.movePiece(afterFirstCapture, 2, 2, 1, 2), /반드시 같은 말을/);

  const afterSecondCapture = Alquerque.movePiece(afterFirstCapture, 2, 2, 2, 4);
  assert.strictEqual(afterSecondCapture.status, '백 승리');
  assert.strictEqual(afterSecondCapture.captured.white, 2);
}

function testAllowsDiagonalOnlyFromMarkedIntersections() {
  const board = Alquerque.emptyBoard();
  board[0][1] = Alquerque.WHITE;
  board[4][4] = Alquerque.BLACK;
  const game = Alquerque.createGame({ board, turn: Alquerque.WHITE });

  assert.throws(() => Alquerque.movePiece(game, 0, 1, 1, 2), /연결선/);
}

function testDeclaresWinnerWhenOpponentHasNoPieces() {
  const board = Alquerque.emptyBoard();
  board[2][0] = Alquerque.WHITE;
  const game = Alquerque.createGame({ board, turn: Alquerque.WHITE });

  assert.strictEqual(game.status, '백 승리');
  assert.match(game.message, /백돌/);
}

testCreatesClassicOpening();
testMovesOneAdjacentPointAlongAllowedLine();
testRequiresCaptureWhenAJumpIsAvailable();
testCapturesByJumpingOverOpponent();
testRequiresTheSamePieceToContinueCapturing();
testAllowsDiagonalOnlyFromMarkedIntersections();
testDeclaresWinnerWhenOpponentHasNoPieces();

console.log('알케르케 로직 테스트 통과');
