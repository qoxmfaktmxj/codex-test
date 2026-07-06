(function defineAceyDeucey(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.AceyDeucey = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const SUITS = ['spades', 'hearts', 'diamonds', 'clubs'];
  const SUIT_LABELS = {
    spades: '스페이드',
    hearts: '하트',
    diamonds: '다이아몬드',
    clubs: '클럽',
  };
  const DEFAULT_MESSAGE = '두 카드 사이에 다음 카드가 들어갈지 배팅하세요.';

  function cloneCard(card) {
    return card ? { rank: card.rank, suit: card.suit } : null;
  }

  function cloneHistoryEntry(entry) {
    return {
      ...entry,
      lowCard: cloneCard(entry.lowCard),
      highCard: cloneCard(entry.highCard),
      revealedCard: cloneCard(entry.revealedCard),
    };
  }

  function cloneGame(game, overrides = {}) {
    return {
      chips: game.chips,
      targetChips: game.targetChips,
      round: game.round,
      lowCard: cloneCard(game.lowCard),
      highCard: cloneCard(game.highCard),
      lastCard: cloneCard(game.lastCard),
      deck: game.deck.map(cloneCard),
      history: game.history.map(cloneHistoryEntry),
      status: game.status,
      message: game.message,
      ...overrides,
    };
  }

  function createDeck() {
    const deck = [];
    SUITS.forEach((suit) => {
      for (let rank = 2; rank <= 14; rank += 1) {
        deck.push({ rank, suit });
      }
    });
    return shuffle(deck);
  }

  function shuffle(cards) {
    const deck = cards.map(cloneCard);
    for (let index = deck.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [deck[index], deck[swapIndex]] = [deck[swapIndex], deck[index]];
    }
    return deck;
  }

  function sortOpenCards(cardA, cardB) {
    return cardA.rank <= cardB.rank
      ? { lowCard: cloneCard(cardA), highCard: cloneCard(cardB) }
      : { lowCard: cloneCard(cardB), highCard: cloneCard(cardA) };
  }

  function dealOpenCards(deck) {
    const workingDeck = deck.length >= 2 ? deck.map(cloneCard) : createDeck();
    const first = workingDeck.shift();
    const second = workingDeck.shift();
    return {
      ...sortOpenCards(first, second),
      deck: workingDeck,
    };
  }

  function rankLabel(rank) {
    if (rank === 11) {
      return 'J';
    }
    if (rank === 12) {
      return 'Q';
    }
    if (rank === 13) {
      return 'K';
    }
    if (rank === 14) {
      return 'A';
    }
    return String(rank);
  }

  function cardLabel(card) {
    return `${rankLabel(card.rank)} ${SUIT_LABELS[card.suit]}`;
  }

  function createGame(options = {}) {
    const deck = options.deck ? options.deck.map(cloneCard) : createDeck();
    const dealt = options.lowCard && options.highCard
      ? {
        lowCard: cloneCard(options.lowCard),
        highCard: cloneCard(options.highCard),
        deck,
      }
      : dealOpenCards(deck);

    return {
      chips: options.chips ?? 20,
      targetChips: options.targetChips ?? 40,
      round: options.round ?? 1,
      lowCard: dealt.lowCard,
      highCard: dealt.highCard,
      lastCard: cloneCard(options.lastCard),
      deck: dealt.deck,
      history: (options.history || []).map(cloneHistoryEntry),
      status: options.status || '진행 중',
      message: options.message || DEFAULT_MESSAGE,
    };
  }

  function isBetween(card, lowCard, highCard) {
    return card.rank > lowCard.rank && card.rank < highCard.rank;
  }

  function nextDeckForReveal(deck) {
    return deck.length >= 1 ? deck.map(cloneCard) : createDeck();
  }

  function placeBet(game, bet) {
    if (game.status !== '진행 중') {
      return cloneGame(game, {
        message: '이미 끝난 판입니다. 새 판을 시작하세요.',
      });
    }

    if (!Number.isInteger(bet) || bet < 1 || bet > game.chips) {
      return cloneGame(game, {
        message: '가진 칩 안에서 1칩 이상 배팅하세요.',
      });
    }

    const deck = nextDeckForReveal(game.deck);
    const revealedCard = deck.shift();
    const won = isBetween(revealedCard, game.lowCard, game.highCard);
    const chips = game.chips + (won ? bet : -bet);
    const outcome = won ? '승리' : '패배';
    const history = game.history.concat({
      round: game.round,
      bet,
      outcome,
      lowCard: cloneCard(game.lowCard),
      highCard: cloneCard(game.highCard),
      revealedCard: cloneCard(revealedCard),
      chips,
    });
    const baseMessage = won
      ? `${cardLabel(revealedCard)} 카드가 사이에 들어왔습니다. ${bet}칩을 얻었습니다.`
      : `${cardLabel(revealedCard)} 카드는 사이에 없습니다. ${bet}칩을 잃었습니다.`;

    if (chips <= 0) {
      return cloneGame(game, {
        chips: 0,
        lastCard: revealedCard,
        deck,
        history,
        status: '파산',
        message: `${baseMessage} 칩이 모두 사라졌습니다.`,
      });
    }

    if (chips >= game.targetChips) {
      return cloneGame(game, {
        chips,
        lastCard: revealedCard,
        deck,
        history,
        status: '성공',
        message: `${baseMessage} 목표 칩에 도달했습니다.`,
      });
    }

    const dealt = dealOpenCards(deck);
    return cloneGame(game, {
      chips,
      round: game.round + 1,
      lowCard: dealt.lowCard,
      highCard: dealt.highCard,
      lastCard: revealedCard,
      deck: dealt.deck,
      history,
      message: baseMessage,
    });
  }

  function passRound(game) {
    if (game.status !== '진행 중') {
      return cloneGame(game, {
        message: '이미 끝난 판입니다. 새 판을 시작하세요.',
      });
    }

    const dealt = dealOpenCards(game.deck);
    return cloneGame(game, {
      round: game.round + 1,
      lowCard: dealt.lowCard,
      highCard: dealt.highCard,
      deck: dealt.deck,
      lastCard: null,
      history: game.history.concat({
        round: game.round,
        bet: 0,
        outcome: '패스',
        lowCard: cloneCard(game.lowCard),
        highCard: cloneCard(game.highCard),
        revealedCard: null,
        chips: game.chips,
      }),
      message: '이번 판을 넘겼습니다. 새 카드 두 장을 펼쳤습니다.',
    });
  }

  return {
    cardLabel,
    createDeck,
    createGame,
    isBetween,
    passRound,
    placeBet,
    rankLabel,
  };
}));
