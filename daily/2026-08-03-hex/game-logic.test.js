const assert = require('assert');
const Hex = require('./game-logic');

function testStartsWithAnEmptySevenBySevenBoard() {
  const game = Hex.createGame();

  assert.strictEqual(game.board.length, 49);
  assert.ok(game.board.every((cell) => cell === Hex.EMPTY));
  assert.strictEqual(game.turn, Hex.PLAYER);
  assert.strictEqual(game.status, '진행 중');
}

function testPlacesOnlyOnAnEmptyCellAndChangesTurn() {
  const game = Hex.createGame();
  const next = Hex.applyMove(game, 24);

  assert.strictEqual(next.board[24], Hex.PLAYER);
  assert.strictEqual(next.turn, Hex.COMPUTER);
  assert.throws(() => Hex.applyMove(next, 24), /빈 칸/);
}

function testFindsVerticalConnectionForThePlayer() {
  const board = Array(49).fill(Hex.EMPTY);
  [3, 10, 17, 24, 31, 38, 45].forEach((index) => { board[index] = Hex.PLAYER; });
  const game = Hex.createGame({ board, turn: Hex.COMPUTER });

  assert.strictEqual(game.status, '승리');
  assert.match(game.message, /파란 길/);
}

function testFindsHorizontalConnectionForTheComputer() {
  const board = Array(49).fill(Hex.EMPTY);
  [21, 22, 23, 24, 25, 26, 27].forEach((index) => { board[index] = Hex.COMPUTER; });
  const game = Hex.createGame({ board, turn: Hex.PLAYER });

  assert.strictEqual(game.status, '패배');
  assert.match(game.message, /빨간 길/);
}

function testComputerTakesAnImmediateWinningMove() {
  const board = Array(49).fill(Hex.EMPTY);
  [21, 22, 23, 24, 25, 26].forEach((index) => { board[index] = Hex.COMPUTER; });
  const game = Hex.createGame({ board, turn: Hex.COMPUTER });

  const move = Hex.chooseComputerMove(game);
  assert.strictEqual(Hex.applyMove(game, move).status, '패배');
}

function testComputerBlocksThePlayerConnectionBeforeChoosingCenter() {
  const board = Array(49).fill(Hex.EMPTY);
  [0, 7, 14, 21, 28, 35].forEach((index) => { board[index] = Hex.PLAYER; });
  const game = Hex.createGame({ board, turn: Hex.COMPUTER });

  assert.strictEqual(Hex.chooseComputerMove(game), 42);
}

testStartsWithAnEmptySevenBySevenBoard();
testPlacesOnlyOnAnEmptyCellAndChangesTurn();
testFindsVerticalConnectionForThePlayer();
testFindsHorizontalConnectionForTheComputer();
testComputerTakesAnImmediateWinningMove();
testComputerBlocksThePlayerConnectionBeforeChoosingCenter();

console.log('헥스 로직 테스트 통과');
