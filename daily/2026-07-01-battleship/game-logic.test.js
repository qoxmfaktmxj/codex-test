const assert = require('assert');
const Battleship = require('./game-logic');

function testCreateGameBuildsDeterministicFleet() {
  const game = Battleship.createGame();

  assert.strictEqual(game.size, 5);
  assert.strictEqual(game.status, '진행 중');
  assert.strictEqual(game.shotsLeft, 15);
  assert.strictEqual(game.hits, 0);
  assert.strictEqual(game.misses, 0);
  assert.strictEqual(game.remainingShipCells, 6);
  assert.strictEqual(game.message, '좌표를 골라 숨은 전함을 모두 찾으세요.');
  assert.deepStrictEqual(game.shots[0], [null, null, null, null, null]);
  assert.deepStrictEqual(game.fleet.map((ship) => ship.name), ['순양함', '구축함', '정찰정']);
}

function testHitMarksBoardAndConsumesShot() {
  const result = Battleship.fireAt(Battleship.createGame(), 0, 0);

  assert.strictEqual(result.shots[0][0], 'hit');
  assert.strictEqual(result.hits, 1);
  assert.strictEqual(result.misses, 0);
  assert.strictEqual(result.shotsLeft, 14);
  assert.strictEqual(result.message, '명중! 순양함 일부를 맞혔습니다. 남은 포탄은 14발입니다.');
}

function testMissConsumesShot() {
  const result = Battleship.fireAt(Battleship.createGame(), 1, 1);

  assert.strictEqual(result.shots[1][1], 'miss');
  assert.strictEqual(result.hits, 0);
  assert.strictEqual(result.misses, 1);
  assert.strictEqual(result.shotsLeft, 14);
  assert.strictEqual(result.message, '빗나갔습니다. 남은 포탄은 14발입니다.');
}

function testRepeatedShotDoesNotConsumeTurn() {
  const game = Battleship.fireAt(Battleship.createGame(), 1, 1);
  const result = Battleship.fireAt(game, 1, 1);

  assert.deepStrictEqual(result.shots, game.shots);
  assert.strictEqual(result.misses, 1);
  assert.strictEqual(result.shotsLeft, 14);
  assert.strictEqual(result.message, '이미 확인한 칸입니다. 다른 좌표를 고르세요.');
}

function testSinkingShipChangesMessage() {
  const game = [[0, 0], [0, 1]].reduce((currentGame, [row, col]) => Battleship.fireAt(currentGame, row, col), Battleship.createGame());
  const result = Battleship.fireAt(game, 0, 2);

  assert.strictEqual(result.hits, 3);
  assert.strictEqual(result.fleet[0].status, '격침');
  assert.strictEqual(result.message, '순양함 격침! 남은 전함 칸은 3칸입니다.');
}

function testAllShipsSunkWinsGame() {
  const targets = [[0, 0], [0, 1], [0, 2], [2, 3], [3, 3], [4, 0]];
  const result = targets.reduce((currentGame, [row, col]) => Battleship.fireAt(currentGame, row, col), Battleship.createGame());

  assert.strictEqual(result.status, '승리');
  assert.strictEqual(result.remainingShipCells, 0);
  assert.strictEqual(result.message, '승리! 숨은 전함을 모두 격침했습니다.');
}

function testRunningOutOfShotsLosesGame() {
  const misses = [[1, 1], [1, 2], [1, 3], [1, 4], [2, 0], [2, 1], [2, 2], [2, 4], [3, 0], [3, 1], [3, 2], [3, 4], [4, 1], [4, 2], [4, 3]];
  const result = misses.reduce((currentGame, [row, col]) => Battleship.fireAt(currentGame, row, col), Battleship.createGame());

  assert.strictEqual(result.status, '패배');
  assert.strictEqual(result.shotsLeft, 0);
  assert.strictEqual(result.message, '패배. 포탄을 모두 썼습니다. 새 판에 도전하세요.');
}

function testLastHitCanStillLoseWhenShipsRemain() {
  const game = Battleship.createGame({ shotsLeft: 1 });
  const result = Battleship.fireAt(game, 0, 0);

  assert.strictEqual(result.status, '패배');
  assert.strictEqual(result.hits, 1);
  assert.strictEqual(result.remainingShipCells, 5);
  assert.strictEqual(result.message, '패배. 포탄을 모두 썼습니다. 새 판에 도전하세요.');
}

function testFinishedGameDoesNotChange() {
  const targets = [[0, 0], [0, 1], [0, 2], [2, 3], [3, 3], [4, 0]];
  const game = targets.reduce((currentGame, [row, col]) => Battleship.fireAt(currentGame, row, col), Battleship.createGame());
  const result = Battleship.fireAt(game, 1, 1);

  assert.deepStrictEqual(result.shots, game.shots);
  assert.strictEqual(result.status, '승리');
  assert.strictEqual(result.message, '이미 끝난 판입니다. 새 판을 시작하세요.');
}

function testInvalidPositionIsRejected() {
  assert.throws(() => Battleship.fireAt(Battleship.createGame(), 5, 0), /격자 안의 좌표/);
}

testCreateGameBuildsDeterministicFleet();
testHitMarksBoardAndConsumesShot();
testMissConsumesShot();
testRepeatedShotDoesNotConsumeTurn();
testSinkingShipChangesMessage();
testAllShipsSunkWinsGame();
testRunningOutOfShotsLosesGame();
testLastHitCanStillLoseWhenShipsRemain();
testFinishedGameDoesNotChange();
testInvalidPositionIsRejected();

console.log('전함 찾기 로직 테스트 통과');
