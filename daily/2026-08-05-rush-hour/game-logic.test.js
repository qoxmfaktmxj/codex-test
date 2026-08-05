const assert = require('assert');
const RushHour = require('./game-logic');

function testBuildsTheDefaultPuzzleWithABlockingCar() {
  const game = RushHour.createGame();

  assert.strictEqual(game.vehicles.length, 8);
  assert.strictEqual(game.turns, 0);
  assert.strictEqual(game.status, '진행 중');
  assert.deepStrictEqual(RushHour.legalDistances(game, 'red'), []);
}

function testSolvesTheDefaultPuzzleByClearingTheExitLane() {
  let game = RushHour.createGame();

  game = RushHour.moveVehicle(game, 'gray', 3);
  game = RushHour.moveVehicle(game, 'blue', 3);
  assert.deepStrictEqual(RushHour.legalDistances(game, 'red'), [1, 2, 3, 4]);
  game = RushHour.moveVehicle(game, 'red', 4);

  assert.strictEqual(game.status, '탈출 성공');
  assert.strictEqual(game.turns, 3);
}

function testOnlyMovesAlongAVehiclesDirectionThroughEmptySpaces() {
  const game = RushHour.createGame({ vehicles: [
    { id: 'red', row: 2, column: 0, length: 2, direction: '가로' },
    { id: 'blue', row: 0, column: 3, length: 3, direction: '세로' },
  ] });

  assert.deepStrictEqual(RushHour.legalDistances(game, 'red'), [1]);
  assert.deepStrictEqual(RushHour.legalDistances(game, 'blue'), [1, 2, 3]);
  assert.throws(() => RushHour.moveVehicle(game, 'red', -1), /움직일 수 없습니다/);
  assert.throws(() => RushHour.moveVehicle(game, 'blue', 4), /움직일 수 없습니다/);
}

function testUpdatesOnlyTheChosenVehicleAndCountsATurn() {
  const game = RushHour.createGame({ vehicles: [
    { id: 'red', row: 2, column: 0, length: 2, direction: '가로' },
    { id: 'blue', row: 0, column: 3, length: 3, direction: '세로' },
  ] });
  const next = RushHour.moveVehicle(game, 'red', 1);

  assert.strictEqual(next.vehicles.find((vehicle) => vehicle.id === 'red').column, 1);
  assert.strictEqual(next.vehicles.find((vehicle) => vehicle.id === 'blue').row, 0);
  assert.strictEqual(next.turns, 1);
  assert.strictEqual(next.status, '진행 중');
}

function testRecognizesTheExitWhenTheRedCarReachesTheRightEdge() {
  const game = RushHour.createGame({ vehicles: [
    { id: 'red', row: 2, column: 2, length: 3, direction: '가로' },
    { id: 'blue', row: 0, column: 0, length: 2, direction: '세로' },
  ] });
  const next = RushHour.moveVehicle(game, 'red', 1);

  assert.strictEqual(next.status, '탈출 성공');
  assert.match(next.message, /탈출구/);
  assert.throws(() => RushHour.moveVehicle(next, 'blue', 1), /이미 끝난/);
}

function testRejectsOverlappingOrInvalidPuzzleData() {
  assert.throws(() => RushHour.createGame({ vehicles: [
    { id: 'red', row: 2, column: 0, length: 2, direction: '가로' },
    { id: 'blue', row: 2, column: 1, length: 2, direction: '세로' },
  ] }), /겹칩니다/);
  assert.throws(() => RushHour.createGame({ vehicles: [
    { id: 'red', row: 2, column: 0, length: 2, direction: '세로' },
  ] }), /빨간 자동차/);
}

testBuildsTheDefaultPuzzleWithABlockingCar();
testSolvesTheDefaultPuzzleByClearingTheExitLane();
testOnlyMovesAlongAVehiclesDirectionThroughEmptySpaces();
testUpdatesOnlyTheChosenVehicleAndCountsATurn();
testRecognizesTheExitWhenTheRedCarReachesTheRightEdge();
testRejectsOverlappingOrInvalidPuzzleData();

console.log('러시 아워 로직 테스트 통과');
