const DEFAULT_VALUES = ['A', 'B', 'C', 'D', 'A', 'B', 'C', 'D'];

function createGame(values = DEFAULT_VALUES) {
  return {
    cards: values.map((value, id) => ({
      id,
      value,
      isFaceUp: false,
      isMatched: false,
    })),
    flippedIds: [],
    moves: 0,
    status: 'playing',
  };
}

function flipCard(game, id) {
  const card = game.cards[id];
  if (
    game.status !== 'playing' ||
    !card ||
    card.isFaceUp ||
    card.isMatched ||
    game.flippedIds.length >= 2
  ) {
    return game;
  }

  const cards = game.cards.map((item) => (
    item.id === id ? { ...item, isFaceUp: true } : item
  ));
  const flippedIds = game.flippedIds.concat(id);

  if (flippedIds.length < 2) {
    return {
      ...game,
      cards,
      flippedIds,
    };
  }

  const [firstId, secondId] = flippedIds;
  const isMatch = cards[firstId].value === cards[secondId].value;
  if (!isMatch) {
    return {
      ...game,
      cards,
      flippedIds,
      moves: game.moves + 1,
    };
  }

  const matchedCards = cards.map((item) => (
    item.id === firstId || item.id === secondId
      ? { ...item, isMatched: true }
      : item
  ));
  const status = matchedCards.every((item) => item.isMatched) ? 'won' : 'playing';

  return {
    cards: matchedCards,
    flippedIds: [],
    moves: game.moves + 1,
    status,
  };
}

function hideUnmatched(game) {
  if (game.flippedIds.length !== 2) {
    return game;
  }

  const [firstId, secondId] = game.flippedIds;
  if (game.cards[firstId].value === game.cards[secondId].value) {
    return game;
  }

  return {
    ...game,
    cards: game.cards.map((card) => (
      card.id === firstId || card.id === secondId
        ? { ...card, isFaceUp: false }
        : card
    )),
    flippedIds: [],
  };
}

function shuffledValues(values = DEFAULT_VALUES) {
  return values
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((item) => item.value);
}

const gameLogic = {
  DEFAULT_VALUES,
  createGame,
  flipCard,
  hideUnmatched,
  shuffledValues,
};

if (typeof module !== 'undefined') {
  module.exports = gameLogic;
}

if (typeof window !== 'undefined') {
  window.gameLogic = gameLogic;
}
