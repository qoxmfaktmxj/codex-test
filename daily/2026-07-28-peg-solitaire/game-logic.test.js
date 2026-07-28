const assert = require('assert');
const PegSolitaire = require('./game-logic');

function emptyBoard() {
  return PegSolitaire.createGame().board.map((row) => row.map((cell) => (cell === PegSolitaire.PEG ? PegSolitaire.EMPTY : cell)));
}

function testCreatesClassicBoardWithEmptyCenter() {
  const game = PegSolitaire.createGame();

  assert.strictEqual(game.size, 7);
  assert.strictEqual(game.board[0][0], PegSolitaire.INVALID);
  assert.strictEqual(game.board[3][3], PegSolitaire.EMPTY);
  assert.strictEqual(game.remaining, 32);
  assert.strictEqual(game.status, '진행 중');
}

function testJumpsOverPegIntoEmptySpace() {
  const game = PegSolitaire.createGame();
  const next = PegSolitaire.movePeg(game, 3, 1, 3, 3);

  assert.strictEqual(next.board[3][1], PegSolitaire.EMPTY);
  assert.strictEqual(next.board[3][2], PegSolitaire.EMPTY);
  assert.strictEqual(next.board[3][3], PegSolitaire.PEG);
  assert.strictEqual(next.remaining, 31);
}

function testInitialBoardCanBeSolved() {
  const solution = [
    [[1, 3], [3, 3]], [[2, 1], [2, 3]], [[0, 2], [2, 2]], [[0, 4], [0, 2]],
    [[2, 3], [2, 1]], [[2, 0], [2, 2]], [[2, 4], [0, 4]], [[2, 6], [2, 4]],
    [[3, 2], [1, 2]], [[0, 2], [2, 2]], [[3, 0], [3, 2]], [[3, 2], [1, 2]],
    [[3, 4], [1, 4]], [[0, 4], [2, 4]], [[3, 6], [3, 4]], [[3, 4], [1, 4]],
    [[5, 2], [3, 2]], [[4, 0], [4, 2]], [[4, 2], [2, 2]], [[1, 2], [3, 2]],
    [[3, 2], [3, 4]], [[4, 4], [2, 4]], [[6, 4], [4, 4]], [[1, 4], [3, 4]],
    [[3, 4], [5, 4]], [[4, 6], [4, 4]], [[4, 3], [4, 5]], [[6, 2], [6, 4]],
    [[6, 4], [4, 4]], [[4, 5], [4, 3]], [[5, 3], [3, 3]],
  ];
  let game = PegSolitaire.createGame();
  solution.forEach(([[fromRow, fromCol], [toRow, toCol]]) => {
    game = PegSolitaire.movePeg(game, fromRow, fromCol, toRow, toCol);
  });

  assert.strictEqual(game.remaining, 1);
  assert.strictEqual(game.status, '성공');
}

function testWinsWithOnePegLeft() {
  const board = emptyBoard();
  board[3][2] = PegSolitaire.PEG;
  board[3][3] = PegSolitaire.PEG;
  const game = PegSolitaire.createGame({ board });
  const next = PegSolitaire.movePeg(game, 3, 2, 3, 4);

  assert.strictEqual(next.remaining, 1);
  assert.strictEqual(next.status, '성공');
  assert.match(next.message, /성공/);
}

function testDetectsWhenNoFurtherJumpExists() {
  const board = emptyBoard();
  board[2][2] = PegSolitaire.PEG;
  board[3][3] = PegSolitaire.PEG;
  const game = PegSolitaire.createGame({ board });

  assert.strictEqual(game.status, '종료');
  assert.match(game.message, /더 이상 움직일 수 없습니다/);
}

function testRejectsInvalidMoves() {
  const game = PegSolitaire.createGame();

  assert.throws(() => PegSolitaire.movePeg(game, 0, 0, 2, 0), /사용할 수 없는 칸/);
  assert.throws(() => PegSolitaire.movePeg(game, 3, 1, 3, 2), /두 칸/);
  assert.throws(() => PegSolitaire.movePeg(game, 3, 1, 2, 2), /가로 또는 세로/);
  assert.throws(() => PegSolitaire.movePeg(game, 3, 3, 3, 5), /시작 칸에 말이 없습니다/);
}

testCreatesClassicBoardWithEmptyCenter();
testJumpsOverPegIntoEmptySpace();
testInitialBoardCanBeSolved();
testWinsWithOnePegLeft();
testDetectsWhenNoFurtherJumpExists();
testRejectsInvalidMoves();

console.log('페그 솔리테어 로직 테스트 통과');
