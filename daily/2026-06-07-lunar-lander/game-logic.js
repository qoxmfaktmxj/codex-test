const STATUS = {
  PLAYING: 'playing',
  WON: 'won',
  LOST: 'lost',
};

const GRAVITY = 0.1;
const THRUST_POWER = 0.55;
const SAFE_LANDING_SPEED = 4;
const MAX_ALTITUDE = 150;

function round(value) {
  return Number(value.toFixed(1));
}

function createGame() {
  return {
    altitude: 120,
    velocity: 0,
    fuel: 60,
    seconds: 0,
    status: STATUS.PLAYING,
    thrusting: false,
    message: '추력을 조절해 천천히 달 표면에 착륙하세요.',
  };
}

function stepGame(game, useThrust) {
  if (game.status !== STATUS.PLAYING) return { ...game };

  const canThrust = useThrust && game.fuel > 0;
  const fuel = canThrust ? game.fuel - 1 : game.fuel;
  const acceleration = GRAVITY - (canThrust ? THRUST_POWER : 0);
  const velocity = round(game.velocity + acceleration);
  const altitude = Math.max(0, Math.min(MAX_ALTITUDE, round(game.altitude - velocity)));
  const seconds = game.seconds + 1;

  let status = STATUS.PLAYING;
  let message = '하강 중입니다. 속도를 확인하세요.';

  if (canThrust) message = '엔진 점화! 속도를 낮추고 있습니다.';
  if (useThrust && !canThrust) message = '연료가 없습니다. 관성으로 버티세요.';

  if (altitude <= 0) {
    status = velocity <= SAFE_LANDING_SPEED ? STATUS.WON : STATUS.LOST;
    message = status === STATUS.WON
      ? '착륙 성공! 달 표면에 안전하게 내려앉았습니다.'
      : '충돌했습니다. 다음에는 더 천천히 내려오세요.';
  }

  return {
    altitude,
    velocity,
    fuel,
    seconds,
    status,
    thrusting: canThrust,
    message,
  };
}

function statusText(game) {
  return `고도 ${game.altitude.toFixed(1)}m · 속도 ${game.velocity.toFixed(1)}m/s · 연료 ${game.fuel}`;
}

function thrustText(isThrusting) {
  return isThrusting ? '엔진 점화' : '엔진 대기';
}

function landingHint(game) {
  return game.velocity <= SAFE_LANDING_SPEED ? '안전 속도' : '감속 필요';
}

function resultText(game) {
  if (game.status === STATUS.WON) return `성공 · ${game.seconds}초`;
  if (game.status === STATUS.LOST) return `실패 · 충돌 속도 ${game.velocity.toFixed(1)}m/s`;
  return `진행 중 · ${landingHint(game)}`;
}

const api = {
  STATUS,
  GRAVITY,
  THRUST_POWER,
  SAFE_LANDING_SPEED,
  createGame,
  stepGame,
  statusText,
  thrustText,
  landingHint,
  resultText,
};

if (typeof module !== 'undefined' && module.exports) module.exports = api;
if (typeof window !== 'undefined') window.LunarLanderLogic = api;
