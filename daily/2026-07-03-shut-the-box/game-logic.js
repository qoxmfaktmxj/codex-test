(function defineShutTheBox(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ShutTheBox = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const ALL_TILES = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const DEFAULT_MESSAGE = '주사위를 굴리고 합계와 같은 열린 숫자를 닫으세요.';

  function sum(numbers) {
    return numbers.reduce((total, number) => total + number, 0);
  }

  function uniqueSorted(numbers) {
    return Array.from(new Set(numbers)).sort((a, b) => a - b);
  }

  function getOpenTiles(closedTiles) {
    const closed = new Set(closedTiles);
    return ALL_TILES.filter((tile) => !closed.has(tile));
  }

  function createGame(options = {}) {
    const closedTiles = uniqueSorted(options.closedTiles || []);
    const dice = options.dice ? options.dice.slice() : [1, 1];
    const tiles = getOpenTiles(closedTiles);
    const phase = options.phase || (options.dice ? '선택 중' : '굴리기 대기');

    return {
      tiles,
      closedTiles,
      dice,
      rollTotal: sum(dice),
      phase,
      status: options.status || '진행 중',
      score: sum(tiles),
      message: options.message || DEFAULT_MESSAGE,
    };
  }

  function cloneGame(game, overrides = {}) {
    const closedTiles = overrides.closedTiles ? uniqueSorted(overrides.closedTiles) : game.closedTiles.slice();
    const dice = overrides.dice ? overrides.dice.slice() : game.dice.slice();
    const tiles = getOpenTiles(closedTiles);

    return {
      tiles,
      closedTiles,
      dice,
      rollTotal: sum(dice),
      phase: game.phase,
      status: game.status,
      score: sum(tiles),
      message: game.message,
      ...overrides,
      tiles,
      closedTiles,
      dice,
      rollTotal: sum(dice),
      score: sum(tiles),
    };
  }

  function rollDie(randomSource) {
    const value = Math.floor(randomSource() * 6) + 1;
    return Math.min(6, Math.max(1, value));
  }

  function findCombination(game, target = game.rollTotal) {
    const openTiles = game.tiles.slice();
    let best = null;

    function search(startIndex, total, picked) {
      if (total === target) {
        best = picked.slice();
        return true;
      }

      if (total > target) {
        return false;
      }

      for (let index = startIndex; index < openTiles.length; index += 1) {
        picked.push(openTiles[index]);
        if (search(index + 1, total + openTiles[index], picked)) {
          return true;
        }
        picked.pop();
      }

      return false;
    }

    search(0, 0, []);
    return best;
  }

  function hasMove(game) {
    return Boolean(findCombination(game));
  }

  function checkRoll(game) {
    if (game.status !== '진행 중') {
      return cloneGame(game, {
        message: '이미 끝난 판입니다. 새 판을 시작하세요.',
      });
    }

    if (hasMove(game)) {
      return cloneGame(game, {
        phase: '선택 중',
        message: `${game.rollTotal}가 나왔습니다. 합계 ${game.rollTotal}가 되도록 열린 숫자를 고르세요.`,
      });
    }

    return cloneGame(game, {
      phase: '종료',
      status: '실패',
      message: `닫을 수 있는 조합이 없습니다. 남은 점수는 ${game.score}점입니다.`,
    });
  }

  function rollDice(game, randomSource = Math.random) {
    if (game.status !== '진행 중') {
      return cloneGame(game, {
        message: '이미 끝난 판입니다. 새 판을 시작하세요.',
      });
    }

    if (game.phase === '선택 중') {
      return cloneGame(game, {
        message: '먼저 주사위 합계와 같은 숫자를 닫으세요.',
      });
    }

    return checkRoll(cloneGame(game, {
      dice: [rollDie(randomSource), rollDie(randomSource)],
    }));
  }

  function closeTiles(game, selection) {
    if (game.status !== '진행 중') {
      return cloneGame(game, {
        message: '이미 끝난 판입니다. 새 판을 시작하세요.',
      });
    }

    if (game.phase !== '선택 중') {
      return cloneGame(game, {
        message: '먼저 주사위를 굴리세요.',
      });
    }

    const picked = uniqueSorted(selection);
    if (picked.length === 0) {
      return cloneGame(game, {
        message: '닫을 숫자를 하나 이상 고르세요.',
      });
    }

    if (picked.some((tile) => !game.tiles.includes(tile))) {
      return cloneGame(game, {
        message: '열려 있는 숫자만 고를 수 있습니다.',
      });
    }

    if (sum(picked) !== game.rollTotal) {
      return cloneGame(game, {
        message: '고른 숫자의 합이 주사위 합계와 같아야 합니다.',
      });
    }

    const closedTiles = uniqueSorted(game.closedTiles.concat(picked));
    const nextGame = cloneGame(game, { closedTiles });

    if (nextGame.tiles.length === 0) {
      return cloneGame(nextGame, {
        phase: '종료',
        status: '성공',
        message: '모든 숫자를 닫았습니다. 완벽한 승리입니다!',
      });
    }

    return cloneGame(nextGame, {
      phase: '굴리기 대기',
      message: `${picked.join(', ')}를 닫았습니다. 다시 주사위를 굴리세요.`,
    });
  }

  return {
    checkRoll,
    closeTiles,
    createGame,
    findCombination,
    hasMove,
    rollDice,
  };
}));
