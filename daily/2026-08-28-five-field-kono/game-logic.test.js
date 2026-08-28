const assert = require('assert');
const Kono = require('./game-logic');

function testCreatesTheStartingBoard() {
  const state = Kono.createState();
  assert.strictEqual(state.board.length, 5);
  assert.strictEqual(state.board[0][0], 'blue');
  assert.strictEqual(state.board[4][4], 'orange');
  assert.strictEqual(state.turn, 'blue');
  assert.strictEqual(state.board.flat().filter((piece) => piece === 'blue').length, 7);
  assert.strictEqual(state.board.flat().filter((piece) => piece === 'orange').length, 7);
}

function testMovesOneSpaceDiagonallyToAnEmptySquare() {
  const state = Kono.createState({
    board: Kono.emptyBoard([[2, 2, 'blue'], [0, 0, 'orange']]),
    turn: 'blue',
  });
  const moved = Kono.movePiece(state, 2, 2, 1, 1);
  assert.strictEqual(moved.board[2][2], null);
  assert.strictEqual(moved.board[1][1], 'blue');
  assert.strictEqual(moved.turn, 'orange');
  assert.throws(() => Kono.movePiece(state, 2, 2, 2, 3), /대각선/);
  assert.throws(() => Kono.movePiece(state, 2, 2, 0, 4), /한 칸/);
}

function testRejectsOccupiedSquaresAndOpponentsPieces() {
  const state = Kono.createState({
    board: Kono.emptyBoard([[2, 2, 'blue'], [1, 1, 'orange']]),
    turn: 'blue',
  });
  assert.throws(() => Kono.movePiece(state, 2, 2, 1, 1), /비어 있지/);
  assert.throws(() => Kono.movePiece(state, 1, 1, 2, 0), /상대 말/);
}

function testDeclaresVictoryWhenAllPiecesReachTheOpposingHome() {
  const blueHome = Kono.ORANGE_HOME.map(([row, column]) => [row, column, 'blue']);
  const orangeHome = Kono.BLUE_HOME.map(([row, column]) => [row, column, 'orange']);
  assert.strictEqual(Kono.getStatus(Kono.createState({ board: Kono.emptyBoard([...blueHome, ...orangeHome]), turn: 'blue' })), 'blue-won');
  assert.strictEqual(Kono.getStatus(Kono.createState({ board: Kono.emptyBoard([...blueHome.slice(0, 6), [2, 2, 'blue']]), turn: 'blue' })), 'playing');
}

testCreatesTheStartingBoard();
testMovesOneSpaceDiagonallyToAnEmptySquare();
testRejectsOccupiedSquaresAndOpponentsPieces();
testDeclaresVictoryWhenAllPiecesReachTheOpposingHome();
console.log('다섯밭 코노 로직 테스트 통과');
