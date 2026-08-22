(function defineCrazyEights(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.CrazyEights = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const SUITS = ['♥', '♦', '♣', '♠'];

  function cloneCard(card) {
    return { rank: card.rank, suit: card.suit };
  }

  function assertCard(card) {
    if (!card || !Number.isInteger(card.rank) || card.rank < 1 || card.rank > 8 || !SUITS.includes(card.suit)) {
      throw new Error('카드 정보가 올바르지 않습니다.');
    }
  }

  function cloneState(state) {
    return {
      hands: state.hands.map((hand) => hand.map(cloneCard)),
      drawPile: state.drawPile.map(cloneCard),
      discardPile: state.discardPile.map(cloneCard),
      activeSuit: state.activeSuit,
      turn: state.turn,
      passes: state.passes || 0,
    };
  }

  function createState(state) {
    if (!state || !Array.isArray(state.hands) || state.hands.length !== 2 || !Array.isArray(state.drawPile) || !Array.isArray(state.discardPile) || !state.discardPile.length || !SUITS.includes(state.activeSuit) || !Number.isInteger(state.turn) || state.turn < 0 || state.turn > 1 || (state.passes !== undefined && (!Number.isInteger(state.passes) || state.passes < 0))) {
      throw new Error('게임 정보가 올바르지 않습니다.');
    }
    [...state.hands.flat(), ...state.drawPile, ...state.discardPile].forEach(assertCard);
    return cloneState(state);
  }

  function canPlayCard(card, topCard, activeSuit = topCard && topCard.suit) {
    assertCard(card);
    assertCard(topCard);
    if (!SUITS.includes(activeSuit)) throw new Error('현재 무늬 정보가 올바르지 않습니다.');
    return card.rank === 8 || card.rank === topCard.rank || card.suit === activeSuit;
  }

  function playCard(state, player, cardIndex, chosenSuit) {
    const next = createState(state);
    if (next.turn !== player || !Number.isInteger(cardIndex) || !next.hands[player]) throw new Error('차례를 확인하세요.');
    const card = next.hands[player][cardIndex];
    const topCard = next.discardPile.at(-1);
    if (!card || !canPlayCard(card, topCard, next.activeSuit)) throw new Error('낼 수 없는 카드입니다.');
    if (card.rank === 8 && !SUITS.includes(chosenSuit)) throw new Error('팔자를 낼 때는 무늬를 골라야 합니다.');
    next.hands[player].splice(cardIndex, 1);
    next.discardPile.push(card);
    next.activeSuit = card.rank === 8 ? chosenSuit : card.suit;
    next.turn = player === 0 ? 1 : 0;
    next.passes = 0;
    return next;
  }

  function drawCard(state, player) {
    const next = createState(state);
    if (next.turn !== player) throw new Error('차례를 확인하세요.');
    if (!next.drawPile.length && next.discardPile.length > 1) {
      const topCard = next.discardPile.pop();
      next.drawPile = next.discardPile.reverse();
      next.discardPile = [topCard];
    }
    const card = next.drawPile.pop();
    if (!card) throw new Error('뽑을 카드가 없습니다.');
    next.hands[player].push(card);
    next.turn = player === 0 ? 1 : 0;
    next.passes = 0;
    return next;
  }

  function passTurn(state, player) {
    const next = createState(state);
    if (next.turn !== player || next.drawPile.length || next.discardPile.length > 1 || playableIndexes(next, player).length) {
      throw new Error('아직 차례를 넘길 수 없습니다.');
    }
    next.turn = player === 0 ? 1 : 0;
    next.passes += 1;
    return next;
  }

  function playableIndexes(state, player) {
    const current = createState(state);
    if (!current.hands[player]) throw new Error('플레이어 정보를 확인하세요.');
    const topCard = current.discardPile.at(-1);
    return current.hands[player].flatMap((card, index) => canPlayCard(card, topCard, current.activeSuit) ? [index] : []);
  }

  function chooseSuit(hand) {
    return SUITS.map((suit) => ({ suit, count: hand.filter((card) => card.suit === suit).length }))
      .sort((left, right) => right.count - left.count || SUITS.indexOf(left.suit) - SUITS.indexOf(right.suit))[0].suit;
  }

  function getStatus(state) {
    const current = createState(state);
    if (current.hands[0].length === 0) return 'player-won';
    if (current.hands[1].length === 0) return 'computer-won';
    if (current.passes >= 2) return 'draw';
    return 'playing';
  }

  return { createState, canPlayCard, playCard, drawCard, passTurn, playableIndexes, chooseSuit, getStatus, SUITS };
}));
