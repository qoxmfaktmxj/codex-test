const assert = require('assert');
const Goose = require('./game-logic');

function testCreateGameStartsAtFirstTurn() {
  const game = Goose.createGame();

  assert.deepStrictEqual(game.players, [
    { name: '나', position: 0, waiting: 0 },
    { name: '컴퓨터', position: 0, waiting: 0 },
  ]);
  assert.strictEqual(game.currentPlayer, 0);
  assert.strictEqual(game.turns, 0);
  assert.strictEqual(game.status, '진행 중');
  assert.strictEqual(game.message, '주사위를 굴려 32번 칸에 정확히 도착하세요.');
}

function testRollDiceUsesTwoFourSidedDice() {
  const roll = Goose.rollDice(() => 0.99);

  assert.deepStrictEqual(roll.dice, [4, 4]);
  assert.strictEqual(roll.total, 8);
}

function testGooseSquareMovesAgainBySameRoll() {
  const game = Goose.createGame();
  const next = Goose.playTurn(game, [2, 3]);

  assert.strictEqual(next.players[0].position, 10);
  assert.strictEqual(next.currentPlayer, 1);
  assert.strictEqual(next.message, '나: 5칸 이동, 거위 칸 보너스로 5칸 더 전진했습니다.');
}

function testBridgeJumpsForward() {
  const game = Goose.createGame();
  const next = Goose.playTurn(game, [3, 3]);

  assert.strictEqual(next.players[0].position, 12);
  assert.strictEqual(next.message, '나: 6칸 이동, 다리를 건너 12번 칸으로 이동했습니다.');
}

function testMazeSendsPlayerBack() {
  const game = Goose.createGame({
    players: [
      { name: '나', position: 18, waiting: 0 },
      { name: '컴퓨터', position: 0, waiting: 0 },
    ],
  });
  const next = Goose.playTurn(game, [2, 4]);

  assert.strictEqual(next.players[0].position, 15);
  assert.strictEqual(next.message, '나: 6칸 이동, 미로에서 길을 잃어 15번 칸으로 돌아갔습니다.');
}

function testPrisonAddsWaitingTurn() {
  const game = Goose.createGame({
    players: [
      { name: '나', position: 22, waiting: 0 },
      { name: '컴퓨터', position: 0, waiting: 0 },
    ],
  });
  const next = Goose.playTurn(game, [2, 1]);

  assert.strictEqual(next.players[0].position, 25);
  assert.strictEqual(next.players[0].waiting, 1);
  assert.strictEqual(next.message, '나: 3칸 이동, 감옥에서 한 턴 쉬어야 합니다.');
}

function testWaitingPlayerSkipsTurn() {
  const game = Goose.createGame({
    players: [
      { name: '나', position: 25, waiting: 1 },
      { name: '컴퓨터', position: 7, waiting: 0 },
    ],
  });
  const next = Goose.playTurn(game, [1, 1]);

  assert.strictEqual(next.players[0].position, 25);
  assert.strictEqual(next.players[0].waiting, 0);
  assert.strictEqual(next.currentPlayer, 1);
  assert.strictEqual(next.message, '나는 쉬는 턴입니다.');
}

function testExactFinishWinsAndOvershootBouncesBack() {
  const game = Goose.createGame({
    players: [
      { name: '나', position: 28, waiting: 0 },
      { name: '컴퓨터', position: 0, waiting: 0 },
    ],
  });

  const bounced = Goose.playTurn(game, [3, 3]);
  assert.strictEqual(bounced.players[0].position, 30);
  assert.strictEqual(bounced.status, '진행 중');

  const won = Goose.playTurn(game, [2, 2]);
  assert.strictEqual(won.players[0].position, 32);
  assert.strictEqual(won.status, '승리');
  assert.strictEqual(won.message, '나: 4칸 이동, 32번 칸에 정확히 도착했습니다. 승리!');
}

testCreateGameStartsAtFirstTurn();
testRollDiceUsesTwoFourSidedDice();
testGooseSquareMovesAgainBySameRoll();
testBridgeJumpsForward();
testMazeSendsPlayerBack();
testPrisonAddsWaitingTurn();
testWaitingPlayerSkipsTurn();
testExactFinishWinsAndOvershootBouncesBack();

console.log('거위 게임 로직 테스트 통과');
