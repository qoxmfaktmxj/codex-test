(function defineGolfSolitaire(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.GolfSolitaire = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const SUITS = ['♠', '♥', '♦', '♣'];

  function createDeck() {
    return RANKS.flatMap((rank) => SUITS.map((suit) => ({ rank, suit, id: `${rank}${suit}` })));
  }

  function shuffleDeck(deck, random = Math.random) {
    const shuffled = deck.map((item) => ({ ...item }));
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const other = Math.floor(random() * (index + 1));
      [shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]];
    }
    return shuffled;
  }

  function isAdjacentRank(first, second) {
    const firstIndex = RANKS.indexOf(first);
    const secondIndex = RANKS.indexOf(second);
    return firstIndex >= 0 && secondIndex >= 0 && Math.abs(firstIndex - secondIndex) === 1;
  }

  function copyGame(game) {
    return {
      tableau: game.tableau.map((column) => column.map((item) => ({ ...item }))),
      stock: game.stock.map((item) => ({ ...item })), waste: { ...game.waste },
      status: game.status, message: game.message, moves: game.moves,
    };
  }

  function remainingCards(game) {
    return game.tableau.reduce((total, column) => total + column.length, 0);
  }

  function hasMove(game) {
    return game.tableau.some((column) => column.length
      && isAdjacentRank(column.at(-1).rank, game.waste.rank));
  }

  function updateStatus(game) {
    if (remainingCards(game) === 0) {
      game.status = '승리';
      game.message = `모든 카드를 치웠습니다! ${game.moves}번 만에 골프장을 정복했습니다.`;
    } else if (game.stock.length === 0 && !hasMove(game)) {
      game.status = '패배';
      game.message = '더 꺼낼 카드와 놓을 카드가 없습니다. 새 게임으로 다시 도전하세요.';
    } else {
      game.status = '진행 중';
      game.message = '버린 카드보다 숫자가 하나 높거나 낮은 맨 위 카드를 골라보세요.';
    }
    return game;
  }

  function createGame(deck = createDeck()) {
    if (!Array.isArray(deck) || deck.length !== 52 || new Set(deck.map((item) => item && item.id)).size !== 52) {
      throw new Error('카드 정보가 올바르지 않습니다.');
    }
    const tableau = Array.from({ length: 7 }, (_, index) => deck.slice(index * 5, index * 5 + 5).map((item) => ({ ...item })));
    return updateStatus({
      tableau, stock: deck.slice(35, 51).map((item) => ({ ...item })), waste: { ...deck[51] },
      status: '진행 중', message: '', moves: 0,
    });
  }

  function removeCard(game, columnIndex) {
    if (!game || game.status !== '진행 중' || !Number.isInteger(columnIndex) || !game.tableau[columnIndex]
      || !game.tableau[columnIndex].length || !isAdjacentRank(game.tableau[columnIndex].at(-1).rank, game.waste.rank)) {
      throw new Error('놓을 수 없는 카드입니다.');
    }
    const next = copyGame(game);
    next.waste = next.tableau[columnIndex].pop();
    next.moves += 1;
    return updateStatus(next);
  }

  function drawStock(game) {
    if (!game || game.status !== '진행 중' || !game.stock.length) throw new Error('더 꺼낼 카드가 없습니다.');
    const next = copyGame(game);
    next.waste = next.stock.pop();
    next.moves += 1;
    return updateStatus(next);
  }

  return { RANKS, SUITS, createDeck, shuffleDeck, isAdjacentRank, createGame, removeCard, drawStock };
}));
