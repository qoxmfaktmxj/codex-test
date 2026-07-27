(function defineClockSolitaire(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.ClockSolitaire = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const SUITS = ['스페이드', '하트', '다이아몬드', '클럽'];
  const KING_PILE = 12;

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
    const shuffled = deck.map((card) => ({ ...card }));
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled;
  }

  function validateDeck(deck) {
    if (!Array.isArray(deck) || deck.length !== 52) {
      throw new Error('덱은 52장이어야 합니다.');
    }
    const seen = new Set();
    deck.forEach((card) => {
      if (!card || !RANKS.includes(card.rank) || !SUITS.includes(card.suit)) {
        throw new Error('카드 구성이 올바르지 않습니다.');
      }
      const key = `${card.suit}-${card.rank}`;
      if (seen.has(key)) {
        throw new Error('중복 카드가 있습니다.');
      }
      seen.add(key);
    });
  }

  function deal(deck) {
    const piles = Array.from({ length: 13 }, () => ({ faceDown: [], faceUp: [] }));
    deck.forEach((card, index) => {
      piles[index % 13].faceDown.push({ ...card });
    });
    return piles;
  }

  function clonePiles(piles) {
    return piles.map((pile) => ({
      faceDown: pile.faceDown.map((card) => ({ ...card })),
      faceUp: pile.faceUp.map((card) => ({ ...card })),
    }));
  }

  function rankToPile(rank) {
    const index = RANKS.indexOf(rank);
    if (index === -1) {
      throw new Error('카드 숫자가 올바르지 않습니다.');
    }
    return index;
  }

  function pileLabel(index) {
    return RANKS[index];
  }

  function createGame(options = {}) {
    const deck = options.deck
      ? options.deck.map((card) => ({ ...card }))
      : shuffleDeck(createDeck(), options.random || Math.random);
    validateDeck(deck);
    return {
      piles: deal(deck),
      currentPile: KING_PILE,
      revealedCount: 0,
      status: '진행 중',
      message: '가운데 왕 더미에서 첫 카드를 뒤집으세요.',
    };
  }

  function turnCard(game) {
    if (game.status !== '진행 중') {
      throw new Error('이미 끝난 판입니다.');
    }
    const piles = clonePiles(game.piles);
    const pile = piles[game.currentPile];
    if (!pile || pile.faceDown.length === 0) {
      return {
        ...game,
        piles,
        status: '패배',
        message: `${pileLabel(game.currentPile)} 더미에 더 뒤집을 카드가 없어 실패했습니다.`,
      };
    }

    const card = pile.faceDown.shift();
    pile.faceUp.push(card);
    const revealedCount = game.revealedCount + 1;
    const nextPile = rankToPile(card.rank);
    const cardName = `${card.suit} ${card.rank}`;

    if (revealedCount === 52) {
      return {
        ...game,
        piles,
        currentPile: nextPile,
        revealedCount,
        status: '승리',
        message: `${cardName}까지 모든 카드를 열어 승리했습니다.`,
      };
    }

    if (card.rank === 'K' && piles[KING_PILE].faceUp.length === 4) {
      return {
        ...game,
        piles,
        currentPile: KING_PILE,
        revealedCount,
        status: '패배',
        message: '왕 네 장이 모두 먼저 열렸습니다. 남은 카드가 있어 실패했습니다.',
      };
    }

    return {
      ...game,
      piles,
      currentPile: nextPile,
      revealedCount,
      message: `${cardName}을 열었습니다. ${pileLabel(nextPile)} 더미로 이동하세요.`,
    };
  }

  return {
    KING_PILE,
    RANKS,
    SUITS,
    createDeck,
    createGame,
    pileLabel,
    rankToPile,
    shuffleDeck,
    turnCard,
  };
}));
