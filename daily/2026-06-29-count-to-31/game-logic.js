(function defineCountTo31(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CountTo31 = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const MAX_TOTAL = 31;
  const MAX_PICK = 3;
  const SAFE_TOTALS = [2, 6, 10, 14, 18, 22, 26, 30];

  function cloneHistory(history) {
    return history.map((entry) => ({ ...entry }));
  }

  function createGame(options = {}) {
    return {
      total: options.total || 0,
      status: options.status || '진행 중',
      turn: options.turn || '사람',
      winner: options.winner || null,
      history: cloneHistory(options.history || []),
      message: options.message || '1부터 3까지 골라 숫자를 이어 부르세요. 31을 부르면 집니다.',
    };
  }

  function cloneGame(game, overrides = {}) {
    return {
      total: game.total,
      status: game.status,
      turn: game.turn,
      winner: game.winner,
      history: cloneHistory(game.history),
      message: game.message,
      ...overrides,
    };
  }

  function validateCount(count) {
    if (!Number.isInteger(count) || count < 1 || count > MAX_PICK) {
      throw new Error('1부터 3까지만 고를 수 있습니다.');
    }
  }

  function clampMove(total, count) {
    return Math.min(MAX_TOTAL, total + count);
  }

  function makeEntry(player, previousTotal, count) {
    return {
      player,
      from: previousTotal + 1,
      to: clampMove(previousTotal, count),
    };
  }

  function formatRange(entry) {
    const numbers = [];

    for (let number = entry.from; number <= entry.to; number += 1) {
      numbers.push(String(number));
    }

    return numbers.join(', ');
  }

  function chooseComputerCount(total) {
    const target = SAFE_TOTALS.find((safeTotal) => safeTotal > total && safeTotal <= total + MAX_PICK);

    if (target) {
      return target - total;
    }

    return Math.min(MAX_PICK, MAX_TOTAL - total);
  }

  function takePlayerMove(game, count) {
    validateCount(count);

    if (game.status === '완료') {
      return cloneGame(game, {
        message: '이미 끝난 판입니다. 새로 시작하세요.',
      });
    }

    const playerEntry = makeEntry('사람', game.total, count);
    const playerTotal = playerEntry.to;
    const historyAfterPlayer = [...cloneHistory(game.history), playerEntry];

    if (playerTotal >= MAX_TOTAL) {
      return cloneGame(game, {
        total: MAX_TOTAL,
        status: '완료',
        turn: '완료',
        winner: '컴퓨터',
        history: historyAfterPlayer,
        message: `사람이 ${formatRange(playerEntry)}을 불렀습니다. 31을 불러서 컴퓨터 승리!`,
      });
    }

    const computerCount = chooseComputerCount(playerTotal);
    const computerEntry = makeEntry('컴퓨터', playerTotal, computerCount);
    const computerTotal = computerEntry.to;
    const nextHistory = [...historyAfterPlayer, computerEntry];

    if (computerTotal >= MAX_TOTAL) {
      return cloneGame(game, {
        total: MAX_TOTAL,
        status: '완료',
        turn: '완료',
        winner: '사람',
        history: nextHistory,
        message: '컴퓨터가 31을 불렀습니다. 사람 승리!',
      });
    }

    return cloneGame(game, {
      total: computerTotal,
      turn: '사람',
      history: nextHistory,
      message: `사람: ${formatRange(playerEntry)}. 컴퓨터: ${formatRange(computerEntry)}. 다음 숫자를 고르세요.`,
    });
  }

  return {
    createGame,
    takePlayerMove,
    chooseComputerCount,
    formatRange,
  };
}));
