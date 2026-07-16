const assert = require('assert');
const MiniLudo = require('./game-logic');

function testCreateGameStartsWithHomePieces() {
  const game = MiniLudo.createGame({ piecesPerPlayer: 3 });

  assert.strictEqual(game.currentPlayer, '빨강');
  assert.deepStrictEqual(game.players.빨강.pieces, [-1, -1, -1]);
  assert.deepStrictEqual(game.players.파랑.pieces, [-1, -1, -1]);
  assert.strictEqual(game.roll, null);
  assert.strictEqual(game.status, '진행 중');
}

function testSixCanEnterFromHome() {
  const game = MiniLudo.createGame({ piecesPerPlayer: 2 });
  const rolled = MiniLudo.rollDie(game, () => 0.95);
  const next = MiniLudo.movePiece(rolled, 0);

  assert.strictEqual(rolled.roll, 6);
  assert.deepStrictEqual(next.players.빨강.pieces, [0, -1]);
  assert.strictEqual(next.currentPlayer, '빨강');
  assert.strictEqual(next.roll, null);
  assert.match(next.message, /한 번 더/);
}

function testNonSixWithOnlyHomePiecesPassesTurn() {
  const game = MiniLudo.createGame({ piecesPerPlayer: 2 });
  const next = MiniLudo.rollDie(game, () => 0.2);

  assert.strictEqual(next.roll, null);
  assert.strictEqual(next.currentPlayer, '파랑');
  assert.match(next.message, /움직일 말이 없습니다/);
}

function testMoveCapturesOpponentOnSameBoardSpace() {
  const game = MiniLudo.createGame({
    currentPlayer: '빨강',
    roll: 3,
    players: {
      빨강: { pieces: [4, -1] },
      파랑: { pieces: [17, -1] },
    },
  });
  const next = MiniLudo.movePiece(game, 0);

  assert.deepStrictEqual(next.players.빨강.pieces, [7, -1]);
  assert.deepStrictEqual(next.players.파랑.pieces, [-1, -1]);
  assert.strictEqual(next.currentPlayer, '파랑');
  assert.match(next.message, /잡았습니다/);
}

function testRequiresExactFinishAndWinsWhenAllPiecesFinish() {
  const blocked = MiniLudo.createGame({
    currentPlayer: '빨강',
    roll: 4,
    players: {
      빨강: { pieces: [18, -1] },
      파랑: { pieces: [-1, -1] },
    },
  });

  assert.deepStrictEqual(MiniLudo.getLegalMoves(blocked), []);

  const game = MiniLudo.createGame({
    currentPlayer: '빨강',
    roll: 2,
    players: {
      빨강: { pieces: [18, 20] },
      파랑: { pieces: [3, -1] },
    },
  });
  const won = MiniLudo.movePiece(game, 0);

  assert.deepStrictEqual(won.players.빨강.pieces, [20, 20]);
  assert.strictEqual(won.status, '승리');
  assert.strictEqual(won.winner, '빨강');
}

function testRejectsMovingOntoOwnPiece() {
  const game = MiniLudo.createGame({
    currentPlayer: '빨강',
    roll: 2,
    players: {
      빨강: { pieces: [3, 5] },
      파랑: { pieces: [-1, -1] },
    },
  });

  assert.deepStrictEqual(MiniLudo.getLegalMoves(game), [1]);
  assert.throws(() => MiniLudo.movePiece(game, 0), /선택한 말은 움직일 수 없습니다/);
}

testCreateGameStartsWithHomePieces();
testSixCanEnterFromHome();
testNonSixWithOnlyHomePiecesPassesTurn();
testMoveCapturesOpponentOnSameBoardSpace();
testRequiresExactFinishAndWinsWhenAllPiecesFinish();
testRejectsMovingOntoOwnPiece();

console.log('루도 미니 로직 테스트 통과');
