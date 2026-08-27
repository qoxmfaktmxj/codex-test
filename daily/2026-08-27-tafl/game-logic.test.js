const assert = require('assert');
const Tafl = require('./game-logic');

function testCreatesTheStartingBoard() {
  const state = Tafl.createState();
  assert.strictEqual(state.board.length, 9);
  assert.strictEqual(state.board[4][4], 'king');
  assert.strictEqual(state.turn, 'defenders');
  assert.strictEqual(state.board.flat().filter((piece) => piece === 'attacker').length, 16);
}

function testMovesOnlyInStraightClearLines() {
  const state = Tafl.createState({
    board: Tafl.emptyBoard([[4, 4, 'king'], [4, 1, 'defender']]),
    turn: 'defenders',
  });
  const moved = Tafl.movePiece(state, 4, 1, 4, 3);
  assert.strictEqual(moved.board[4][1], null);
  assert.strictEqual(moved.board[4][3], 'defender');
  assert.strictEqual(moved.turn, 'attackers');
  assert.throws(() => Tafl.movePiece(state, 4, 1, 5, 2), /직선/);
  assert.throws(() => Tafl.movePiece(state, 4, 1, 4, 5), /지나갈 수/);
}

function testCapturesEnemyBetweenTwoFriendlyPieces() {
  const state = Tafl.createState({
    board: Tafl.emptyBoard([[4, 2, 'attacker'], [4, 4, 'defender'], [4, 5, 'attacker']]),
    turn: 'attackers',
  });
  const moved = Tafl.movePiece(state, 4, 2, 4, 3);
  assert.strictEqual(moved.board[4][4], null);
  assert.strictEqual(moved.captured, 1);
}

function testKingEscapesFromACornerAndAttackersWinWhenKingIsSurrounded() {
  const escape = Tafl.createState({
    board: Tafl.emptyBoard([[0, 2, 'king']]),
    turn: 'defenders',
  });
  assert.strictEqual(Tafl.getStatus(Tafl.movePiece(escape, 0, 2, 0, 0)), 'defenders-won');

  const trapped = Tafl.createState({
    board: Tafl.emptyBoard([[4, 4, 'king'], [3, 4, 'attacker'], [5, 4, 'attacker'], [4, 3, 'attacker'], [4, 5, 'attacker']]),
    turn: 'attackers',
  });
  assert.strictEqual(Tafl.getStatus(trapped), 'attackers-won');
}

function testOnlyTheKingCanUseSpecialSquaresAndTeamsTakeTurns() {
  const state = Tafl.createState({ board: Tafl.emptyBoard([[4, 1, 'defender'], [0, 1, 'attacker']]), turn: 'defenders' });
  assert.throws(() => Tafl.movePiece(state, 4, 1, 4, 4), /왕만/);
  assert.throws(() => Tafl.movePiece(state, 0, 1, 0, 2), /상대 말/);
  const kingMove = Tafl.movePiece(Tafl.createState({ board: Tafl.emptyBoard([[0, 2, 'king']]), turn: 'defenders' }), 0, 2, 0, 0);
  assert.strictEqual(kingMove.board[0][0], 'king');
}

testCreatesTheStartingBoard();
testMovesOnlyInStraightClearLines();
testCapturesEnemyBetweenTwoFriendlyPieces();
testKingEscapesFromACornerAndAttackersWinWhenKingIsSurrounded();
testOnlyTheKingCanUseSpecialSquaresAndTeamsTakeTurns();
console.log('타플 로직 테스트 통과');
