(function(root, factory) {
  const api = factory();
  if (typeof module !== 'undefined') module.exports = api;
  root.PongLogic = api;
})(globalThis, function() {
  const resetBall = scorer => ({ x: 4, y: 3, dx: scorer === 'left' ? 1 : -1, dy: 1 });
  const createGame = () => ({ score: { left: 0, right: 0 }, paddles: { left: 2, right: 2 }, ball: { x: 4, y: 3, dx: 1, dy: 1 }, winner: null });
  const movePaddle = (game, side, amount) => ({ ...game, paddles: { ...game.paddles, [side]: Math.max(0, Math.min(3, game.paddles[side] + amount)) } });
  const step = game => {
    if (game.winner) return game;
    let { x, y, dx, dy } = game.ball;
    let nextY = y + dy;
    if (nextY < 0 || nextY > 6) { dy *= -1; nextY = y + dy; }
    const nextX = x + dx;
    if (dx < 0 && nextX === 0 && nextY >= game.paddles.left && nextY <= game.paddles.left + 2) dx = 1;
    if (dx > 0 && nextX === 8 && nextY >= game.paddles.right && nextY <= game.paddles.right + 2) dx = -1;
    const finalX = x + dx;
    if (finalX < 0 || finalX > 8) {
      const scorer = finalX < 0 ? 'right' : 'left';
      const score = { ...game.score, [scorer]: game.score[scorer] + 1 };
      return { ...game, score, ball: resetBall(scorer), winner: score[scorer] === 5 ? scorer : null };
    }
    return { ...game, ball: { x: finalX, y: nextY, dx, dy } };
  };
  return { createGame, movePaddle, step, resetBall };
});
