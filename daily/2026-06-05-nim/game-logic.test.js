const assert = require('assert');
const {
  createGame,
  availableTakes,
  chooseComputerTake,
  takeStones,
  playPlayerTurn,
  statusText,
} = require('./game-logic');

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}`);
    throw error;
  }
}

test('새 게임은 스물한 개의 돌과 플레이어 차례로 시작한다', () => {
  const game = createGame();
  assert.strictEqual(game.stones, 21);
  assert.strictEqual(game.maxTake, 3);
  assert.strictEqual(game.turn, 'player');
  assert.strictEqual(game.status, 'playing');
  assert.deepStrictEqual(availableTakes(game), [1, 2, 3]);
});

test('남은 돌보다 많이 가져갈 수 없다', () => {
  const game = createGame({ stones: 2 });
  assert.deepStrictEqual(availableTakes(game), [1, 2]);
  assert.throws(() => takeStones(game, 3, 'player'), /가져갈 수 없습니다/);
});

test('돌을 가져가면 남은 돌과 기록이 갱신된다', () => {
  const game = createGame({ stones: 8 });
  const next = takeStones(game, 2, 'player');
  assert.strictEqual(next.stones, 6);
  assert.strictEqual(next.turn, 'computer');
  assert.deepStrictEqual(next.history, [{ actor: 'player', count: 2 }]);
  assert.strictEqual(next.message, '당신이 돌 2개를 가져갔습니다.');
});

test('컴퓨터는 네의 배수를 남기는 수를 고른다', () => {
  assert.strictEqual(chooseComputerTake(createGame({ stones: 18, turn: 'computer' })), 2);
  assert.strictEqual(chooseComputerTake(createGame({ stones: 16, turn: 'computer' })), 1);
  assert.strictEqual(chooseComputerTake(createGame({ stones: 2, turn: 'computer' })), 2);
});

test('플레이어 한 수 뒤 컴퓨터가 자동으로 응수한다', () => {
  const game = createGame({ stones: 21 });
  const next = playPlayerTurn(game, 2);
  assert.strictEqual(next.stones, 16);
  assert.strictEqual(next.turn, 'player');
  assert.deepStrictEqual(next.history, [
    { actor: 'player', count: 2 },
    { actor: 'computer', count: 3 },
  ]);
  assert.strictEqual(next.message, '컴퓨터가 돌 3개를 가져갔습니다. 다음 수를 고르세요.');
});

test('마지막 돌을 가져가면 승패가 결정된다', () => {
  const playerWin = playPlayerTurn(createGame({ stones: 2 }), 2);
  assert.strictEqual(playerWin.status, 'won');
  assert.strictEqual(playerWin.message, '마지막 돌을 가져가 승리했습니다!');
  assert.strictEqual(statusText(playerWin), '승리 · 남은 돌 0개');

  const computerWin = playPlayerTurn(createGame({ stones: 4 }), 3);
  assert.strictEqual(computerWin.status, 'lost');
  assert.strictEqual(computerWin.message, '컴퓨터가 마지막 돌을 가져갔습니다. 다시 도전하세요.');
  assert.strictEqual(statusText(computerWin), '패배 · 남은 돌 0개');
});
