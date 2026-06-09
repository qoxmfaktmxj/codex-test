const COLORS = ['빨강', '파랑', '초록', '노랑', '보라', '검정'];

const COLOR_CLASS = {
  빨강: 'red',
  파랑: 'blue',
  초록: 'green',
  노랑: 'yellow',
  보라: 'purple',
  검정: 'black',
};

const STATUS = {
  PLAYING: 'playing',
  WON: 'won',
  LOST: 'lost',
};

const ORDINALS = ['첫 번째', '두 번째', '세 번째', '네 번째'];

function makeCode(random = Math.random, length = 4) {
  return Array.from({ length }, () => COLORS[Math.floor(random() * COLORS.length)]);
}

function cloneGame(game) {
  return {
    ...game,
    secret: game.secret.slice(),
    currentGuess: game.currentGuess.slice(),
    history: game.history.map((entry) => ({
      guess: entry.guess.slice(),
      score: { ...entry.score },
    })),
  };
}

function createGame(secret = makeCode()) {
  return {
    secret: secret.slice(),
    currentGuess: Array(secret.length).fill(null),
    history: [],
    turnsLeft: 8,
    status: STATUS.PLAYING,
    message: '색 네 칸을 채우고 정답을 확인하세요.',
  };
}

function scoreGuess(secret, guess) {
  let exact = 0;
  const secretLeft = [];
  const guessLeft = [];

  secret.forEach((color, index) => {
    if (color === guess[index]) {
      exact += 1;
      return;
    }
    secretLeft.push(color);
    guessLeft.push(guess[index]);
  });

  let colorOnly = 0;
  guessLeft.forEach((color) => {
    const matchIndex = secretLeft.indexOf(color);
    if (matchIndex === -1) return;
    colorOnly += 1;
    secretLeft.splice(matchIndex, 1);
  });

  return { exact, colorOnly };
}

function setSlot(game, index, color) {
  if (game.status !== STATUS.PLAYING) return cloneGame(game);
  if (index < 0 || index >= game.currentGuess.length || !COLORS.includes(color)) return cloneGame(game);

  const next = cloneGame(game);
  next.currentGuess[index] = color;
  next.message = `${ORDINALS[index]} 칸에 ${color}색을 골랐습니다.`;
  return next;
}

function submitGuess(game) {
  if (game.status !== STATUS.PLAYING) return cloneGame(game);
  if (game.currentGuess.some((color) => color === null)) {
    return {
      ...cloneGame(game),
      message: '비어 있는 칸 없이 네 색을 모두 고르세요.',
    };
  }

  const score = scoreGuess(game.secret, game.currentGuess);
  const history = game.history.concat({
    guess: game.currentGuess.slice(),
    score,
  });
  const turnsLeft = game.turnsLeft - 1;

  if (score.exact === game.secret.length) {
    return {
      ...cloneGame(game),
      currentGuess: Array(game.secret.length).fill(null),
      history,
      turnsLeft,
      status: STATUS.WON,
      message: '정답입니다! 비밀 코드를 풀었습니다.',
    };
  }

  if (turnsLeft === 0) {
    return {
      ...cloneGame(game),
      currentGuess: Array(game.secret.length).fill(null),
      history,
      turnsLeft,
      status: STATUS.LOST,
      message: `아쉽습니다. 비밀 코드는 ${game.secret.join(', ')}입니다.`,
    };
  }

  return {
    ...cloneGame(game),
    currentGuess: Array(game.secret.length).fill(null),
    history,
    turnsLeft,
    message: `위치까지 맞은 색 ${score.exact}개, 색만 맞은 색 ${score.colorOnly}개입니다.`,
  };
}

function remainingText(game) {
  return `남은 기회 ${game.turnsLeft}번 · 기록 ${game.history.length}줄`;
}

function resultText(game) {
  if (game.status === STATUS.WON) return `성공 · ${game.history.length}번 만에 해결`;
  if (game.status === STATUS.LOST) return `실패 · 정답은 ${game.secret.join(', ')}`;
  return '진행 중 · 색 네 칸을 추리하세요';
}

const api = {
  COLORS,
  COLOR_CLASS,
  STATUS,
  createGame,
  makeCode,
  scoreGuess,
  setSlot,
  submitGuess,
  remainingText,
  resultText,
};

if (typeof module !== 'undefined' && module.exports) module.exports = api;
if (typeof window !== 'undefined') window.MastermindLogic = api;
