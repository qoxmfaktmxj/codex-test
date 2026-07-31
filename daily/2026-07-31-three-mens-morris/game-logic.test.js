const assert = require('assert');
const Morris = require('./game-logic');

function testStartsWithAnEmptyBoardAndPlacementPhase() {
  const game = Morris.createGame();

  assert.deepStrictEqual(game.board, Array(9).fill(Morris.EMPTY));
  assert.strictEqual(game.turn, Morris.PLAYER);
  assert.strictEqual(game.phase, '놓기');
}

function testPlacesTokensUntilEachPlayerHasThree() {
  let game = Morris.createGame();
  game = Morris.applyMove(game, { to: 0 });
  game = Morris.applyMove(game, { to: 1 });
  game = Morris.applyMove(game, { to: 4 });

  assert.strictEqual(game.board[0], Morris.PLAYER);
  assert.strictEqual(game.board[1], Morris.COMPUTER);
  assert.strictEqual(game.board[4], Morris.PLAYER);
  assert.strictEqual(game.phase, '놓기');
}

function testMovesOnlyToAnAdjacentEmptyPointAfterPlacement() {
  const game = Morris.createGame({
    board: [Morris.PLAYER, Morris.COMPUTER, Morris.PLAYER, Morris.EMPTY, Morris.COMPUTER, Morris.COMPUTER, Morris.PLAYER, Morris.EMPTY, Morris.EMPTY],
    turn: Morris.PLAYER,
  });

  assert.deepStrictEqual(Morris.availableMoves(game), [{ from: 0, to: 3 }, { from: 6, to: 3 }, { from: 6, to: 7 }]);
  assert.throws(() => Morris.applyMove(game, { from: 0, to: 8 }), /인접/);
}

function testDeclaresVictoryForThreeInARow() {
  const game = Morris.createGame({
    board: [Morris.PLAYER, Morris.COMPUTER, Morris.COMPUTER, Morris.EMPTY, Morris.PLAYER, Morris.COMPUTER, Morris.PLAYER, Morris.EMPTY, Morris.EMPTY],
    turn: Morris.PLAYER,
  });
  const next = Morris.applyMove(game, { from: 4, to: 3 });

  assert.strictEqual(next.status, '승리');
  assert.match(next.message, /승리/);
}

function testComputerPrefersAnImmediateWinningMove() {
  const game = Morris.createGame({
    board: [Morris.COMPUTER, Morris.COMPUTER, Morris.EMPTY, Morris.PLAYER, Morris.PLAYER, Morris.EMPTY, Morris.EMPTY, Morris.PLAYER, Morris.EMPTY],
    turn: Morris.COMPUTER,
  });

  assert.deepStrictEqual(Morris.chooseComputerMove(game), { to: 2 });
}

testStartsWithAnEmptyBoardAndPlacementPhase();
testPlacesTokensUntilEachPlayerHasThree();
testMovesOnlyToAnAdjacentEmptyPointAfterPlacement();
testDeclaresVictoryForThreeInARow();
testComputerPrefersAnImmediateWinningMove();

console.log('세 남자 모리스 로직 테스트 통과');
