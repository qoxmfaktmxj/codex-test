const TARGET_SCORE = 100;
const PLAYERS = ['player', 'computer'];
const PLAYER_NAMES = {
  player: '나',
  computer: '컴퓨터',
};

function normalizeTurn(turn) {
  return PLAYERS.includes(turn) ? turn : 'player';
}

function normalizeScore(value) {
  return Math.max(0, Math.floor(Number(value) || 0));
}

function createGame(options = {}) {
  const scores = options.scores || {};
  return {
    targetScore: normalizeScore(options.targetScore) || TARGET_SCORE,
    scores: {
      player: normalizeScore(scores.player),
      computer: normalizeScore(scores.computer),
    },
    turn: normalizeTurn(options.turn),
    turnTotal: normalizeScore(options.turnTotal),
    lastRoll: options.lastRoll || null,
    status: options.status || '진행 중',
    winner: options.winner || null,
    message: options.message || '주사위를 굴리거나 점수를 저장하세요.',
  };
}

function nextTurn(turn) {
  return turn === 'player' ? 'computer' : 'player';
}

function isPlaying(game) {
  return game.status === '진행 중';
}

function safeDie(value) {
  if (Number.isInteger(value) && value >= 1 && value <= 6) {
    return value;
  }
  return Math.floor(Math.random() * 6) + 1;
}

function rollDie(game, dieValue) {
  if (!isPlaying(game)) {
    return game;
  }

  const roll = safeDie(dieValue);
  if (roll === 1) {
    return {
      ...game,
      turn: nextTurn(game.turn),
      turnTotal: 0,
      lastRoll: roll,
      message: '1이 나와 이번 차례 점수를 잃었습니다.',
    };
  }

  const turnTotal = game.turnTotal + roll;
  return {
    ...game,
    turnTotal,
    lastRoll: roll,
    message: `${roll}이 나왔습니다. 계속 굴릴까요, 저장할까요?`,
  };
}

function holdTurn(game) {
  if (!isPlaying(game) || game.turnTotal === 0) {
    return game;
  }

  const scores = {
    ...game.scores,
    [game.turn]: game.scores[game.turn] + game.turnTotal,
  };
  const winner = scores[game.turn] >= game.targetScore ? game.turn : null;

  if (winner) {
    return {
      ...game,
      scores,
      turnTotal: 0,
      lastRoll: null,
      status: '종료',
      winner,
      message: `${PLAYER_NAMES[winner]}의 승리입니다! 목표 점수에 먼저 도달했습니다.`,
    };
  }

  const stored = game.turnTotal;
  const next = nextTurn(game.turn);
  return {
    ...game,
    scores,
    turn: next,
    turnTotal: 0,
    lastRoll: null,
    message: `${stored}점을 저장했습니다. ${PLAYER_NAMES[next]} 차례입니다.`,
  };
}

function shouldComputerHold(game) {
  if (!isPlaying(game) || game.turn !== 'computer') {
    return false;
  }
  return game.scores.computer + game.turnTotal >= game.targetScore || game.turnTotal >= 16;
}

function resetGame() {
  return createGame();
}

const PigDiceLogic = {
  TARGET_SCORE,
  PLAYER_NAMES,
  createGame,
  rollDie,
  holdTurn,
  shouldComputerHold,
  resetGame,
};

if (typeof module !== 'undefined') {
  module.exports = PigDiceLogic;
}

if (typeof window !== 'undefined') {
  window.PigDiceLogic = PigDiceLogic;
}
