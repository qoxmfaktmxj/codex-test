(function defineMastermind(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.Mastermind = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const COLORS = ['빨강', '파랑', '초록', '노랑', '보라', '주황'];
  const CODE_LENGTH = 4;
  const DEFAULT_MAX_TURNS = 8;
  const DEFAULT_MESSAGE = '네 칸의 색을 고르고 암호를 추리하세요.';

  function cloneGuess(guess) {
    return guess.slice();
  }

  function cloneHistoryEntry(entry) {
    return {
      turn: entry.turn,
      guess: cloneGuess(entry.guess),
      score: { ...entry.score },
    };
  }

  function cloneGame(game, overrides = {}) {
    return {
      secret: cloneGuess(game.secret),
      maxTurns: game.maxTurns,
      turn: game.turn,
      history: game.history.map(cloneHistoryEntry),
      status: game.status,
      message: game.message,
      ...overrides,
    };
  }

  function createSecret() {
    return Array.from({ length: CODE_LENGTH }, () => (
      COLORS[Math.floor(Math.random() * COLORS.length)]
    ));
  }

  function validateGuess(guess) {
    if (!Array.isArray(guess) || guess.length !== CODE_LENGTH) {
      throw new Error('네 칸의 색을 모두 골라야 합니다.');
    }

    guess.forEach((color) => {
      if (!COLORS.includes(color)) {
        throw new Error('사용할 수 없는 색입니다.');
      }
    });
  }

  function scoreGuess(secret, guess) {
    const remainingSecret = {};
    const remainingGuess = {};
    let exact = 0;

    for (let index = 0; index < CODE_LENGTH; index += 1) {
      if (secret[index] === guess[index]) {
        exact += 1;
      } else {
        remainingSecret[secret[index]] = (remainingSecret[secret[index]] || 0) + 1;
        remainingGuess[guess[index]] = (remainingGuess[guess[index]] || 0) + 1;
      }
    }

    const colorOnly = Object.keys(remainingGuess).reduce((total, color) => (
      total + Math.min(remainingGuess[color], remainingSecret[color] || 0)
    ), 0);

    return { exact, colorOnly };
  }

  function createGame(options = {}) {
    const secret = options.secret ? cloneGuess(options.secret) : createSecret();
    const game = {
      secret,
      maxTurns: options.maxTurns || DEFAULT_MAX_TURNS,
      turn: 1,
      history: [],
      status: '진행 중',
      message: DEFAULT_MESSAGE,
    };

    validateGuess(game.secret);
    return cloneGame(game);
  }

  function submitGuess(game, guess) {
    if (game.status !== '진행 중') {
      return cloneGame(game);
    }

    validateGuess(guess);
    const score = scoreGuess(game.secret, guess);
    const history = game.history.concat({
      turn: game.turn,
      guess: cloneGuess(guess),
      score,
    });

    if (score.exact === CODE_LENGTH) {
      return cloneGame(game, {
        history,
        status: '승리',
        message: `정답입니다. ${game.turn}번 만에 암호를 풀었습니다.`,
      });
    }

    if (game.turn >= game.maxTurns) {
      return cloneGame(game, {
        history,
        status: '패배',
        message: `기회를 모두 썼습니다. 정답은 ${game.secret.join(', ')}입니다.`,
      });
    }

    return cloneGame(game, {
      turn: game.turn + 1,
      history,
      message: `정확한 위치 ${score.exact}개, 색만 맞음 ${score.colorOnly}개입니다.`,
    });
  }

  return {
    COLORS,
    CODE_LENGTH,
    DEFAULT_MAX_TURNS,
    createGame,
    scoreGuess,
    submitGuess,
  };
}));
