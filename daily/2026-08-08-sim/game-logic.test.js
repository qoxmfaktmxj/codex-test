const assert = require('assert');
const Sim = require('./game-logic');

function testCreatesSixPointBoard() {
  const game = Sim.createGame();
  assert.strictEqual(game.points, 6);
  assert.strictEqual(game.turn, Sim.PLAYER);
  assert.strictEqual(Sim.getAvailableMoves(game).length, 15);
}

function testColorsAnEdgeAndChangesTurn() {
  const game = Sim.playMove(Sim.createGame(), 4, 1);
  assert.strictEqual(Sim.getEdgeColor(game, 1, 4), Sim.PLAYER);
  assert.strictEqual(game.turn, Sim.COMPUTER);
  assert.strictEqual(game.status, '진행 중');
}

function testFindsASameColorTriangle() {
  let game = Sim.createGame();
  game = Sim.playMove(game, 0, 1);
  game = Sim.playMove(game, 4, 5);
  game = Sim.playMove(game, 1, 2);
  game = Sim.playMove(game, 3, 5);
  game = Sim.playMove(game, 0, 2);
  assert.strictEqual(game.status, '종료');
  assert.strictEqual(game.winner, Sim.COMPUTER);
  assert.match(game.message, /삼각형/);
}

function testRejectsUsedEdgesAndMovesAfterEnd() {
  let game = Sim.playMove(Sim.createGame(), 0, 1);
  assert.throws(() => Sim.playMove(game, 1, 0), /이미 색칠/);
  game = Sim.playMove(game, 4, 5);
  game = Sim.playMove(game, 1, 2);
  game = Sim.playMove(game, 3, 5);
  game = Sim.playMove(game, 0, 2);
  assert.throws(() => Sim.playMove(game, 2, 3), /끝난/);
}

testCreatesSixPointBoard();
testColorsAnEdgeAndChangesTurn();
testFindsASameColorTriangle();
testRejectsUsedEdgesAndMovesAfterEnd();

console.log('심 로직 테스트 통과');
