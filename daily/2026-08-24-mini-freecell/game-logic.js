(function defineFreecell(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Freecell = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const SUITS = ['clubs', 'diamonds', 'hearts', 'spades'];
  const RED_SUITS = new Set(['diamonds', 'hearts']);

  function cloneCard(card) { return card ? { suit: card.suit, rank: card.rank } : null; }

  function assertCard(card) {
    if (!card || !SUITS.includes(card.suit) || !Number.isInteger(card.rank) || card.rank < 1 || card.rank > 4) throw new Error('카드 정보가 올바르지 않습니다.');
  }

  function cloneState(state) {
    return {
      tableau: state.tableau.map((pile) => pile.map(cloneCard)),
      cells: state.cells.map(cloneCard),
      foundations: { ...state.foundations },
    };
  }

  function createState(state) {
    if (!state || !Array.isArray(state.tableau) || state.tableau.length !== 4 || !state.tableau.every(Array.isArray) || !Array.isArray(state.cells) || state.cells.length !== 2 || !state.foundations || typeof state.foundations !== 'object') throw new Error('게임 정보가 올바르지 않습니다.');
    state.tableau.flat().forEach(assertCard);
    state.cells.filter(Boolean).forEach(assertCard);
    SUITS.forEach((suit) => {
      if (!Number.isInteger(state.foundations[suit]) || state.foundations[suit] < 0 || state.foundations[suit] > 4) throw new Error('기초 더미 정보가 올바르지 않습니다.');
    });
    return cloneState(state);
  }

  function sourceCard(state, source) {
    const current = createState(state);
    const match = /^([tc])(\d)$/.exec(source);
    if (!match) throw new Error('카드를 고른 곳이 올바르지 않습니다.');
    const index = Number(match[2]);
    const card = match[1] === 't' ? current.tableau[index]?.at(-1) : current.cells[index];
    if (!card) throw new Error('옮길 카드가 없습니다.');
    return cloneCard(card);
  }

  function removeSource(state, source) {
    const match = /^([tc])(\d)$/.exec(source);
    const index = Number(match[2]);
    if (match[1] === 't') state.tableau[index].pop();
    else state.cells[index] = null;
  }

  function canStack(card, destination) {
    assertCard(card);
    if (!destination) return true;
    assertCard(destination);
    return RED_SUITS.has(card.suit) !== RED_SUITS.has(destination.suit) && card.rank === destination.rank - 1;
  }

  function moveToTableau(state, source, destinationIndex) {
    const next = createState(state);
    if (!Number.isInteger(destinationIndex) || destinationIndex < 0 || destinationIndex > 3) throw new Error('놓을 줄을 확인하세요.');
    const card = sourceCard(next, source);
    const destination = next.tableau[destinationIndex].at(-1);
    if (!canStack(card, destination)) throw new Error('그 줄에는 놓을 수 없는 카드입니다.');
    removeSource(next, source);
    next.tableau[destinationIndex].push(card);
    return next;
  }

  function moveToCell(state, source, cellIndex) {
    const next = createState(state);
    if (!Number.isInteger(cellIndex) || cellIndex < 0 || cellIndex > 1) throw new Error('빈 칸을 확인하세요.');
    if (next.cells[cellIndex]) throw new Error('그 빈 칸은 비어 있지 않습니다.');
    const card = sourceCard(next, source);
    removeSource(next, source);
    next.cells[cellIndex] = card;
    return next;
  }

  function moveToFoundation(state, source) {
    const next = createState(state);
    const card = sourceCard(next, source);
    if (next.foundations[card.suit] !== card.rank - 1) throw new Error('기초 더미에는 같은 무늬를 순서대로 놓아야 합니다.');
    removeSource(next, source);
    next.foundations[card.suit] = card.rank;
    return next;
  }

  function getStatus(state) {
    const current = createState(state);
    return SUITS.every((suit) => current.foundations[suit] === 4) ? 'won' : 'playing';
  }

  return { SUITS, createState, sourceCard, canStack, moveToTableau, moveToCell, moveToFoundation, getStatus };
}));
