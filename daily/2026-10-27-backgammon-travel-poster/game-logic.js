(function(root, factory) {
  const api = factory();
  if (typeof module !== 'undefined') module.exports = api;
  root.BackgammonLogic = api;
})(globalThis, function() {
  const createGame = () => ({ turn: 'light', light: 0, dark: 0, pieces: { light: 3, dark: 3 } });
  const winner = game => game.pieces.light === 0 ? 'light' : game.pieces.dark === 0 ? 'dark' : null;
  const legalMoves = (game, side = game.turn) => {
    if (winner(game) || side !== game.turn) return [];
    return [1, 2, 3, 4, 5, 6];
  };
  const move = (game, die) => {
    if (!legalMoves(game).includes(die)) return game;
    const side = game.turn;
    const next = Math.min(24, game[side] + die);
    const borneOff = next === 24 ? game.pieces[side] - 1 : game.pieces[side];
    return {
      ...game,
      [side]: next === 24 && borneOff > 0 ? 0 : next,
      pieces: { ...game.pieces, [side]: borneOff },
      turn: side === 'light' ? 'dark' : 'light'
    };
  };
  return { createGame, legalMoves, move, winner };
});
