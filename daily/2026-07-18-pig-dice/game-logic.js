(function definePigDice(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PigDice = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const PLAYER_NAMES = ['플레이어 1', '플레이어 2'];
  const DEFAULT_TARGET_SCORE = 30;

  function assertScore(score) {
    if (!Number.isInteger(score) || score < 0) {
      throw new Error('점수는 0 이상의 정수여야 합니다.');
    }
  }

  function normalizeScores(scores) {
    const normalized = scores || [0, 0];
    if (!Array.isArray(normalized) || normalized.length !== 2) {
      throw new Error('두 명의 점수가 필요합니다.');
    }
    normalized.forEach(assertScore);
    return normalized.slice();
  }

  function normalizePlayer(player) {
    if (!Number.isInteger(player) || player < 0 || player > 1) {
      throw new Error('차례 정보가 올바르지 않습니다.');
    }
    return player;
  }

  function createGame(options = {}) {
    const targetScore = options.targetScore || DEFAULT_TARGET_SCORE;
    if (!Number.isInteger(targetScore) || targetScore < 10) {
      throw new Error('목표 점수는 10 이상의 정수여야 합니다.');
    }
    const turnTotal = options.turnTotal || 0;
    assertScore(turnTotal);
    const winner = options.winner === undefined ? null : options.winner;
    if (winner !== null) {
      normalizePlayer(winner);
    }
    const currentPlayer = normalizePlayer(options.currentPlayer || 0);
    const status = options.status || '진행 중';

    return {
      scores: normalizeScores(options.scores),
      currentPlayer,
      turnTotal,
      targetScore,
      lastRoll: options.lastRoll || null,
      status,
      winner,
      message: options.message || `${PLAYER_NAMES[currentPlayer]} 차례입니다. 굴리거나 멈추세요.`,
    };
  }

  function cloneGame(game, overrides = {}) {
    return {
      scores: game.scores.slice(),
      currentPlayer: game.currentPlayer,
      turnTotal: game.turnTotal,
      targetScore: game.targetScore,
      lastRoll: game.lastRoll,
      status: game.status,
      winner: game.winner,
      message: game.message,
      ...overrides,
    };
  }

  function assertPlayable(game) {
    if (game.status !== '진행 중') {
      throw new Error('이미 끝난 판입니다.');
    }
  }

  function otherPlayer(player) {
    return player === 0 ? 1 : 0;
  }

  function rollDie(game, random = Math.random) {
    assertPlayable(game);
    const roll = Math.floor(random() * 6) + 1;

    if (roll === 1) {
      const nextPlayer = otherPlayer(game.currentPlayer);
      return cloneGame(game, {
        currentPlayer: nextPlayer,
        turnTotal: 0,
        lastRoll: roll,
        message: `${PLAYER_NAMES[game.currentPlayer]}이 1이 나와 이번 차례 점수를 잃었습니다. ${PLAYER_NAMES[nextPlayer]} 차례입니다.`,
      });
    }

    return cloneGame(game, {
      turnTotal: game.turnTotal + roll,
      lastRoll: roll,
      message: `${PLAYER_NAMES[game.currentPlayer]}이 ${roll}을 굴렸습니다. 더 굴리거나 점수를 가져가세요.`,
    });
  }

  function holdTurn(game) {
    assertPlayable(game);
    const scores = game.scores.slice();
    scores[game.currentPlayer] += game.turnTotal;

    if (scores[game.currentPlayer] >= game.targetScore) {
      return cloneGame(game, {
        scores,
        turnTotal: 0,
        status: '승리',
        winner: game.currentPlayer,
        message: `${PLAYER_NAMES[game.currentPlayer]}이 ${scores[game.currentPlayer]}점으로 승리했습니다.`,
      });
    }

    const nextPlayer = otherPlayer(game.currentPlayer);
    return cloneGame(game, {
      scores,
      currentPlayer: nextPlayer,
      turnTotal: 0,
      lastRoll: null,
      message: `${PLAYER_NAMES[game.currentPlayer]}이 ${scores[game.currentPlayer]}점까지 저장했습니다. ${PLAYER_NAMES[nextPlayer]} 차례입니다.`,
    });
  }

  return {
    DEFAULT_TARGET_SCORE,
    PLAYER_NAMES,
    createGame,
    holdTurn,
    rollDie,
  };
}));
