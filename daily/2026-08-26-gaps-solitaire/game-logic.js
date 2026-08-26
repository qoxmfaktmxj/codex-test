(function defineGaps(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.GapsSolitaire = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const SUITS = ['clubs', 'diamonds', 'hearts', 'spades'];

  function cloneCard(card) { return card ? { suit: card.suit, rank: card.rank } : null; }

  function assertCard(card) {
    if (!card || !SUITS.includes(card.suit) || !Number.isInteger(card.rank) || card.rank < 1 || card.rank > 13) throw new Error('카드 정보가 올바르지 않습니다.');
  }

  function createBoard(board) {
    if (!Array.isArray(board)) throw new Error('말판 정보가 올바르지 않습니다.');
    board.filter(Boolean).forEach(assertCard);
    return board.map(cloneCard);
  }

  function findGaps(board) {
    return createBoard(board).flatMap((card, index) => card ? [] : [index]);
  }

  function canFillGap(board, gapIndex, card) {
    const current = createBoard(board);
    assertCard(card);
    if (!Number.isInteger(gapIndex) || gapIndex < 0 || gapIndex >= current.length || current[gapIndex]) return false;
    if (gapIndex % 13 === 0) return card.rank === 2;
    const previous = current[gapIndex - 1];
    return Boolean(previous && previous.rank < 13 && previous.suit === card.suit && previous.rank + 1 === card.rank);
  }

  function moveCard(board, sourceIndex, gapIndex) {
    const next = createBoard(board);
    if (!Number.isInteger(sourceIndex) || sourceIndex < 0 || sourceIndex >= next.length || !next[sourceIndex]) throw new Error('움직일 카드를 확인하세요.');
    const moving = next[sourceIndex];
    if (!canFillGap(next, gapIndex, moving)) throw new Error('그 빈칸에는 카드를 놓을 수 없습니다.');
    next[gapIndex] = moving;
    next[sourceIndex] = null;
    return next;
  }

  function getStatus(board) {
    const current = createBoard(board);
    if (current.length !== 52) return 'playing';
    const rowSuits = [];
    for (let row = 0; row < 4; row += 1) {
      const start = row * 13;
      const suit = current[start]?.suit;
      if (!suit || current[start + 12] !== null) return 'playing';
      for (let column = 0; column < 12; column += 1) {
        const card = current[start + column];
        if (!card || card.suit !== suit || card.rank !== column + 2) return 'playing';
      }
      rowSuits.push(suit);
    }
    return new Set(rowSuits).size === 4 ? 'won' : 'playing';
  }

  return { SUITS, createBoard, findGaps, canFillGap, moveCard, getStatus };
}));
