const TARGET_STREAK = 7;
const START_LIVES = 3;
const VALID_GUESSES = ['higher', 'lower', 'same'];

function createDeck() {
  const deck = [];
  for (let suit = 0; suit < 4; suit += 1) {
    for (let rank = 1; rank <= 13; rank += 1) {
      deck.push(rank);
    }
  }

  for (let index = deck.length - 1; index > 0; index -= 1) {
    const next = Math.floor(Math.random() * (index + 1));
    [deck[index], deck[next]] = [deck[next], deck[index]];
  }

  return deck;
}

function normalizeDeck(deck) {
  const cards = Array.isArray(deck) && deck.length > 0 ? deck : createDeck();
  return cards
    .map((card) => Math.floor(Number(card)))
    .filter((card) => card >= 1 && card <= 13);
}

function normalizeCount(value, fallback = 0) {
  const count = Math.floor(Number(value));
  return Number.isFinite(count) && count >= 0 ? count : fallback;
}

function createGame(options = {}) {
  const cards = normalizeDeck(options.deck);
  const currentCard = options.currentCard || cards.shift() || 1;
  const streak = normalizeCount(options.streak);
  const bestStreak = Math.max(streak, normalizeCount(options.bestStreak));

  return {
    targetStreak: normalizeCount(options.targetStreak, TARGET_STREAK) || TARGET_STREAK,
    currentCard,
    deck: cards,
    streak,
    bestStreak,
    lives: normalizeCount(options.lives, START_LIVES) || START_LIVES,
    status: options.status || '진행 중',
    message: options.message || '다음 카드가 더 높을지 낮을지 맞혀 보세요.',
    lastCard: options.lastCard || null,
  };
}

function compareCards(currentCard, nextCard) {
  if (nextCard > currentCard) {
    return 'higher';
  }
  if (nextCard < currentCard) {
    return 'lower';
  }
  return 'same';
}

function directionText(direction) {
  if (direction === 'higher') {
    return '더 높았습니다';
  }
  if (direction === 'lower') {
    return '더 낮았습니다';
  }
  return '같았습니다';
}

function guessNext(game, guess) {
  if (!game || game.status !== '진행 중' || !VALID_GUESSES.includes(guess)) {
    return game;
  }

  if (game.deck.length === 0) {
    return {
      ...game,
      status: '종료',
      message: '남은 카드가 없습니다. 새 게임을 시작하세요.',
    };
  }

  const [nextCard, ...deck] = game.deck;
  const answer = compareCards(game.currentCard, nextCard);
  const correct = answer === guess;
  const streak = correct ? game.streak + 1 : 0;
  const bestStreak = Math.max(game.bestStreak, streak);
  const lives = correct ? game.lives : Math.max(0, game.lives - 1);

  let status = '진행 중';
  let message = correct
    ? `정답입니다! ${nextCard} 카드는 ${directionText(answer)}.`
    : `틀렸습니다. ${nextCard} 카드는 ${directionText(answer)}.`;

  if (correct && streak >= game.targetStreak) {
    status = '승리';
    message = '목표 연속 정답을 달성했습니다!';
  } else if (!correct && lives === 0) {
    status = '패배';
    message = '기회를 모두 썼습니다. 다시 도전하세요.';
  } else if (deck.length === 0) {
    status = '종료';
    message = '남은 카드가 없습니다. 새 게임을 시작하세요.';
  }

  return {
    ...game,
    currentCard: nextCard,
    deck,
    streak,
    bestStreak,
    lives,
    status,
    message,
    lastCard: nextCard,
  };
}

function resetGame(options = {}) {
  return createGame(options);
}

const HighLowCardLogic = {
  TARGET_STREAK,
  START_LIVES,
  createDeck,
  createGame,
  compareCards,
  guessNext,
  resetGame,
};

if (typeof module !== 'undefined') {
  module.exports = HighLowCardLogic;
}

if (typeof window !== 'undefined') {
  window.HighLowCardLogic = HighLowCardLogic;
}
