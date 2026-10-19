(function(root, factory) {
  const api = factory();
  if (typeof module !== 'undefined') module.exports = api;
  root.ChimeLogic = api;
})(globalThis, function() {
  const tone = random => Math.floor(random() * 4);
  const createGame = random => ({ sequence: [tone(random)], playerIndex: 0, round: 1, best: 0, status: '보여주기' });
  const nextStep = (game, random) => {
    if (game.status === '보여주기') return { ...game, status: '입력' };
    if (game.status === '성공') return { ...game, sequence: [...game.sequence, tone(random)], playerIndex: 0, round: game.round + 1, status: '보여주기' };
    return game;
  };
  const press = (game, index) => {
    if (game.status !== '입력') return game;
    if (game.sequence[game.playerIndex] !== index) return { ...game, status: '실패', best: Math.max(game.best, game.round - 1) };
    const playerIndex = game.playerIndex + 1;
    return playerIndex === game.sequence.length
      ? { ...game, playerIndex, status: '성공', best: Math.max(game.best, game.round) }
      : { ...game, playerIndex };
  };
  return { createGame, nextStep, press };
});
