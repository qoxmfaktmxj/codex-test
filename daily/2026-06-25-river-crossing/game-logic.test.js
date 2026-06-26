const assert = require('assert');
const RiverCrossing = require('./game-logic');

function testCreateGameStartsOnLeftBank() {
  const game = RiverCrossing.createGame();

  assert.strictEqual(game.status, '진행 중');
  assert.strictEqual(game.moves, 0);
  assert.strictEqual(game.message, '농부와 짐을 모두 오른쪽 강가로 옮기세요.');
  assert.deepStrictEqual(game.positions, {
    farmer: 'left',
    wolf: 'left',
    goat: 'left',
    cabbage: 'left',
  });
  assert.deepStrictEqual(RiverCrossing.getItemsOnSide(game, 'left'), ['farmer', 'wolf', 'goat', 'cabbage']);
  assert.deepStrictEqual(RiverCrossing.getItemsOnSide(game, 'right'), []);
}

function testBlocksDangerousFirstTrips() {
  const game = RiverCrossing.createGame();
  const wolfTrip = RiverCrossing.crossRiver(game, 'wolf');
  const cabbageTrip = RiverCrossing.crossRiver(game, 'cabbage');

  assert.strictEqual(wolfTrip.moves, 0);
  assert.strictEqual(wolfTrip.positions.wolf, 'left');
  assert.strictEqual(wolfTrip.message, '농부가 없으면 염소가 양배추를 먹습니다.');

  assert.strictEqual(cabbageTrip.moves, 0);
  assert.strictEqual(cabbageTrip.positions.cabbage, 'left');
  assert.strictEqual(cabbageTrip.message, '농부가 없으면 늑대가 염소를 잡아먹습니다.');
}

function testCannotCarryItemFromOtherBank() {
  const game = RiverCrossing.crossRiver(RiverCrossing.createGame(), 'goat');
  const blocked = RiverCrossing.crossRiver(game, 'wolf');

  assert.strictEqual(blocked.moves, 1);
  assert.deepStrictEqual(blocked.positions, game.positions);
  assert.strictEqual(blocked.message, '같은 강가에 있는 짐만 배에 태울 수 있습니다.');
}

function testAllowsFarmerToCrossAloneWhenSafe() {
  const withGoatAcross = RiverCrossing.crossRiver(RiverCrossing.createGame(), 'goat');
  const farmerBack = RiverCrossing.crossRiver(withGoatAcross);

  assert.strictEqual(farmerBack.moves, 2);
  assert.strictEqual(farmerBack.positions.farmer, 'left');
  assert.strictEqual(farmerBack.positions.goat, 'right');
  assert.strictEqual(farmerBack.message, '농부가 혼자 왼쪽 강가로 건넜습니다.');
}

function testWinningSequence() {
  const game = ['goat', null, 'wolf', 'goat', 'cabbage', null, 'goat']
    .reduce((current, passenger) => RiverCrossing.crossRiver(current, passenger), RiverCrossing.createGame());

  assert.strictEqual(game.status, '성공');
  assert.strictEqual(game.moves, 7);
  assert.strictEqual(RiverCrossing.isWin(game), true);
  assert.deepStrictEqual(game.positions, {
    farmer: 'right',
    wolf: 'right',
    goat: 'right',
    cabbage: 'right',
  });
  assert.strictEqual(game.message, '성공입니다. 모두 안전하게 강을 건넜습니다!');
}

testCreateGameStartsOnLeftBank();
testBlocksDangerousFirstTrips();
testCannotCarryItemFromOtherBank();
testAllowsFarmerToCrossAloneWhenSafe();
testWinningSequence();

console.log('강 건너기 로직 테스트 통과');
