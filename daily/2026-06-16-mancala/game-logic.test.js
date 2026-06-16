const assert = require('assert');
const {
  PIT_COUNT,
  STARTING_STONES,
  PLAYERS,
  createGame,
  selectPit,
  getPitState,
  getWinner,
  resetGame,
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

test('새 게임은 양쪽 여섯 칸에 네 개씩 돌을 놓고 시작한다', () => {
  const game = createGame();
  assert.strictEqual(PIT_COUNT, 6);
  assert.strictEqual(STARTING_STONES, 4);
  assert.deepStrictEqual(game.southPits, [4, 4, 4, 4, 4, 4]);
  assert.deepStrictEqual(game.northPits, [4, 4, 4, 4, 4, 4]);
  assert.deepStrictEqual(game.stores, { 남쪽: 0, 북쪽: 0 });
  assert.strictEqual(game.currentPlayer, PLAYERS[0]);
  assert.strictEqual(game.status, '진행 중');
});

test('자기 칸을 고르면 돌을 반시계 방향으로 한 개씩 뿌린다', () => {
  const game = selectPit(createGame(), '남쪽', 1);
  assert.deepStrictEqual(game.southPits, [4, 0, 5, 5, 5, 5]);
  assert.deepStrictEqual(game.northPits, [4, 4, 4, 4, 4, 4]);
  assert.deepStrictEqual(game.stores, { 남쪽: 0, 북쪽: 0 });
  assert.strictEqual(game.currentPlayer, '북쪽');
  assert.strictEqual(game.moves, 1);
});

test('마지막 돌이 자기 저장소에 들어가면 한 번 더 둔다', () => {
  const prepared = createGame({
    southPits: [1, 0, 0, 0, 0, 1],
    northPits: [4, 4, 4, 4, 4, 4],
    currentPlayer: '남쪽',
  });
  const game = selectPit(prepared, '남쪽', 5);
  assert.strictEqual(game.stores['남쪽'], 1);
  assert.strictEqual(game.currentPlayer, '남쪽');
  assert.strictEqual(game.message, '마지막 돌이 내 저장소에 들어갔습니다. 한 번 더 두세요.');
});

test('빈 자기 칸에 마지막 돌이 멈추면 맞은편 돌을 잡는다', () => {
  const prepared = createGame({
    southPits: [0, 0, 1, 0, 0, 0],
    northPits: [0, 0, 0, 5, 0, 0],
    stores: { 남쪽: 2, 북쪽: 3 },
    currentPlayer: '남쪽',
  });
  const game = selectPit(prepared, '남쪽', 2);
  assert.deepStrictEqual(game.southPits, [0, 0, 0, 0, 0, 0]);
  assert.deepStrictEqual(game.northPits, [0, 0, 0, 0, 0, 0]);
  assert.deepStrictEqual(game.stores, { 남쪽: 8, 북쪽: 3 });
  assert.strictEqual(game.status, '완료');
  assert.strictEqual(getWinner(game), '남쪽');
});

test('상대 저장소는 건너뛰고 돌을 계속 뿌린다', () => {
  const prepared = createGame({
    southPits: [1, 0, 0, 0, 0, 8],
    northPits: [0, 0, 0, 0, 0, 0],
    stores: { 남쪽: 0, 북쪽: 0 },
    currentPlayer: '남쪽',
  });
  const game = selectPit(prepared, '남쪽', 5);
  assert.strictEqual(game.stores['남쪽'], 1);
  assert.strictEqual(game.stores['북쪽'], 0);
  assert.deepStrictEqual(game.northPits, [1, 1, 1, 1, 1, 1]);
  assert.deepStrictEqual(game.southPits, [2, 0, 0, 0, 0, 0]);
});

test('빈 칸이나 상대 칸은 선택할 수 없다', () => {
  const game = createGame({ southPits: [0, 4, 4, 4, 4, 4] });
  const empty = selectPit(game, '남쪽', 0);
  const opponent = selectPit(game, '북쪽', 1);
  assert.strictEqual(empty.message, '돌이 없는 칸입니다.');
  assert.strictEqual(opponent.message, '내 쪽 칸만 고를 수 있습니다.');
  assert.deepStrictEqual(empty.southPits, game.southPits);
  assert.deepStrictEqual(opponent.northPits, game.northPits);
});

test('한쪽 칸이 모두 비면 남은 돌을 저장소로 모으고 승자를 정한다', () => {
  const prepared = createGame({
    southPits: [0, 0, 0, 0, 0, 1],
    northPits: [1, 2, 3, 4, 5, 6],
    stores: { 남쪽: 10, 북쪽: 9 },
    currentPlayer: '남쪽',
  });
  const game = selectPit(prepared, '남쪽', 5);
  assert.strictEqual(game.status, '완료');
  assert.deepStrictEqual(game.southPits, [0, 0, 0, 0, 0, 0]);
  assert.deepStrictEqual(game.northPits, [0, 0, 0, 0, 0, 0]);
  assert.deepStrictEqual(game.stores, { 남쪽: 11, 북쪽: 30 });
  assert.strictEqual(getWinner(game), '북쪽');
  assert.strictEqual(game.message, '북쪽 승리! 저장소에 더 많은 돌을 모았습니다.');
});

test('칸 상태 조회와 새로 시작이 동작한다', () => {
  const changed = selectPit(createGame(), '남쪽', 0);
  assert.deepStrictEqual(getPitState(changed, '남쪽', 0), {
    stones: 0,
    selectable: false,
  });
  assert.deepStrictEqual(resetGame(), createGame());
});
