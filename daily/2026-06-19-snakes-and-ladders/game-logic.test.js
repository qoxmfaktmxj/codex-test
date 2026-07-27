const assert = require('assert');
const {
  BOARD_END,
  LADDERS,
  SNAKES,
  createGame,
  getBoardCells,
  movePlayer,
  rollDie,
  takeTurn,
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

test('정해진 난수로 1부터 6까지 주사위를 만든다', () => {
  assert.strictEqual(rollDie(() => 0), 1);
  assert.strictEqual(rollDie(() => 0.49), 3);
  assert.strictEqual(rollDie(() => 0.99), 6);
});

test('새 게임은 두 말을 시작 칸에 놓고 내 차례로 시작한다', () => {
  const game = createGame();
  assert.deepStrictEqual(game.players.map((player) => player.position), [1, 1]);
  assert.strictEqual(game.currentPlayer, 0);
  assert.strictEqual(game.status, '진행 중');
  assert.strictEqual(game.winner, null);
  assert.strictEqual(game.message, '주사위를 굴려 36번 칸에 먼저 도착하세요.');
});

test('사다리에 도착하면 위 칸으로 올라간다', () => {
  const result = movePlayer(1, 2);
  assert.deepStrictEqual(result, {
    start: 1,
    roll: 2,
    landed: 3,
    position: 14,
    transport: '사다리',
    message: '3번 칸의 사다리를 타고 14번 칸으로 올라갑니다.',
  });
  assert.strictEqual(LADDERS[3], 14);
});

test('뱀에 도착하면 아래 칸으로 내려간다', () => {
  const result = movePlayer(16, 2);
  assert.strictEqual(result.landed, 18);
  assert.strictEqual(result.position, 6);
  assert.strictEqual(result.transport, '뱀');
  assert.strictEqual(SNAKES[18], 6);
});

test('도착 칸을 넘는 주사위는 이동하지 않는다', () => {
  const result = movePlayer(34, 5);
  assert.strictEqual(result.position, 34);
  assert.strictEqual(result.transport, null);
  assert.strictEqual(result.message, '36번 칸을 넘어서 제자리에 머뭅니다.');
});

test('차례를 진행하면 말 위치와 다음 차례가 바뀐다', () => {
  const game = createGame();
  const next = takeTurn(game, 4);
  assert.deepStrictEqual(game.players.map((player) => player.position), [1, 1]);
  assert.deepStrictEqual(next.players.map((player) => player.position), [5, 1]);
  assert.strictEqual(next.currentPlayer, 1);
  assert.strictEqual(next.message, '나: 4이 나와 5번 칸에 도착했습니다. 컴퓨터 차례입니다.');
});

test('정확히 마지막 칸에 도착하면 승리한다', () => {
  const game = createGame({
    players: [
      { name: '나', position: 33 },
      { name: '컴퓨터', position: 22 },
    ],
  });
  const next = takeTurn(game, 3);
  assert.strictEqual(next.players[0].position, BOARD_END);
  assert.strictEqual(next.status, '승리');
  assert.strictEqual(next.winner, '나');
  assert.strictEqual(next.message, '나: 3이 나와 36번 칸에 도착했습니다. 나 승리!');
});

test('보드 칸은 화면 표시용 이동 정보와 함께 36칸을 만든다', () => {
  const cells = getBoardCells();
  assert.strictEqual(cells.length, 36);
  assert.deepStrictEqual(cells.find((cell) => cell.number === 3), {
    number: 3,
    transport: '사다리',
    target: 14,
  });
  assert.deepStrictEqual(cells.find((cell) => cell.number === 35), {
    number: 35,
    transport: '뱀',
    target: 24,
  });
});
