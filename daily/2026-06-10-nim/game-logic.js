const DEFAULT_PILES = [3, 4, 5];
const PLAYERS = ['나', '상대'];

function clonePiles(piles) {
  if (!Array.isArray(piles) || piles.length === 0) {
    return [...DEFAULT_PILES];
  }
  return piles.map((count) => Math.max(0, Math.floor(Number(count) || 0)));
}

function normalizePlayer(player) {
  return PLAYERS.includes(player) ? player : PLAYERS[0];
}

function nextPlayer(player) {
  return player === PLAYERS[0] ? PLAYERS[1] : PLAYERS[0];
}

function createGame(options = {}) {
  const piles = clonePiles(options.piles);
  return {
    piles,
    currentPlayer: normalizePlayer(options.currentPlayer),
    status: options.status || '진행 중',
    winner: options.winner || null,
    message: options.message || '돌을 가져갈 더미와 개수를 고르세요.',
  };
}

function isPlaying(game) {
  return game.status === '진행 중';
}

function isValidMove(game, pileIndex, count) {
  if (!isPlaying(game)) {
    return false;
  }
  if (!Number.isInteger(pileIndex) || pileIndex < 0 || pileIndex >= game.piles.length) {
    return false;
  }
  if (!Number.isInteger(count) || count < 1) {
    return false;
  }
  return game.piles[pileIndex] >= count;
}

function availableMoves(game) {
  const moves = [];
  game.piles.forEach((pile, pileIndex) => {
    for (let count = 1; count <= pile; count += 1) {
      moves.push({ pileIndex, count });
    }
  });
  return moves;
}

function takeStones(game, pileIndex, count) {
  if (!isValidMove(game, pileIndex, count)) {
    return game;
  }

  const piles = [...game.piles];
  piles[pileIndex] -= count;
  const winner = piles.every((pile) => pile === 0) ? game.currentPlayer : null;

  if (winner) {
    return {
      ...game,
      piles,
      status: '승리',
      winner,
      message: `${winner}가 마지막 돌을 가져가 이겼습니다.`,
    };
  }

  const currentPlayer = nextPlayer(game.currentPlayer);
  return {
    ...game,
    piles,
    currentPlayer,
    message: `${currentPlayer} 차례입니다.`,
  };
}

const gameLogic = {
  DEFAULT_PILES,
  createGame,
  takeStones,
  isValidMove,
  availableMoves,
};

if (typeof module !== 'undefined') {
  module.exports = gameLogic;
}

if (typeof window !== 'undefined') {
  window.gameLogic = gameLogic;
}
