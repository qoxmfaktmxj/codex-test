const BOARD_END = 36;
const LADDERS = {
  3: 14,
  8: 20,
  15: 26,
  22: 32,
};
const SNAKES = {
  18: 6,
  27: 12,
  35: 24,
};
const DEFAULT_PLAYERS = [
  { name: '나', position: 1 },
  { name: '컴퓨터', position: 1 },
];

function clampPosition(position) {
  return Math.max(1, Math.min(BOARD_END, Math.floor(Number(position) || 1)));
}

function clonePlayers(players) {
  const source = Array.isArray(players) && players.length >= 2 ? players : DEFAULT_PLAYERS;
  return source.slice(0, 2).map((player, index) => ({
    name: player && player.name ? String(player.name) : DEFAULT_PLAYERS[index].name,
    position: clampPosition(player && player.position),
  }));
}

function rollDie(random = Math.random) {
  const value = Number(random());
  const normalized = Number.isFinite(value) ? Math.max(0, Math.min(0.999999, value)) : 0;
  return Math.floor(normalized * 6) + 1;
}

function movePlayer(position, roll) {
  const start = clampPosition(position);
  const die = Math.max(1, Math.min(6, Math.floor(Number(roll) || 1)));
  const landed = start + die;

  if (landed > BOARD_END) {
    return {
      start,
      roll: die,
      landed: start,
      position: start,
      transport: null,
      message: `${BOARD_END}번 칸을 넘어서 제자리에 머뭅니다.`,
    };
  }

  if (LADDERS[landed]) {
    return {
      start,
      roll: die,
      landed,
      position: LADDERS[landed],
      transport: '사다리',
      message: `${landed}번 칸의 사다리를 타고 ${LADDERS[landed]}번 칸으로 올라갑니다.`,
    };
  }

  if (SNAKES[landed]) {
    return {
      start,
      roll: die,
      landed,
      position: SNAKES[landed],
      transport: '뱀',
      message: `${landed}번 칸의 뱀을 만나 ${SNAKES[landed]}번 칸으로 내려갑니다.`,
    };
  }

  return {
    start,
    roll: die,
    landed,
    position: landed,
    transport: null,
    message: `${landed}번 칸에 도착했습니다.`,
  };
}

function createGame(options = {}) {
  const players = clonePlayers(options.players);
  const currentPlayer = Math.max(0, Math.min(1, Math.floor(Number(options.currentPlayer) || 0)));
  return {
    players,
    currentPlayer,
    status: options.status || '진행 중',
    winner: options.winner || null,
    lastRoll: options.lastRoll || null,
    message: options.message || `${rollTargetText()}에 먼저 도착하세요.`,
  };
}

function rollTargetText() {
  return '주사위를 굴려 36번 칸';
}

function cloneGame(game) {
  return {
    ...game,
    players: clonePlayers(game.players),
  };
}

function takeTurn(game, fixedRoll) {
  const next = cloneGame(game);
  if (next.status !== '진행 중') {
    return next;
  }

  const player = next.players[next.currentPlayer];
  const die = fixedRoll || rollDie();
  const move = movePlayer(player.position, die);
  player.position = move.position;
  next.lastRoll = move.roll;

  const baseMessage = `${player.name}: ${move.roll}이 나와 ${move.message}`;
  if (move.position === BOARD_END) {
    next.status = '승리';
    next.winner = player.name;
    next.message = `${baseMessage} ${player.name} 승리!`;
    return next;
  }

  next.currentPlayer = next.currentPlayer === 0 ? 1 : 0;
  next.message = `${baseMessage} ${next.players[next.currentPlayer].name} 차례입니다.`;
  return next;
}

function getBoardCells() {
  return Array.from({ length: BOARD_END }, (_, index) => {
    const number = index + 1;
    const transport = LADDERS[number] ? '사다리' : SNAKES[number] ? '뱀' : null;
    const target = LADDERS[number] || SNAKES[number] || null;
    return { number, transport, target };
  });
}

function resetGame() {
  return createGame();
}

const SnakesAndLaddersLogic = {
  BOARD_END,
  LADDERS,
  SNAKES,
  createGame,
  getBoardCells,
  movePlayer,
  resetGame,
  rollDie,
  takeTurn,
};

if (typeof module !== 'undefined') {
  module.exports = SnakesAndLaddersLogic;
}

if (typeof window !== 'undefined') {
  window.SnakesAndLaddersLogic = SnakesAndLaddersLogic;
}
