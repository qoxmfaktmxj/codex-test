(function defineMastermind(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Mastermind = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const COLORS = ['빨강', '파랑', '초록', '노랑', '보라', '주황'];
  const CODE_SIZE = 4;
  const MAX_GUESSES = 8;

  function validateCode(code, label) {
    if (!Array.isArray(code) || code.length !== CODE_SIZE || code.some((color) => !COLORS.includes(color))) throw new Error(`${label} 색을 올바르게 고르세요.`);
    if (new Set(code).size !== CODE_SIZE) throw new Error(`${label}에 중복 색을 넣을 수 없습니다.`);
  }
  function randomSecret() {
    const pool = COLORS.slice();
    const secret = [];
    while (secret.length < CODE_SIZE) secret.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
    return secret;
  }
  function createGame(options = {}) {
    const secret = options.secret ? options.secret.slice() : randomSecret();
    validateCode(secret, '정답');
    return { secret, guesses: [], remaining: MAX_GUESSES, status: '진행 중', message: '서로 다른 색 네 개를 골라 정답을 추리하세요.' };
  }
  function scoreGuess(secret, guess) {
    const exact = guess.filter((color, index) => color === secret[index]).length;
    const shared = guess.filter((color) => secret.includes(color)).length;
    return { exact, colorOnly: shared - exact };
  }
  function submitGuess(game, guess) {
    if (game.status !== '진행 중') throw new Error('이미 끝난 게임입니다.');
    validateCode(guess, '추측');
    const score = scoreGuess(game.secret, guess);
    const guesses = game.guesses.concat({ colors: guess.slice(), score });
    const remaining = MAX_GUESSES - guesses.length;
    if (score.exact === CODE_SIZE) return { ...game, guesses, remaining, status: '승리', message: '정답입니다! 완벽하게 맞혔어요.' };
    if (remaining === 0) return { ...game, guesses, remaining, status: '패배', message: '기회가 끝났습니다. 정답을 확인하고 다시 도전하세요.' };
    return { ...game, guesses, remaining, message: `자리까지 맞음 ${score.exact}개, 색만 맞음 ${score.colorOnly}개입니다.` };
  }
  return { COLORS, CODE_SIZE, MAX_GUESSES, createGame, scoreGuess, submitGuess };
}));
