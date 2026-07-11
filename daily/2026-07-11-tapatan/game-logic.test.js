const assert = require('assert');
const Tapatan = require('./game-logic');

function testCreateGameStartsPlacementPhase() {
  const game = Tapatan.createGame();

  assert.deepStrictEqual(game.board, Array(9).fill(null));
  assert.strictEqual(game.turn, 'X');
  assert.strictEqual(game.phase, '놓기');
  assert.strictEqual(game.status, '진행 중');
  assert.deepStrictEqual(game.remaining, { X: 3, O: 3 });
  assert.strictEqual(game.message, '내 말을 빈 점에 놓으세요.');
}

function testPlaceStoneConsumesRemainingAndChangesTurn() {
  const game = Tapatan.createGame();
  const next = Tapatan.placeStone(game, 4);

  assert.strictEqual(next.board[4], 'X');
  assert.strictEqual(next.remaining.X, 2);
  assert.strictEqual(next.turn, 'O');
  assert.strictEqual(next.message, '컴퓨터가 말을 놓을 차례입니다.');
}

function testPlacementEndsWithWinBeforeMovePhase() {
  const game = Tapatan.createGame({
    board: ['X', 'X', null, 'O', 'O', null, null, null, null],
    turn: 'X',
    remaining: { X: 1, O: 1 },
  });

  const next = Tapatan.placeStone(game, 2);

  assert.strictEqual(next.status, '승리');
  assert.strictEqual(next.phase, '끝');
  assert.strictEqual(next.message, '세 말을 한 줄로 이었습니다. 승리!');
}

function testMovePhaseStartsAfterAllStonesArePlaced() {
  const game = Tapatan.createGame({
    board: ['X', 'O', 'X', 'O', 'X', 'O', null, null, null],
    turn: 'X',
    remaining: { X: 0, O: 0 },
  });

  const moves = Tapatan.getLegalMoves(game, 4);

  assert.deepStrictEqual(moves, [6, 7, 8]);
}

function testMoveStoneRequiresAdjacentEmptyPoint() {
  const game = Tapatan.createGame({
    phase: '이동',
    board: ['X', null, 'O', null, 'X', null, 'O', null, 'X'],
    turn: 'X',
    remaining: { X: 0, O: 0 },
  });

  assert.throws(() => Tapatan.moveStone(game, 0, 8), /인접한 빈 점으로만 이동할 수 있습니다/);

  const next = Tapatan.moveStone(game, 0, 1);
  assert.strictEqual(next.board[0], null);
  assert.strictEqual(next.board[1], 'X');
  assert.strictEqual(next.turn, 'O');
}

function testComputerPlacesWinningPointFirst() {
  const game = Tapatan.createGame({
    board: ['O', 'O', null, 'X', null, 'X', null, null, null],
    turn: 'O',
    remaining: { X: 1, O: 1 },
  });

  const next = Tapatan.playComputerTurn(game);

  assert.strictEqual(next.status, '패배');
  assert.strictEqual(next.board[2], 'O');
  assert.strictEqual(next.message, '컴퓨터가 세 말을 이었습니다. 패배.');
}

testCreateGameStartsPlacementPhase();
testPlaceStoneConsumesRemainingAndChangesTurn();
testPlacementEndsWithWinBeforeMovePhase();
testMovePhaseStartsAfterAllStonesArePlaced();
testMoveStoneRequiresAdjacentEmptyPoint();
testComputerPlacesWinningPointFirst();

console.log('타파탄 로직 테스트 통과');
