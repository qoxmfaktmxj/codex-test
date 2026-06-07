const assert = require('assert');
const {
  createGame,
  stepGame,
  landingHint,
  statusText,
  thrustText,
  GRAVITY,
  SAFE_LANDING_SPEED,
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

test('새 게임은 착륙선의 높이, 속도, 연료를 초기화한다', () => {
  const game = createGame();
  assert.strictEqual(game.altitude, 120);
  assert.strictEqual(game.velocity, 0);
  assert.strictEqual(game.fuel, 60);
  assert.strictEqual(game.status, 'playing');
  assert.strictEqual(game.message, '추력을 조절해 천천히 달 표면에 착륙하세요.');
});

test('추력을 쓰지 않으면 중력 때문에 하강 속도가 커진다', () => {
  const game = createGame();
  const next = stepGame(game, false);
  assert.strictEqual(next.velocity, GRAVITY);
  assert.strictEqual(next.altitude, 120 - GRAVITY);
  assert.strictEqual(next.fuel, 60);
});

test('추력을 쓰면 연료가 줄고 하강 속도가 완화된다', () => {
  const game = { ...createGame(), velocity: 2, fuel: 3 };
  const next = stepGame(game, true);
  assert.strictEqual(next.fuel, 2);
  assert.ok(next.velocity < game.velocity + GRAVITY);
  assert.strictEqual(next.message, '엔진 점화! 속도를 낮추고 있습니다.');
});

test('연료가 없으면 추력 입력은 무시된다', () => {
  const game = { ...createGame(), velocity: 1, fuel: 0 };
  const next = stepGame(game, true);
  assert.strictEqual(next.fuel, 0);
  assert.strictEqual(next.velocity, 1 + GRAVITY);
  assert.strictEqual(next.message, '연료가 없습니다. 관성으로 버티세요.');
});

test('안전 속도 이하로 표면에 닿으면 착륙 성공이다', () => {
  const game = { ...createGame(), altitude: 1, velocity: SAFE_LANDING_SPEED - 0.1 };
  const next = stepGame(game, false);
  assert.strictEqual(next.status, 'won');
  assert.strictEqual(next.altitude, 0);
  assert.strictEqual(next.message, '착륙 성공! 달 표면에 안전하게 내려앉았습니다.');
});

test('너무 빠르게 표면에 닿으면 착륙 실패다', () => {
  const game = { ...createGame(), altitude: 1, velocity: SAFE_LANDING_SPEED + 1 };
  const next = stepGame(game, false);
  assert.strictEqual(next.status, 'lost');
  assert.strictEqual(next.altitude, 0);
  assert.strictEqual(next.message, '충돌했습니다. 다음에는 더 천천히 내려오세요.');
});

test('상태와 추력 문구는 한국어로 현재 상황을 설명한다', () => {
  const game = createGame();
  assert.strictEqual(statusText(game), '고도 120.0m · 속도 0.0m/s · 연료 60');
  assert.strictEqual(thrustText(false), '엔진 대기');
  assert.strictEqual(thrustText(true), '엔진 점화');
  assert.strictEqual(landingHint({ ...game, velocity: SAFE_LANDING_SPEED }), '안전 속도');
  assert.strictEqual(landingHint({ ...game, velocity: SAFE_LANDING_SPEED + 0.1 }), '감속 필요');
});
