(function defineKlondike(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Klondike = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const SUITS = ['♥', '♦', '♣', '♠'];
  const RED_SUITS = new Set(['♥', '♦']);

  function cloneCard(card) {
    return { rank: card.rank, suit: card.suit, faceUp: card.faceUp !== false };
  }

  function cloneState(state) {
    return {
      tableau: state.tableau.map((pile) => pile.map(cloneCard)),
      foundations: Object.fromEntries(SUITS.map((suit) => [suit, (state.foundations[suit] || []).map(cloneCard)])),
    };
  }

  function assertCard(card) {
    if (!card || !Number.isInteger(card.rank) || card.rank < 1 || card.rank > 13 || !SUITS.includes(card.suit)) {
      throw new Error('카드 정보가 올바르지 않습니다.');
    }
  }

  function createState(state) {
    if (!state || !Array.isArray(state.tableau) || !state.foundations) throw new Error('게임 정보가 올바르지 않습니다.');
    state.tableau.forEach((pile) => {
      if (!Array.isArray(pile)) throw new Error('카드 더미 정보가 올바르지 않습니다.');
      pile.forEach(assertCard);
    });
    SUITS.forEach((suit) => (state.foundations[suit] || []).forEach(assertCard));
    return cloneState(state);
  }

  function isRed(card) {
    return RED_SUITS.has(card.suit);
  }

  function canPlaceOnTableau(card, target) {
    assertCard(card);
    if (!target) return card.rank === 13;
    assertCard(target);
    return target.faceUp !== false && card.rank === target.rank - 1 && isRed(card) !== isRed(target);
  }

  function canPlaceOnFoundation(card, foundation) {
    assertCard(card);
    if (!Array.isArray(foundation)) throw new Error('기초 더미 정보가 올바르지 않습니다.');
    const top = foundation.at(-1);
    return top ? top.suit === card.suit && card.rank === top.rank + 1 : card.rank === 1;
  }

  function revealTop(pile) {
    const top = pile.at(-1);
    if (top && top.faceUp === false) top.faceUp = true;
  }

  function moveTableauCard(state, sourceIndex, destinationIndex, sourceCardIndex) {
    const next = cloneState(state);
    const source = next.tableau[sourceIndex];
    const destination = next.tableau[destinationIndex];
    if (!source || !destination || sourceIndex === destinationIndex) throw new Error('옮길 더미를 확인하세요.');
    const cardIndex = sourceCardIndex === undefined ? source.length - 1 : sourceCardIndex;
    if (cardIndex !== source.length - 1) throw new Error('맨 위 카드만 옮길 수 있습니다.');
    const card = source.at(-1);
    if (!card || card.faceUp === false) throw new Error('뒤집힌 카드는 옮길 수 없습니다.');
    if (!canPlaceOnTableau(card, destination.at(-1))) throw new Error('이 카드 위에는 놓을 수 없습니다.');
    destination.push(source.pop());
    revealTop(source);
    return next;
  }

  function moveToFoundation(state, sourceIndex) {
    const next = cloneState(state);
    const source = next.tableau[sourceIndex];
    if (!source) throw new Error('카드 더미를 확인하세요.');
    const card = source.at(-1);
    if (!card || card.faceUp === false) throw new Error('뒤집힌 카드는 기초 더미로 옮길 수 없습니다.');
    const foundation = next.foundations[card.suit];
    if (!canPlaceOnFoundation(card, foundation)) throw new Error('기초 더미 순서에 맞지 않습니다.');
    foundation.push(source.pop());
    revealTop(source);
    return next;
  }

  function getStatus(state) {
    const totalFoundationCards = SUITS.reduce((total, suit) => total + (state.foundations[suit] || []).length, 0);
    const remainingTableauCards = state.tableau.reduce((total, pile) => total + pile.length, 0);
    return totalFoundationCards === 52 || (totalFoundationCards === 20 && remainingTableauCards === 0) ? 'won' : 'playing';
  }

  return { createState, canPlaceOnTableau, canPlaceOnFoundation, moveTableauCard, moveToFoundation, getStatus };
}));
