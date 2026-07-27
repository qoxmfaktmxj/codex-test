const assert = require('assert');
const FoxAndHounds = require('./game-logic');

function testCreateGameSetsClassicStart() {
  const game = FoxAndHounds.createGame();

  assert.strictEqual(game.turn, 'FOX');
  assert.strictEqual(game.status, '진행 중');
  assert.deepStrictEqual(game.fox, { row: 7, col: 0 });
  assert.deepStrictEqual(game.hounds, [
    { row: 0, col: 1 },
    { row: 0, col: 3 },
    { row: 0, col: 5 },
    { row: 0, col: 7 },
  ]);
  assert.strictEqual(game.message, '여우를 대각선 한 칸으로 움직이세요.');
}

function testFoxMovesDiagonallyToEmptyDarkSquare() {
  const game = FoxAndHounds.createGame();
  const next = FoxAndHounds.moveFox(game, { row: 6, col: 1 });

  assert.deepStrictEqual(next.fox, { row: 6, col: 1 });
  assert.strictEqual(next.turn, 'HOUNDS');
  assert.strictEqual(next.lastMove.piece, 'FOX');
  assert.throws(
    () => FoxAndHounds.moveFox(next, { row: 5, col: 1 }),
    /여우 차례가 아닙니다/
  );
}

function testFoxCannotMoveOntoHoundOrLightSquare() {
  const game = FoxAndHounds.createGame({
    fox: { row: 2, col: 2 },
    hounds: [{ row: 1, col: 1 }],
  });

  assert.throws(() => FoxAndHounds.moveFox(game, { row: 1, col: 1 }), /빈 어두운 칸/);
  assert.throws(() => FoxAndHounds.moveFox(game, { row: 1, col: 2 }), /대각선 한 칸/);
}

function testFoxWinsOnTopRow() {
  const game = FoxAndHounds.createGame({
    fox: { row: 1, col: 2 },
    hounds: [
      { row: 2, col: 1 },
      { row: 2, col: 3 },
      { row: 4, col: 1 },
      { row: 4, col: 3 },
    ],
  });

  const next = FoxAndHounds.moveFox(game, { row: 0, col: 1 });

  assert.strictEqual(next.status, '승리');
  assert.strictEqual(next.message, '여우가 사냥개 뒤를 빠져나갔습니다. 승리!');
}

function testHoundsMoveOnlyForwardDiagonally() {
  const game = FoxAndHounds.createGame({ turn: 'HOUNDS' });
  const next = FoxAndHounds.moveHound(game, 0, { row: 1, col: 0 });

  assert.deepStrictEqual(next.hounds[0], { row: 1, col: 0 });
  assert.strictEqual(next.turn, 'FOX');
  assert.throws(
    () => FoxAndHounds.moveHound(next, 0, { row: 0, col: 1 }),
    /사냥개 차례가 아닙니다/
  );
}

function testHoundsWinWhenFoxIsTrapped() {
  const game = FoxAndHounds.createGame({
    turn: 'HOUNDS',
    fox: { row: 4, col: 3 },
    hounds: [
      { row: 2, col: 1 },
      { row: 3, col: 4 },
      { row: 5, col: 2 },
      { row: 5, col: 4 },
    ],
  });

  const next = FoxAndHounds.moveHound(game, 0, { row: 3, col: 2 });

  assert.strictEqual(next.status, '패배');
  assert.strictEqual(next.message, '여우가 움직일 곳이 없습니다. 패배.');
}

function testComputerChoosesImmediateTrap() {
  const game = FoxAndHounds.createGame({
    turn: 'HOUNDS',
    fox: { row: 4, col: 3 },
    hounds: [
      { row: 2, col: 1 },
      { row: 3, col: 4 },
      { row: 5, col: 2 },
      { row: 5, col: 4 },
    ],
  });

  const next = FoxAndHounds.playComputerTurn(game);

  assert.strictEqual(next.status, '패배');
  assert.deepStrictEqual(next.hounds[0], { row: 3, col: 2 });
}

testCreateGameSetsClassicStart();
testFoxMovesDiagonallyToEmptyDarkSquare();
testFoxCannotMoveOntoHoundOrLightSquare();
testFoxWinsOnTopRow();
testHoundsMoveOnlyForwardDiagonally();
testHoundsWinWhenFoxIsTrapped();
testComputerChoosesImmediateTrap();

console.log('여우와 사냥개 로직 테스트 통과');
