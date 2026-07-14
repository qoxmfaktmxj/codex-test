(function defineMonteCarloSolitaire(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.MonteCarloSolitaire = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const SUITS = ['♠', '♥', '♦', '♣'];
  const BOARD_COLUMNS = 5;
  const BOARD_SIZE = 25;

  function cloneCard(card) {
    return card ? { rank: card.rank, suit: card.suit } : null;
  }

  function cloneGame(game, overrides = {}) {
    return {
      board: game.board.map(cloneCard),
      stock: game.stock.map(cloneCard),
      removedPairs: game.removedPairs,
      status: game.status,
      message: game.message,
      lastRemoved: game.lastRemoved ? game.lastRemoved.map(cloneCard) : [],
      ...overrides,
    };
  }

  function createDeck() {
    return SUITS.flatMap((suit) => RANKS.map((rank) => ({ rank, suit })));
  }

  function shuffleDeck(deck, random = Math.random) {
    const cards = deck.map(cloneCard);
    for (let index = cards.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(random() * (index + 1));
      [cards[index], cards[swapIndex]] = [cards[swapIndex], cards[index]];
    }
    return cards;
  }

  function createGame(options = {}) {
    if (options.board || options.stock) {
      return cloneGame({
        board: (options.board || []).map(cloneCard),
        stock: (options.stock || []).map(cloneCard),
        removedPairs: options.removedPairs || 0,
        status: options.status || '진행 중',
        message: options.message || '같은 숫자의 가로, 세로, 대각선 이웃 카드 두 장을 고르세요.',
        lastRemoved: options.lastRemoved || [],
      });
    }

    const sourceDeck = options.deck ? options.deck.map(cloneCard) : createDeck();
    let deck = options.shuffle === false ? sourceDeck : shuffleDeck(sourceDeck, options.random);
    if (options.shuffle !== false) {
      for (let attempts = 0; attempts < 200; attempts += 1) {
        const draft = {
          board: deck.slice(0, BOARD_SIZE),
          stock: deck.slice(BOARD_SIZE),
          removedPairs: 0,
          status: '진행 중',
          message: '',
          lastRemoved: [],
        };
        if (findPairs(draft).length > 0) {
          break;
        }
        deck = shuffleDeck(sourceDeck, options.random);
      }
    }
    const game = {
      board: deck.slice(0, BOARD_SIZE),
      stock: deck.slice(BOARD_SIZE),
      removedPairs: 0,
      status: '진행 중',
      message: '같은 숫자의 가로, 세로, 대각선 이웃 카드 두 장을 고르세요.',
      lastRemoved: [],
    };
    return cloneGame(game);
  }

  function isValidIndex(game, index) {
    return Number.isInteger(index) && index >= 0 && index < game.board.length && Boolean(game.board[index]);
  }

  function getPoint(index) {
    return {
      row: Math.floor(index / BOARD_COLUMNS),
      col: index % BOARD_COLUMNS,
    };
  }

  function areAdjacent(firstIndex, secondIndex) {
    const first = getPoint(firstIndex);
    const second = getPoint(secondIndex);
    const rowGap = Math.abs(first.row - second.row);
    const colGap = Math.abs(first.col - second.col);
    return firstIndex !== secondIndex && rowGap <= 1 && colGap <= 1;
  }

  function assertPair(game, firstIndex, secondIndex) {
    if (game.status !== '진행 중') {
      throw new Error('이미 끝난 판입니다.');
    }
    if (!isValidIndex(game, firstIndex) || !isValidIndex(game, secondIndex)) {
      throw new Error('카드 두 장을 고르세요.');
    }
    if (!areAdjacent(firstIndex, secondIndex)) {
      throw new Error('서로 이웃한 카드만 지울 수 있습니다.');
    }
    if (game.board[firstIndex].rank !== game.board[secondIndex].rank) {
      throw new Error('같은 숫자 카드만 지울 수 있습니다.');
    }
  }

  function compactAndDeal(board, stock) {
    const compacted = board.filter(Boolean).map(cloneCard);
    const nextStock = stock.map(cloneCard);
    while (compacted.length < BOARD_SIZE && nextStock.length > 0) {
      compacted.push(nextStock.shift());
    }
    return { board: compacted, stock: nextStock };
  }

  function findPairs(game) {
    const pairs = [];
    for (let first = 0; first < game.board.length; first += 1) {
      if (!game.board[first]) {
        continue;
      }
      for (let second = first + 1; second < game.board.length; second += 1) {
        if (game.board[second]
          && game.board[first].rank === game.board[second].rank
          && areAdjacent(first, second)) {
          pairs.push({ first, second });
        }
      }
    }
    return pairs;
  }

  function evaluateGame(game) {
    const next = cloneGame(game);
    if (next.board.length === 0 && next.stock.length === 0) {
      return cloneGame(next, {
        status: '승리',
        message: '모든 카드를 치웠습니다. 승리!',
      });
    }
    if (findPairs(next).length === 0) {
      return cloneGame(next, {
        status: '막힘',
        message: '더 이상 이웃한 같은 숫자가 없습니다.',
      });
    }
    return cloneGame(next, {
      status: '진행 중',
      message: next.message || '같은 숫자의 가로, 세로, 대각선 이웃 카드 두 장을 고르세요.',
    });
  }

  function removePair(game, firstIndex, secondIndex) {
    assertPair(game, firstIndex, secondIndex);
    const board = game.board.map(cloneCard);
    const removed = [board[firstIndex], board[secondIndex]];
    board[firstIndex] = null;
    board[secondIndex] = null;

    const dealt = compactAndDeal(board, game.stock);
    return evaluateGame({
      board: dealt.board,
      stock: dealt.stock,
      removedPairs: game.removedPairs + 1,
      status: '진행 중',
      message: '한 쌍을 치웠습니다. 이어진 같은 숫자를 찾으세요.',
      lastRemoved: removed,
    });
  }

  return {
    BOARD_COLUMNS,
    BOARD_SIZE,
    RANKS,
    SUITS,
    areAdjacent,
    createDeck,
    createGame,
    evaluateGame,
    findPairs,
    removePair,
    shuffleDeck,
  };
}));
