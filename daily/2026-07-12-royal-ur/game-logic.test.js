const assert = require('assert');
const RoyalUr = require('./game-logic');

function testCreateGameStartsWithFivePiecesEach() {
  const game = RoyalUr.createGame();

  assert.deepStrictEqual(game.pieces.X, [-1, -1, -1, -1, -1]);
  assert.deepStrictEqual(game.pieces.O, [-1, -1, -1, -1, -1]);
  assert.strictEqual(game.turn, 'X');
  assert.strictEqual(game.status, '진행 중');
  assert.strictEqual(game.message, '주사위를 굴려 말을 전진하세요.');
}

function testLegalMovesEnterAndCannotStackOwnPiece() {
  const game = RoyalUr.createGame({
    dice: 3,
    pieces: {
      X: [2, -1, -1, -1, -1],
      O: [-1, -1, -1, -1, -1],
    },
  });

  assert.deepStrictEqual(RoyalUr.getLegalMoves(game), [
    { piece: 0, from: 2, to: 5, capture: false, score: false, rosette: false },
  ]);
}

function testLandingOnRosetteKeepsTurn() {
  const game = RoyalUr.createGame({
    dice: 4,
    pieces: {
      X: [-1, -1, -1, -1, -1],
      O: [-1, -1, -1, -1, -1],
    },
  });

  const next = RoyalUr.movePiece(game, 0);

  assert.strictEqual(next.pieces.X[0], 3);
  assert.strictEqual(next.turn, 'X');
  assert.strictEqual(next.dice, null);
  assert.match(next.message, /꽃무늬 칸/);
}

function testCaptureSendsOpponentHomeOnSharedUnsafeSquare() {
  const game = RoyalUr.createGame({
    dice: 2,
    pieces: {
      X: [3, -1, -1, -1, -1],
      O: [5, -1, -1, -1, -1],
    },
  });

  const next = RoyalUr.movePiece(game, 0);

  assert.strictEqual(next.pieces.X[0], 5);
  assert.strictEqual(next.pieces.O[0], -1);
  assert.strictEqual(next.turn, 'O');
  assert.match(next.message, /상대 말을 잡았습니다/);
}

function testSharedRosetteCannotBeCaptured() {
  const game = RoyalUr.createGame({
    dice: 3,
    pieces: {
      X: [4, -1, -1, -1, -1],
      O: [7, -1, -1, -1, -1],
    },
  });

  assert.ok(!RoyalUr.getLegalMoves(game).some((move) => move.piece === 0 && move.to === 7));
}

function testExactBearingOffWinsGame() {
  const game = RoyalUr.createGame({
    dice: 1,
    pieces: {
      X: [13, 14, 14, 14, 14],
      O: [0, -1, -1, -1, -1],
    },
  });

  const next = RoyalUr.movePiece(game, 0);

  assert.strictEqual(next.pieces.X[0], 14);
  assert.strictEqual(next.status, '승리');
  assert.strictEqual(next.message, '모든 말을 먼저 도착시켰습니다. 승리!');
}

function testComputerPrefersCapture() {
  const game = RoyalUr.createGame({
    turn: 'O',
    dice: 1,
    pieces: {
      X: [5, -1, -1, -1, -1],
      O: [4, -1, 8, -1, -1],
    },
  });

  const next = RoyalUr.playComputerTurn(game);

  assert.strictEqual(next.pieces.O[0], 5);
  assert.strictEqual(next.pieces.X[0], -1);
}

testCreateGameStartsWithFivePiecesEach();
testLegalMovesEnterAndCannotStackOwnPiece();
testLandingOnRosetteKeepsTurn();
testCaptureSendsOpponentHomeOnSharedUnsafeSquare();
testSharedRosetteCannotBeCaptured();
testExactBearingOffWinsGame();
testComputerPrefersCapture();

console.log('왕실 우르 게임 로직 테스트 통과');
