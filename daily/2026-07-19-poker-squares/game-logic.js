(function definePokerSquares(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PokerSquares = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const SIZE = 5;
  const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const SUITS = ['S', 'H', 'D', 'C'];
  const RANK_VALUES = new Map(RANKS.map((rank, index) => [rank, index + 1]));
  const SUIT_LABELS = {
    S: '스페이드',
    H: '하트',
    D: '다이아',
    C: '클럽',
  };
  const RANK_LABELS = {
    A: 'A',
    J: 'J',
    Q: 'Q',
    K: 'K',
  };

  function createDeck() {
    const deck = [];
    SUITS.forEach((suit) => {
      RANKS.forEach((rank) => {
        deck.push({ rank, suit });
      });
    });
    return deck;
  }

  function shuffleDeck(deck, random = Math.random) {
    const shuffled = deck.map(cloneCard);
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const nextIndex = Math.floor(random() * (index + 1));
      [shuffled[index], shuffled[nextIndex]] = [shuffled[nextIndex], shuffled[index]];
    }
    return shuffled;
  }

  function cloneCard(card) {
    return card ? { rank: card.rank, suit: card.suit } : null;
  }

  function validateCard(card) {
    if (!card || !RANK_VALUES.has(card.rank) || !SUITS.includes(card.suit)) {
      throw new Error('카드 정보가 올바르지 않습니다.');
    }
  }

  function cloneGrid(grid) {
    return grid.map((row) => row.map(cloneCard));
  }

  function createEmptyGrid() {
    return Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => null));
  }

  function drawFromDeck(deck) {
    const nextDeck = deck.map(cloneCard);
    return {
      currentCard: cloneCard(nextDeck.shift() || null),
      deck: nextDeck,
    };
  }

  function createGame(options = {}) {
    const sourceDeck = options.deck ? options.deck.map(cloneCard) : shuffleDeck(createDeck(), options.random);
    sourceDeck.forEach(validateCard);
    const firstDraw = drawFromDeck(sourceDeck);
    const grid = options.grid ? cloneGrid(options.grid) : createEmptyGrid();
    const placedCount = countPlaced(grid);
    const scores = scoreBoard(grid);

    return {
      grid,
      deck: firstDraw.deck,
      currentCard: firstDraw.currentCard,
      placedCount,
      rows: scores.rows,
      columns: scores.columns,
      totalScore: scores.totalScore,
      status: placedCount === SIZE * SIZE ? '완료' : '진행 중',
      message: firstDraw.currentCard ? `${cardLabel(firstDraw.currentCard)} 카드를 놓으세요.` : '놓을 카드가 없습니다.',
    };
  }

  function countPlaced(grid) {
    return grid.reduce((total, row) => total + row.filter(Boolean).length, 0);
  }

  function assertInBounds(row, col) {
    if (!Number.isInteger(row) || !Number.isInteger(col) || row < 0 || row >= SIZE || col < 0 || col >= SIZE) {
      throw new Error('칸 범위를 벗어났습니다.');
    }
  }

  function placeCard(game, row, col) {
    if (game.status !== '진행 중') {
      throw new Error('이미 끝난 판입니다.');
    }
    if (!game.currentCard) {
      throw new Error('놓을 카드가 없습니다.');
    }
    assertInBounds(row, col);
    if (game.grid[row][col]) {
      throw new Error('이미 카드가 놓인 칸입니다.');
    }

    const grid = cloneGrid(game.grid);
    grid[row][col] = cloneCard(game.currentCard);
    const placedCount = countPlaced(grid);
    const scores = scoreBoard(grid);
    const nextDraw = drawFromDeck(game.deck);
    const completed = placedCount === SIZE * SIZE;

    return {
      grid,
      deck: nextDraw.deck,
      currentCard: completed ? null : nextDraw.currentCard,
      placedCount,
      rows: scores.rows,
      columns: scores.columns,
      totalScore: scores.totalScore,
      status: completed ? '완료' : '진행 중',
      message: completed
        ? `말판 완성! 총 ${scores.totalScore}점입니다.`
        : `${cardLabel(grid[row][col])} 카드를 놓았습니다. 다음 카드: ${cardLabel(nextDraw.currentCard)}.`,
    };
  }

  function scoreBoard(grid) {
    const rows = grid.map(scoreHand);
    const columns = Array.from({ length: SIZE }, (_, col) => scoreHand(grid.map((row) => row[col])));
    const totalScore = rows.concat(columns).reduce((total, line) => total + line.score, 0);
    return { rows, columns, totalScore };
  }

  function scoreHand(cards) {
    if (!Array.isArray(cards) || cards.length !== SIZE || cards.some((card) => !card)) {
      return { name: '미완성', score: 0 };
    }
    cards.forEach(validateCard);

    const values = cards.map((card) => RANK_VALUES.get(card.rank)).sort((a, b) => a - b);
    const counts = Array.from(values.reduce((map, value) => {
      map.set(value, (map.get(value) || 0) + 1);
      return map;
    }, new Map()).values()).sort((a, b) => b - a);
    const flush = cards.every((card) => card.suit === cards[0].suit);
    const straight = isStraight(values);
    const royal = flush && values.join(',') === '1,10,11,12,13';

    if (royal) {
      return { name: '로열 플러시', score: 100 };
    }
    if (flush && straight) {
      return { name: '스트레이트 플러시', score: 30 };
    }
    if (counts[0] === 4) {
      return { name: '포카드', score: 16 };
    }
    if (counts[0] === 3 && counts[1] === 2) {
      return { name: '풀 하우스', score: 10 };
    }
    if (flush) {
      return { name: '플러시', score: 5 };
    }
    if (straight) {
      return { name: '스트레이트', score: 12 };
    }
    if (counts[0] === 3) {
      return { name: '트리플', score: 6 };
    }
    if (counts[0] === 2 && counts[1] === 2) {
      return { name: '투 페어', score: 3 };
    }
    if (counts[0] === 2) {
      return { name: '원 페어', score: 1 };
    }
    return { name: '높은 카드', score: 0 };
  }

  function isStraight(values) {
    const unique = Array.from(new Set(values));
    if (unique.length !== SIZE) {
      return false;
    }
    if (unique.join(',') === '1,2,3,4,5') {
      return true;
    }
    const aceHigh = unique.map((value) => (value === 1 ? 14 : value)).sort((a, b) => a - b);
    return aceHigh.every((value, index) => index === 0 || value === aceHigh[index - 1] + 1);
  }

  function cardLabel(card) {
    if (!card) {
      return '없음';
    }
    return `${SUIT_LABELS[card.suit]} ${RANK_LABELS[card.rank] || card.rank}`;
  }

  return {
    SIZE,
    RANKS,
    SUITS,
    createDeck,
    createGame,
    placeCard,
    scoreBoard,
    scoreHand,
    cardLabel,
  };
}));
