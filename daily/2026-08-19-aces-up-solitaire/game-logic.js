(function defineAcesUp(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.AcesUp = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const SUITS = ['clubs', 'diamonds', 'hearts', 'spades'];
  const RANKS = Array.from({ length: 13 }, (_, index) => index + 2);

  function validatePiles(piles) {
    if (!Array.isArray(piles) || piles.length !== 4 || !piles.every((pile) => Array.isArray(pile))) {
      throw new Error('더미 정보가 올바르지 않습니다.');
    }
  }

  function clonePiles(piles) {
    return piles.map((pile) => pile.map((card) => ({ ...card })));
  }

  function topCard(pile) {
    return pile[pile.length - 1];
  }

  function createDeck() {
    return SUITS.flatMap((suit) => RANKS.map((rank) => ({ suit, rank })));
  }

  function shuffle(deck, random = Math.random) {
    const shuffled = deck.map((card) => ({ ...card }));
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(random() * (index + 1));
      [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
    }
    return shuffled;
  }

  function canDiscardTop(piles, pileIndex) {
    validatePiles(piles);
    const current = topCard(piles[pileIndex] || []);
    if (!current) return false;
    return piles.some((pile, index) => {
      const other = topCard(pile);
      return index !== pileIndex && other && other.suit === current.suit && other.rank > current.rank;
    });
  }

  function discardTop(piles, pileIndex) {
    if (!canDiscardTop(piles, pileIndex)) throw new Error('이 카드는 아직 버릴 수 없습니다.');
    const next = clonePiles(piles);
    next[pileIndex].pop();
    return next;
  }

  function moveTopToEmpty(piles, fromIndex, toIndex) {
    validatePiles(piles);
    if (!topCard(piles[fromIndex] || [])) throw new Error('옮길 카드가 없습니다.');
    if (fromIndex === toIndex || !Array.isArray(piles[toIndex]) || piles[toIndex].length > 0) {
      throw new Error('카드는 비어 있는 더미로만 옮길 수 있습니다.');
    }
    const next = clonePiles(piles);
    next[toIndex].push(next[fromIndex].pop());
    return next;
  }

  function deal(piles, deck) {
    validatePiles(piles);
    if (!Array.isArray(deck)) throw new Error('카드 더미 정보가 올바르지 않습니다.');
    const nextPiles = clonePiles(piles);
    const nextDeck = deck.map((card) => ({ ...card }));
    nextPiles.forEach((pile) => {
      if (nextDeck.length) pile.push(nextDeck.shift());
    });
    return { piles: nextPiles, deck: nextDeck };
  }

  function isWon(piles) {
    validatePiles(piles);
    return piles.every((pile) => pile.length === 1 && topCard(pile).rank === 14);
  }

  return { createDeck, shuffle, canDiscardTop, discardTop, moveTopToEmpty, deal, isWon };
}));
