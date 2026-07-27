(function defineBulgarianSolitaire(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.BulgarianSolitaire = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const TOTAL_CARDS = 45;
  const GOAL_PILES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  function countCards(piles) {
    return piles.reduce((sum, pile) => sum + pile, 0);
  }

  function normalizePiles(piles) {
    if (!Array.isArray(piles) || piles.length === 0) {
      throw new Error('더미가 하나 이상 필요합니다.');
    }
    piles.forEach((pile) => {
      if (!Number.isInteger(pile)) {
        throw new Error('더미 크기는 정수여야 합니다.');
      }
      if (pile <= 0) {
        throw new Error('더미 크기는 양수여야 합니다.');
      }
    });
    if (countCards(piles) !== TOTAL_CARDS) {
      throw new Error('카드는 모두 45장이어야 합니다.');
    }
    return piles.slice();
  }

  function createRandomPiles(random = Math.random) {
    const piles = [];
    let remaining = TOTAL_CARDS;
    while (remaining > 0) {
      const maxTake = Math.min(10, remaining);
      const take = remaining <= 10
        ? remaining
        : Math.max(1, Math.floor(random() * maxTake) + 1);
      piles.push(take);
      remaining -= take;
    }
    return piles.sort((first, second) => second - first);
  }

  function isGoal(piles) {
    const sorted = piles.slice().sort((first, second) => first - second);
    return sorted.length === GOAL_PILES.length
      && sorted.every((pile, index) => pile === GOAL_PILES[index]);
  }

  function cloneGame(game, overrides = {}) {
    return {
      piles: game.piles.slice(),
      moves: game.moves,
      status: game.status,
      message: game.message,
      ...overrides,
    };
  }

  function evaluateGame(game) {
    if (isGoal(game.piles)) {
      return cloneGame(game, {
        status: '승리',
        message: '1부터 9까지 계단 모양이 완성되었습니다.',
      });
    }
    return cloneGame(game, {
      status: '진행 중',
      message: game.message || '각 더미에서 한 장씩 빼고 새 더미로 모으세요.',
    });
  }

  function createGame(options = {}) {
    const piles = options.piles
      ? normalizePiles(options.piles)
      : createRandomPiles(options.random);
    return evaluateGame({
      piles,
      moves: options.moves || 0,
      status: '진행 중',
      message: options.message || '각 더미에서 한 장씩 빼고 새 더미로 모으세요.',
    });
  }

  function playMove(game) {
    if (game.status !== '진행 중') {
      throw new Error('이미 끝난 판입니다.');
    }
    const newPile = game.piles.length;
    const reduced = game.piles
      .map((pile) => pile - 1)
      .filter((pile) => pile > 0)
      .sort((first, second) => second - first);
    return evaluateGame({
      piles: [...reduced, newPile],
      moves: game.moves + 1,
      status: '진행 중',
      message: '한 차례 진행했습니다. 더미가 1부터 9까지 모이면 승리입니다.',
    });
  }

  return {
    GOAL_PILES,
    TOTAL_CARDS,
    countCards,
    createGame,
    evaluateGame,
    isGoal,
    playMove,
  };
}));
