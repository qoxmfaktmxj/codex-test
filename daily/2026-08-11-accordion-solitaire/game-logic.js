(function defineAccordion(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Accordion = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const SUITS = ['♠', '♥', '♦', '♣'];
  const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  function createDeck() {
    return SUITS.flatMap((suit) => RANKS.map((rank) => ({ suit, rank })));
  }

  function shuffleDeck(deck, random = Math.random) {
    const shuffled = deck.map((card) => ({ ...card }));
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const other = Math.floor(random() * (index + 1));
      [shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]];
    }
    return shuffled;
  }

  function validateDeck(deck) {
    if (!Array.isArray(deck) || deck.length === 0 || deck.some((card) => !card || !SUITS.includes(card.suit) || !RANKS.includes(card.rank))) throw new Error('카드 정보가 올바르지 않습니다.');
  }

  function topCard(pile) { return pile[pile.length - 1]; }
  function matches(first, second) { return first.suit === second.suit || first.rank === second.rank; }
  function possibleMoves(piles) {
    const moves = [];
    for (let from = 0; from < piles.length; from += 1) {
      [1, 3].forEach((distance) => {
        const to = from - distance;
        if (to >= 0 && matches(topCard(piles[from]), topCard(piles[to]))) moves.push({ from, to });
      });
    }
    return moves.sort((first, second) => first.from - second.from || first.to - second.to);
  }

  function describe(piles, moves, status) {
    if (status === '성공') return `카드를 한 더미로 모았습니다! ${moves}번 움직였습니다.`;
    if (status === '실패') return `옮길 수 있는 카드가 없습니다. ${piles.length}개 더미에서 멈췄습니다.`;
    return `${piles.length}개 더미가 남았습니다. 같은 무늬 또는 숫자 카드 위로 한 칸이나 세 칸 왼쪽에 옮기세요.`;
  }

  function buildGame(piles, moves) {
    const status = piles.length === 1 ? '성공' : (possibleMoves(piles).length ? '진행 중' : '실패');
    return { piles: piles.map((pile) => pile.map((card) => ({ ...card }))), moves, status, message: describe(piles, moves, status) };
  }

  function createGame(deck = createDeck()) {
    validateDeck(deck);
    return buildGame(deck.map((card) => [{ ...card }]), 0);
  }

  function legalMoves(game) {
    if (!game || game.status !== '진행 중') return [];
    return possibleMoves(game.piles);
  }

  function moveCard(game, from, to) {
    if (!game || game.status !== '진행 중' || !legalMoves(game).some((move) => move.from === from && move.to === to)) throw new Error('그 카드로는 옮길 수 없습니다.');
    const piles = game.piles.map((pile) => pile.map((card) => ({ ...card })));
    piles[to].push(piles[from].pop());
    if (piles[from].length === 0) piles.splice(from, 1);
    return buildGame(piles, game.moves + 1);
  }

  return { SUITS, RANKS, createDeck, shuffleDeck, createGame, legalMoves, moveCard };
}));
