const DEFAULT_WORDS = ['바나나', '사과', '구름', '학교', '라디오'];
const MAX_MISSES = 6;

function createGame(word = DEFAULT_WORDS[0]) {
  const answer = Array.from(word);
  return {
    answer,
    revealed: answer.map(() => '_'),
    guesses: [],
    misses: 0,
    status: 'playing',
  };
}

function isKoreanSyllable(letter) {
  return /^[가-힣]$/.test(letter);
}

function guessLetter(game, letter) {
  if (
    game.status !== 'playing' ||
    !isKoreanSyllable(letter) ||
    game.guesses.includes(letter)
  ) {
    return game;
  }

  const isHit = game.answer.includes(letter);
  const revealed = isHit
    ? game.answer.map((item, index) => (item === letter ? item : game.revealed[index]))
    : game.revealed;
  const misses = game.misses + (isHit ? 0 : 1);
  const status = revealed.every((item) => item !== '_')
    ? 'won'
    : misses >= MAX_MISSES
      ? 'lost'
      : 'playing';

  return {
    ...game,
    revealed,
    guesses: game.guesses.concat(letter),
    misses,
    status,
  };
}

function pickWord(words = DEFAULT_WORDS, random = Math.random) {
  const availableWords = words.length > 0 ? words : DEFAULT_WORDS;
  const index = Math.min(
    availableWords.length - 1,
    Math.floor(random() * availableWords.length),
  );
  return availableWords[index];
}

const gameLogic = {
  DEFAULT_WORDS,
  MAX_MISSES,
  createGame,
  guessLetter,
  pickWord,
};

if (typeof module !== 'undefined') {
  module.exports = gameLogic;
}

if (typeof window !== 'undefined') {
  window.gameLogic = gameLogic;
}
