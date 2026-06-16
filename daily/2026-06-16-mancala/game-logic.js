const PIT_COUNT = 6;
const STARTING_STONES = 4;
const PLAYERS = ['남쪽', '북쪽'];

function normalizePitLine(source) {
  const input = Array.isArray(source) ? source : [];
  return Array.from({ length: PIT_COUNT }, (_, index) => {
    const value = Number(input[index]);
    return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : STARTING_STONES;
  });
}

function normalizeStores(stores) {
  return {
    남쪽: Math.max(0, Math.floor(Number(stores && stores['남쪽']) || 0)),
    북쪽: Math.max(0, Math.floor(Number(stores && stores['북쪽']) || 0)),
  };
}

function createGame(options = {}) {
  return {
    southPits: normalizePitLine(options.southPits),
    northPits: normalizePitLine(options.northPits),
    stores: normalizeStores(options.stores),
    currentPlayer: PLAYERS.includes(options.currentPlayer) ? options.currentPlayer : PLAYERS[0],
    status: options.status || '진행 중',
    moves: Math.max(0, Math.floor(Number(options.moves) || 0)),
    message: options.message || '내 쪽 칸을 골라 돌을 반시계 방향으로 나누어 놓으세요.',
  };
}

function cloneGame(game) {
  return {
    ...game,
    southPits: game.southPits.slice(),
    northPits: game.northPits.slice(),
    stores: { ...game.stores },
  };
}

function getPits(game, player) {
  return player === '남쪽' ? game.southPits : game.northPits;
}

function getOpponent(player) {
  return player === '남쪽' ? '북쪽' : '남쪽';
}

function isValidPit(index) {
  return Number.isInteger(index) && index >= 0 && index < PIT_COUNT;
}

function isSideEmpty(game, player) {
  return getPits(game, player).every((stones) => stones === 0);
}

function collectRemainingStones(game) {
  PLAYERS.forEach((player) => {
    const pits = getPits(game, player);
    const remaining = pits.reduce((total, stones) => total + stones, 0);
    if (remaining > 0) {
      game.stores[player] += remaining;
      pits.fill(0);
    }
  });
}

function getWinner(game) {
  if (game.stores['남쪽'] === game.stores['북쪽']) {
    return '무승부';
  }
  return game.stores['남쪽'] > game.stores['북쪽'] ? '남쪽' : '북쪽';
}

function makeFinishMessage(game) {
  const winner = getWinner(game);
  if (winner === '무승부') {
    return '무승부입니다. 저장소의 돌 수가 같습니다.';
  }
  return `${winner} 승리! 저장소에 더 많은 돌을 모았습니다.`;
}

function nextSlot(player, slot) {
  if (player === '남쪽') {
    if (slot.type === 'pit' && slot.side === '남쪽' && slot.index < PIT_COUNT - 1) {
      return { type: 'pit', side: '남쪽', index: slot.index + 1 };
    }
    if (slot.type === 'pit' && slot.side === '남쪽') {
      return { type: 'store', side: '남쪽' };
    }
    if (slot.type === 'store' && slot.side === '남쪽') {
      return { type: 'pit', side: '북쪽', index: PIT_COUNT - 1 };
    }
    if (slot.type === 'pit' && slot.side === '북쪽' && slot.index > 0) {
      return { type: 'pit', side: '북쪽', index: slot.index - 1 };
    }
    return { type: 'pit', side: '남쪽', index: 0 };
  }

  if (slot.type === 'pit' && slot.side === '북쪽' && slot.index > 0) {
    return { type: 'pit', side: '북쪽', index: slot.index - 1 };
  }
  if (slot.type === 'pit' && slot.side === '북쪽') {
    return { type: 'store', side: '북쪽' };
  }
  if (slot.type === 'store' && slot.side === '북쪽') {
    return { type: 'pit', side: '남쪽', index: 0 };
  }
  if (slot.type === 'pit' && slot.side === '남쪽' && slot.index < PIT_COUNT - 1) {
    return { type: 'pit', side: '남쪽', index: slot.index + 1 };
  }
  return { type: 'pit', side: '북쪽', index: PIT_COUNT - 1 };
}

function addStone(game, slot) {
  if (slot.type === 'store') {
    game.stores[slot.side] += 1;
    return;
  }
  getPits(game, slot.side)[slot.index] += 1;
}

function maybeCapture(game, player, slot) {
  if (slot.type !== 'pit' || slot.side !== player) {
    return false;
  }

  const ownPits = getPits(game, player);
  const opponent = getOpponent(player);
  const opponentPits = getPits(game, opponent);
  const ownStones = ownPits[slot.index];
  const oppositeStones = opponentPits[slot.index];

  if (ownStones !== 1 || oppositeStones === 0) {
    return false;
  }

  game.stores[player] += ownStones + oppositeStones;
  ownPits[slot.index] = 0;
  opponentPits[slot.index] = 0;
  return true;
}

function selectPit(game, player, index) {
  if (!game || game.status !== '진행 중') {
    return game;
  }
  if (player !== game.currentPlayer) {
    return {
      ...game,
      message: '내 쪽 칸만 고를 수 있습니다.',
    };
  }
  if (!isValidPit(index)) {
    return {
      ...game,
      message: '고를 수 없는 칸입니다.',
    };
  }

  const sourcePits = getPits(game, player);
  if (sourcePits[index] === 0) {
    return {
      ...game,
      message: '돌이 없는 칸입니다.',
    };
  }

  const nextGame = cloneGame(game);
  const pits = getPits(nextGame, player);
  let stones = pits[index];
  let slot = { type: 'pit', side: player, index };
  pits[index] = 0;

  while (stones > 0) {
    slot = nextSlot(player, slot);
    addStone(nextGame, slot);
    stones -= 1;
  }

  const captured = maybeCapture(nextGame, player, slot);
  nextGame.moves += 1;

  if (isSideEmpty(nextGame, '남쪽') || isSideEmpty(nextGame, '북쪽')) {
    collectRemainingStones(nextGame);
    nextGame.status = '완료';
    nextGame.message = makeFinishMessage(nextGame);
    return nextGame;
  }

  if (slot.type === 'store' && slot.side === player) {
    nextGame.currentPlayer = player;
    nextGame.message = '마지막 돌이 내 저장소에 들어갔습니다. 한 번 더 두세요.';
  } else {
    nextGame.currentPlayer = getOpponent(player);
    nextGame.message = captured
      ? `${player}이 맞은편 돌을 잡았습니다. ${nextGame.currentPlayer} 차례입니다.`
      : `${nextGame.currentPlayer} 차례입니다.`;
  }

  return nextGame;
}

function getPitState(game, player, index) {
  if (!game || !PLAYERS.includes(player) || !isValidPit(index)) {
    return {
      stones: 0,
      selectable: false,
    };
  }
  const stones = getPits(game, player)[index];
  return {
    stones,
    selectable: game.status === '진행 중' && game.currentPlayer === player && stones > 0,
  };
}

function resetGame() {
  return createGame();
}

const MancalaLogic = {
  PIT_COUNT,
  STARTING_STONES,
  PLAYERS,
  createGame,
  selectPit,
  getPitState,
  getWinner,
  resetGame,
};

if (typeof module !== 'undefined') {
  module.exports = MancalaLogic;
}

if (typeof window !== 'undefined') {
  window.MancalaLogic = MancalaLogic;
}
