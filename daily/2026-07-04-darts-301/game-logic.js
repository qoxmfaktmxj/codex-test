(function defineDarts301(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.Darts301 = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const DEFAULT_MESSAGE = '점수판에서 맞힌 구역을 고르세요.';

  function cloneDart(dart) {
    return { ...dart };
  }

  function cloneGame(game, overrides = {}) {
    return {
      score: game.score,
      round: game.round,
      dartsLeft: game.dartsLeft,
      turnThrows: game.turnThrows.map(cloneDart),
      history: game.history.map((entry) => ({
        ...entry,
        throws: entry.throws.map(cloneDart),
      })),
      roundStartScore: game.roundStartScore,
      status: game.status,
      message: game.message,
      ...overrides,
    };
  }

  function createGame(options = {}) {
    const score = options.score ?? 301;
    return {
      score,
      round: options.round ?? 1,
      dartsLeft: options.dartsLeft ?? 3,
      turnThrows: (options.turnThrows || []).map(cloneDart),
      history: (options.history || []).map((entry) => ({
        ...entry,
        throws: entry.throws.map(cloneDart),
      })),
      roundStartScore: options.roundStartScore ?? score,
      status: options.status || '진행 중',
      message: options.message || DEFAULT_MESSAGE,
    };
  }

  function scoreThrow(dart) {
    if (dart.ring === 'miss') {
      return 0;
    }

    if (dart.ring === 'singleBull') {
      return 25;
    }

    if (dart.ring === 'doubleBull') {
      return 50;
    }

    if (dart.ring === 'double') {
      return dart.value * 2;
    }

    if (dart.ring === 'triple') {
      return dart.value * 3;
    }

    return dart.value;
  }

  function isDoubleOut(dart) {
    return dart.ring === 'double' || dart.ring === 'doubleBull';
  }

  function labelThrow(dart) {
    if (dart.ring === 'miss') {
      return '빗나감';
    }

    if (dart.ring === 'singleBull') {
      return '싱글 불';
    }

    if (dart.ring === 'doubleBull') {
      return '더블 불';
    }

    if (dart.ring === 'double') {
      return `더블 ${dart.value}`;
    }

    if (dart.ring === 'triple') {
      return `트리플 ${dart.value}`;
    }

    return `싱글 ${dart.value}`;
  }

  function finishRound(game, throws, score, message, bust = false) {
    const historyEntry = {
      round: game.round,
      throws,
      score,
      bust,
    };

    return cloneGame(game, {
      score,
      round: game.round + 1,
      dartsLeft: 3,
      turnThrows: [],
      history: game.history.concat(historyEntry),
      roundStartScore: score,
      message,
    });
  }

  function throwDart(game, dart) {
    if (game.status !== '진행 중') {
      return cloneGame(game, {
        message: '이미 끝난 판입니다. 새 판을 시작하세요.',
      });
    }

    const points = scoreThrow(dart);
    const scoredDart = {
      ring: dart.ring,
      value: dart.value,
      points,
      label: labelThrow(dart),
    };
    const turnThrows = game.turnThrows.concat(scoredDart);
    const nextScore = game.score - points;

    if (nextScore < 0) {
      return finishRound(
        game,
        turnThrows,
        game.roundStartScore,
        `${points}점은 버스트입니다. 점수는 ${game.roundStartScore}점으로 돌아가고 다음 라운드입니다.`,
        true,
      );
    }

    if (nextScore === 1) {
      return finishRound(
        game,
        turnThrows,
        game.roundStartScore,
        '1점은 남길 수 없습니다. 점수는 이전 라운드 시작 점수로 돌아갑니다.',
        true,
      );
    }

    if (nextScore === 0) {
      if (!isDoubleOut(dart)) {
        return finishRound(
          game,
          turnThrows,
          game.roundStartScore,
          `마지막 점수는 더블로 끝내야 합니다. 점수는 ${game.roundStartScore}점으로 돌아갑니다.`,
          true,
        );
      }

      return cloneGame(game, {
        score: 0,
        dartsLeft: game.dartsLeft - 1,
        turnThrows,
        history: game.history.concat({
          round: game.round,
          throws: turnThrows,
          score: 0,
          bust: false,
        }),
        status: '성공',
        message: `${labelThrow(dart)}으로 정확히 0점! ${game.round}라운드 만에 승리했습니다.`,
      });
    }

    if (game.dartsLeft === 1) {
      const reduced = game.roundStartScore - nextScore;
      return finishRound(
        game,
        turnThrows,
        nextScore,
        `${game.round}라운드에 ${reduced}점을 줄였습니다. 다음 라운드입니다.`,
      );
    }

    return cloneGame(game, {
      score: nextScore,
      dartsLeft: game.dartsLeft - 1,
      turnThrows,
      message: `${points}점을 맞혔습니다. 남은 점수는 ${nextScore}점입니다.`,
    });
  }

  return {
    createGame,
    labelThrow,
    scoreThrow,
    throwDart,
  };
}));
