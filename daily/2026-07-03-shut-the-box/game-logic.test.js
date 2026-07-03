const assert = require('assert');
const ShutTheBox = require('./game-logic');

function testCreateGameStartsWithAllTilesOpen() {
  const game = ShutTheBox.createGame();

  assert.deepStrictEqual(game.tiles, [1, 2, 3, 4, 5, 6, 7, 8, 9]);
  assert.deepStrictEqual(game.closedTiles, []);
  assert.deepStrictEqual(game.dice, [1, 1]);
  assert.strictEqual(game.rollTotal, 2);
  assert.strictEqual(game.phase, '굴리기 대기');
  assert.strictEqual(game.status, '진행 중');
  assert.strictEqual(game.score, 45);
  assert.strictEqual(game.message, '주사위를 굴리고 합계와 같은 열린 숫자를 닫으세요.');
}

function testRollDiceUsesProvidedRandomSource() {
  const game = ShutTheBox.rollDice(ShutTheBox.createGame(), () => 0.99);

  assert.deepStrictEqual(game.dice, [6, 6]);
  assert.strictEqual(game.rollTotal, 12);
  assert.strictEqual(game.phase, '선택 중');
  assert.strictEqual(game.message, '12가 나왔습니다. 합계 12가 되도록 열린 숫자를 고르세요.');
}

function testCloseTilesWhenSelectionMatchesRoll() {
  const game = ShutTheBox.createGame({ dice: [2, 5] });
  const result = ShutTheBox.closeTiles(game, [2, 5]);

  assert.deepStrictEqual(result.closedTiles, [2, 5]);
  assert.deepStrictEqual(result.tiles, [1, 3, 4, 6, 7, 8, 9]);
  assert.strictEqual(result.score, 38);
  assert.strictEqual(result.phase, '굴리기 대기');
  assert.strictEqual(result.status, '진행 중');
  assert.strictEqual(result.message, '2, 5를 닫았습니다. 다시 주사위를 굴리세요.');
}

function testCannotCloseBeforeRolling() {
  const result = ShutTheBox.closeTiles(ShutTheBox.createGame(), [2]);

  assert.deepStrictEqual(result.closedTiles, []);
  assert.strictEqual(result.phase, '굴리기 대기');
  assert.strictEqual(result.message, '먼저 주사위를 굴리세요.');
}

function testCannotRollAgainBeforeClosing() {
  const game = ShutTheBox.createGame({ dice: [2, 5] });
  const result = ShutTheBox.rollDice(game, () => 0);

  assert.deepStrictEqual(result.dice, [2, 5]);
  assert.strictEqual(result.phase, '선택 중');
  assert.strictEqual(result.message, '먼저 주사위 합계와 같은 숫자를 닫으세요.');
}

function testRejectsSelectionThatDoesNotMatchRoll() {
  const game = ShutTheBox.createGame({ dice: [3, 4] });
  const result = ShutTheBox.closeTiles(game, [1, 2]);

  assert.deepStrictEqual(result.closedTiles, []);
  assert.strictEqual(result.score, 45);
  assert.strictEqual(result.message, '고른 숫자의 합이 주사위 합계와 같아야 합니다.');
}

function testRejectsAlreadyClosedTile() {
  const game = ShutTheBox.createGame({ dice: [1, 4], closedTiles: [4] });
  const result = ShutTheBox.closeTiles(game, [1, 4]);

  assert.deepStrictEqual(result.closedTiles, [4]);
  assert.strictEqual(result.message, '열려 있는 숫자만 고를 수 있습니다.');
}

function testFindsAvailableCombination() {
  const game = ShutTheBox.createGame({ closedTiles: [1, 2, 3, 4, 5, 6, 7], dice: [4, 5] });

  assert.strictEqual(ShutTheBox.hasMove(game), true);
  assert.deepStrictEqual(ShutTheBox.findCombination(game), [9]);
}

function testDetectsBustWhenNoCombinationExists() {
  const game = ShutTheBox.createGame({ closedTiles: [1, 2, 3, 4, 5, 6, 7], dice: [2, 5] });
  const result = ShutTheBox.checkRoll(game);

  assert.strictEqual(ShutTheBox.hasMove(game), false);
  assert.strictEqual(result.status, '실패');
  assert.strictEqual(result.score, 17);
  assert.strictEqual(result.message, '닫을 수 있는 조합이 없습니다. 남은 점수는 17점입니다.');
}

function testClosingLastTilesWins() {
  const game = ShutTheBox.createGame({ closedTiles: [1, 2, 3, 4, 5, 6, 7, 8], dice: [4, 5] });
  const result = ShutTheBox.closeTiles(game, [9]);

  assert.deepStrictEqual(result.tiles, []);
  assert.strictEqual(result.score, 0);
  assert.strictEqual(result.status, '성공');
  assert.strictEqual(result.message, '모든 숫자를 닫았습니다. 완벽한 승리입니다!');
}

testCreateGameStartsWithAllTilesOpen();
testRollDiceUsesProvidedRandomSource();
testCloseTilesWhenSelectionMatchesRoll();
testCannotCloseBeforeRolling();
testCannotRollAgainBeforeClosing();
testRejectsSelectionThatDoesNotMatchRoll();
testRejectsAlreadyClosedTile();
testFindsAvailableCombination();
testDetectsBustWhenNoCombinationExists();
testClosingLastTilesWins();

console.log('상자 닫기 로직 테스트 통과');
