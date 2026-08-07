const assert = require('assert');
const Domineering = require('./game-logic');

function testCreatesAnEmptyBoard() {
  const game = Domineering.createGame(4);
  assert.strictEqual(game.board.length, 4);
  assert.strictEqual(game.turn, '가로');
  assert.strictEqual(Domineering.getLegalMoves(game.board, '가로').length, 12);
  assert.strictEqual(Domineering.getLegalMoves(game.board, '세로').length, 12);
}

function testPlacesEachPlayersDominoAndChangesTurn() {
  let game = Domineering.createGame(3);
  game = Domineering.placeDomino(game, 0, 0);
  assert.strictEqual(game.board[0][0], '가로');
  assert.strictEqual(game.board[0][1], '가로');
  assert.strictEqual(game.turn, '세로');
  game = Domineering.placeDomino(game, 0, 2);
  assert.strictEqual(game.board[0][2], '세로');
  assert.strictEqual(game.board[1][2], '세로');
  assert.strictEqual(game.turn, '가로');
}

function testRejectsOccupiedOrOutOfBoundsPlacements() {
  let game = Domineering.createGame(3);
  game = Domineering.placeDomino(game, 0, 0);
  assert.throws(() => Domineering.placeDomino(game, 0, 0), /놓을 수/);
  assert.throws(() => Domineering.placeDomino(game, 2, 2), /놓을 수/);
}

function testWinsWhenTheNextPlayerCannotPlace() {
  const game = Domineering.placeDomino(Domineering.createGame(2), 0, 0);
  assert.strictEqual(game.status, '종료');
  assert.strictEqual(game.winner, '가로');
  assert.match(game.message, /가로/);
}

testCreatesAnEmptyBoard();
testPlacesEachPlayersDominoAndChangesTurn();
testRejectsOccupiedOrOutOfBoundsPlacements();
testWinsWhenTheNextPlayerCannotPlace();

console.log('도미네어링 로직 테스트 통과');
