const assert = require('assert');
const Hexapawn = require('./game-logic');

function testCreateGameSetsClassicOpening() {
  const game = Hexapawn.createGame();

  assert.deepStrictEqual(game.board, [
    ['C', 'C', 'C'],
    [null, null, null],
    ['P', 'P', 'P'],
  ]);
  assert.strictEqual(game.turn, 'P');
  assert.strictEqual(game.status, '진행 중');
  assert.strictEqual(game.message, '내 말을 골라 앞으로 전진하거나 대각선으로 잡으세요.');
}

function testForwardMoveRequiresEmptySquare() {
  const game = Hexapawn.createGame();
  const moves = Hexapawn.getLegalMoves(game, 2, 1);

  assert.deepStrictEqual(moves, [{ from: [2, 1], to: [1, 1], capture: false }]);
}

function testDiagonalCaptureOnlyWhenEnemyExists() {
  const game = Hexapawn.createGame({
    board: [
      [null, 'C', null],
      ['C', null, 'C'],
      [null, 'P', null],
    ],
  });

  const moves = Hexapawn.getLegalMoves(game, 2, 1);

  assert.deepStrictEqual(moves, [
    { from: [2, 1], to: [1, 1], capture: false },
    { from: [2, 1], to: [1, 0], capture: true },
    { from: [2, 1], to: [1, 2], capture: true },
  ]);
}

function testPlayerReachingBackRankWins() {
  const game = Hexapawn.createGame({
    board: [
      [null, null, null],
      [null, 'P', null],
      [null, null, 'C'],
    ],
  });

  const next = Hexapawn.movePiece(game, [1, 1], [0, 1]);

  assert.strictEqual(next.status, '승리');
  assert.strictEqual(next.message, '내 말이 끝줄에 도착했습니다. 승리!');
  assert.deepStrictEqual(next.board[0], [null, 'P', null]);
}

function testPlayerWithoutLegalMovesLosesAfterComputerTurn() {
  const game = Hexapawn.createGame({
    turn: 'C',
    board: [
      [null, null, 'C'],
      ['C', null, null],
      ['P', null, null],
    ],
  });

  const next = Hexapawn.movePiece(game, [0, 2], [1, 2]);

  assert.strictEqual(next.status, '패배');
  assert.strictEqual(next.message, '움직일 수 있는 내 말이 없습니다. 패배.');
}

function testComputerChoosesWinningMoveFirst() {
  const game = Hexapawn.createGame({
    turn: 'C',
    board: [
      [null, null, null],
      [null, 'C', null],
      ['P', null, 'P'],
    ],
  });

  const next = Hexapawn.playComputerTurn(game);

  assert.strictEqual(next.status, '패배');
  assert.deepStrictEqual(next.board[2], ['P', 'C', 'P']);
}

testCreateGameSetsClassicOpening();
testForwardMoveRequiresEmptySquare();
testDiagonalCaptureOnlyWhenEnemyExists();
testPlayerReachingBackRankWins();
testPlayerWithoutLegalMovesLosesAfterComputerTurn();
testComputerChoosesWinningMoveFirst();

console.log('헥사폰 로직 테스트 통과');
