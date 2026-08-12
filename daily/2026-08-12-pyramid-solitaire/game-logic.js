(function definePyramid(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Pyramid = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const SUITS = ['♠', '♥', '♦', '♣'];
  const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const VALUES = { A: 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, J: 11, Q: 12, K: 13 };

  function createDeck() { return SUITS.flatMap((suit) => RANKS.map((rank) => ({ suit, rank }))); }
  function shuffleDeck(deck, random = Math.random) {
    const shuffled = deck.map((card) => ({ ...card }));
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const other = Math.floor(random() * (index + 1));
      [shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]];
    }
    return shuffled;
  }
  function validateDeck(deck) {
    if (!Array.isArray(deck) || deck.length < 28 || deck.some((card) => !card || !SUITS.includes(card.suit) || !RANKS.includes(card.rank))) throw new Error('카드 정보가 올바르지 않습니다.');
  }
  function copyGame(game) {
    return {
      pyramid: game.pyramid.map((card) => ({ ...card })), stock: game.stock.map((card) => ({ ...card })), waste: game.waste.map((card) => ({ ...card })),
      moves: game.moves, status: game.status, message: game.message,
    };
  }
  function isAvailable(game, index) {
    const card = game.pyramid[index];
    if (!card || card.removed) return false;
    const rowStart = (card.row * (card.row + 1)) / 2;
    const position = index - rowStart;
    const childStart = ((card.row + 1) * (card.row + 2)) / 2;
    return ![childStart + position, childStart + position + 1].some((child) => game.pyramid[child] && !game.pyramid[child].removed);
  }
  function availablePyramidIndexes(game) {
    return game.pyramid.map((_, index) => index).filter((index) => isAvailable(game, index));
  }
  function selectedCard(game, selection) {
    if (!selection || !selection.source) return null;
    if (selection.source === 'pyramid' && Number.isInteger(selection.index) && isAvailable(game, selection.index)) return game.pyramid[selection.index];
    if (selection.source === 'waste' && game.waste.length) return game.waste[game.waste.length - 1];
    return null;
  }
  function hasRemoval(game) {
    const available = availablePyramidIndexes(game).map((index) => game.pyramid[index]);
    const cards = game.waste.length ? [...available, game.waste[game.waste.length - 1]] : available;
    if (cards.some((card) => VALUES[card.rank] === 13)) return true;
    return cards.some((first, index) => cards.slice(index + 1).some((second) => VALUES[first.rank] + VALUES[second.rank] === 13));
  }
  function describe(game) {
    if (game.status === '성공') return `피라미드를 모두 비웠습니다! ${game.moves}번 제거했습니다.`;
    if (game.status === '실패') return `더 이상 가능한 짝이 없습니다. ${game.moves}번 제거했습니다.`;
    return `합이 13인 두 카드를 제거하세요. K는 혼자 제거할 수 있습니다. 남은 카드 ${game.pyramid.filter((card) => !card.removed).length}장`;
  }
  function finalize(game) {
    const remaining = game.pyramid.some((card) => !card.removed);
    game.status = !remaining ? '성공' : (!game.stock.length && !hasRemoval(game) ? '실패' : '진행 중');
    game.message = describe(game);
    return game;
  }
  function createGame(deck = createDeck()) {
    validateDeck(deck);
    const pyramid = deck.slice(0, 28).map((card, index) => ({ ...card, row: Math.floor((Math.sqrt(8 * index + 1) - 1) / 2), removed: false }));
    return finalize({ pyramid, stock: deck.slice(28).map((card) => ({ ...card })), waste: [], moves: 0, status: '진행 중', message: '' });
  }
  function removeKing(game, selection) {
    const chosen = selectedCard(game, selection);
    if (!game || game.status !== '진행 중' || !chosen || VALUES[chosen.rank] !== 13) throw new Error('제거할 수 없습니다.');
    const next = copyGame(game);
    if (selection.source === 'pyramid') next.pyramid[selection.index].removed = true;
    else next.waste.pop();
    next.moves += 1;
    return finalize(next);
  }
  function removePair(game, first, second) {
    const firstCard = selectedCard(game, first);
    const secondCard = selectedCard(game, second);
    const sameCard = first && second && first.source === second.source && first.index === second.index;
    if (!game || game.status !== '진행 중' || !firstCard || !secondCard || sameCard || VALUES[firstCard.rank] + VALUES[secondCard.rank] !== 13) throw new Error('제거할 수 없습니다.');
    const next = copyGame(game);
    [first, second].forEach((selection) => {
      if (selection.source === 'pyramid') next.pyramid[selection.index].removed = true;
      else next.waste.pop();
    });
    next.moves += 1;
    return finalize(next);
  }
  function drawCard(game) {
    if (!game || game.status !== '진행 중' || !game.stock.length) throw new Error('더 뽑을 카드가 없습니다.');
    const next = copyGame(game);
    next.waste.push(next.stock.pop());
    return finalize(next);
  }

  return { SUITS, RANKS, VALUES, createDeck, shuffleDeck, createGame, availablePyramidIndexes, removeKing, removePair, drawCard };
}));
