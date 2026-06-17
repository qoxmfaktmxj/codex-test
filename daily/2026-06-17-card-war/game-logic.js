const SUITS = ['하트', '다이아몬드', '클럽', '스페이드'];
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const DEFAULT_ROUND_LIMIT = 10;
const RANK_LABELS = {
  J: '잭',
  Q: '퀸',
  K: '킹',
  A: '에이스',
};

function getRankValue(rank) {
  const index = RANKS.indexOf(rank);
  return index === -1 ? 0 : index + 2;
}

function createDeck() {
  return SUITS.flatMap((suit) =>
    RANKS.map((rank) => ({
      suit,
      rank,
      value: getRankValue(rank),
      label: `${suit} ${RANK_LABELS[rank] || rank}`,
    })),
  );
}

function cloneCard(card) {
  return {
    suit: card.suit,
    rank: card.rank,
    value: Number(card.value),
    label: card.label || `${card.suit} ${RANK_LABELS[card.rank] || card.rank}`,
  };
}

function normalizeDeck(deck) {
  const source = Array.isArray(deck) ? deck : [];
  return source
    .filter((card) => card && SUITS.includes(card.suit) && RANKS.includes(card.rank))
    .map(cloneCard);
}

function shuffleDeck(deck, random = Math.random) {
  const next = normalizeDeck(deck);
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }
  return next;
}

function normalizeScores(scores) {
  return {
    나: Math.max(0, Math.floor(Number(scores && scores['나']) || 0)),
    컴퓨터: Math.max(0, Math.floor(Number(scores && scores['컴퓨터']) || 0)),
  };
}

function createGame(options = {}) {
  const deck = Array.isArray(options.deck) ? normalizeDeck(options.deck) : shuffleDeck(createDeck());
  const roundLimit = Math.max(1, Math.floor(Number(options.roundLimit) || DEFAULT_ROUND_LIMIT));
  return {
    deck,
    round: Math.max(0, Math.floor(Number(options.round) || 0)),
    roundLimit,
    scores: normalizeScores(options.scores),
    status: options.status || '진행 중',
    lastRound: options.lastRound || null,
    history: Array.isArray(options.history) ? options.history.slice(0, 5) : [],
    message: options.message || '카드 뽑기를 눌러 더 높은 카드를 겨루세요.',
  };
}

function cloneGame(game) {
  return {
    ...game,
    deck: normalizeDeck(game.deck),
    scores: { ...game.scores },
    lastRound: game.lastRound ? { ...game.lastRound } : null,
    history: game.history.map((round) => ({ ...round })),
  };
}

function formatCard(card) {
  if (!card) {
    return '카드 없음';
  }
  return card.label || `${card.suit} ${RANK_LABELS[card.rank] || card.rank}`;
}

function getWinner(game) {
  if (game.scores['나'] === game.scores['컴퓨터']) {
    return '무승부';
  }
  return game.scores['나'] > game.scores['컴퓨터'] ? '나' : '컴퓨터';
}

function makeFinishMessage(game) {
  const winner = getWinner(game);
  if (winner === '무승부') {
    return '무승부입니다. 같은 수의 라운드를 가져갔습니다.';
  }
  if (winner === '나') {
    return '내 승리! 더 높은 카드를 많이 냈습니다.';
  }
  return '컴퓨터 승리! 다음 판에서 다시 도전하세요.';
}

function makeRoundMessage(result, playerCard, computerCard) {
  if (result === '나') {
    return `${formatCard(playerCard)}로 이겼습니다. 다음 카드를 뽑으세요.`;
  }
  if (result === '컴퓨터') {
    return `${formatCard(computerCard)}에 졌습니다. 다음 카드를 뽑으세요.`;
  }
  return `같은 ${playerCard.rank}입니다. 점수 없이 넘어갑니다.`;
}

function finishGame(game) {
  game.status = '완료';
  game.message = makeFinishMessage(game);
  return game;
}

function drawRound(game) {
  if (!game || game.status !== '진행 중') {
    return game;
  }

  const next = cloneGame(game);
  if (next.deck.length < 2) {
    return finishGame(next);
  }

  const playerCard = next.deck.shift();
  const computerCard = next.deck.shift();
  let result = '무승부';

  if (playerCard.value > computerCard.value) {
    result = '나';
    next.scores['나'] += 1;
  } else if (computerCard.value > playerCard.value) {
    result = '컴퓨터';
    next.scores['컴퓨터'] += 1;
  }

  next.round += 1;
  next.lastRound = {
    playerCard,
    computerCard,
    result,
  };
  next.history = [next.lastRound, ...next.history].slice(0, 5);
  next.message = makeRoundMessage(result, playerCard, computerCard);

  if (next.round >= next.roundLimit || next.deck.length < 2) {
    return finishGame(next);
  }

  return next;
}

function resetGame(random = Math.random) {
  return createGame({
    deck: shuffleDeck(createDeck(), random),
    roundLimit: DEFAULT_ROUND_LIMIT,
  });
}

const CardWarLogic = {
  RANKS,
  SUITS,
  DEFAULT_ROUND_LIMIT,
  createDeck,
  createGame,
  drawRound,
  formatCard,
  getWinner,
  resetGame,
  shuffleDeck,
};

if (typeof module !== 'undefined') {
  module.exports = CardWarLogic;
}

if (typeof window !== 'undefined') {
  window.CardWarLogic = CardWarLogic;
}
