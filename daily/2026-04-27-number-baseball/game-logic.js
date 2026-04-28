function createGame(answer) {
  return {
    answer,
    attempts: [],
    status: 'playing',
    message: '세 자리 숫자를 맞혀 보세요',
  };
}

function isValidGuess(guess) {
  return /^[1-9]\d{2}$/.test(guess) && new Set(guess).size === 3;
}

function evaluateGuess(answer, guess) {
  let strikes = 0;
  let balls = 0;

  for (let index = 0; index < guess.length; index += 1) {
    if (guess[index] === answer[index]) {
      strikes += 1;
    } else if (answer.includes(guess[index])) {
      balls += 1;
    }
  }

  return { guess, strikes, balls };
}

function makeGuess(game, guess) {
  if (game.status === 'won') {
    return game;
  }

  if (!isValidGuess(guess)) {
    return {
      ...game,
      message: '서로 다른 세 자리 숫자를 입력하세요',
    };
  }

  const attempt = evaluateGuess(game.answer, guess);
  const attempts = [...game.attempts, attempt];

  if (attempt.strikes === 3) {
    return {
      ...game,
      attempts,
      status: 'won',
      message: `정답입니다! ${attempts.length}번 만에 맞혔어요`,
    };
  }

  return {
    ...game,
    attempts,
    message: `${attempt.strikes} 스트라이크, ${attempt.balls} 볼`,
  };
}

function createAnswer(random = Math.random) {
  const firstDigits = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const allDigits = ['0', ...firstDigits];
  const digits = [];

  while (digits.length < 3) {
    const pool = digits.length === 0
      ? firstDigits
      : allDigits.filter((digit) => !digits.includes(digit));
    const index = Math.floor(random() * pool.length);
    digits.push(pool[index]);
  }

  return digits.join('');
}

const gameLogic = {
  createAnswer,
  createGame,
  evaluateGuess,
  makeGuess,
};

if (typeof module !== 'undefined') {
  module.exports = gameLogic;
}

if (typeof window !== 'undefined') {
  window.gameLogic = gameLogic;
}
