(function(root) {
  'use strict';
  const bumpers = [{ x: 165, y: 110 }, { x: 112, y: 205 }, { x: 218, y: 205 }];
  const freshBall = () => ({ x: 274, y: 430, vx: 0, vy: 0 });
  function createGame(random = Math.random) { return { status: 'ready', balls: 3, score: 0, ball: freshBall(), flippers: { left: false, right: false }, bumpers: [false, false, false], contacts: [false, false, false], random }; }
  function launch(game) { return game.status === 'ready' ? { ...game, status: 'playing', ball: { ...game.ball, vx: -55, vy: -235 } } : game; }
  function flip(game, side) { return game.status === 'playing' && (side === 'left' || side === 'right') ? { ...game, flippers: { ...game.flippers, [side]: true } } : game; }
  function reset(game) { return createGame(game.random); }
  function step(game, ms) {
    if (game.status !== 'playing') return game;
    const dt = Math.min(ms, 32) / 1000; let { x, y, vx, vy } = game.ball;
    vy += 420 * dt; x += vx * dt; y += vy * dt;
    if (x < 18 || x > 302) { x = Math.max(18, Math.min(302, x)); vx *= -0.9; }
    if (y < 20) { y = 20; vy = Math.abs(vy); }
    let score = game.score; const lit = [false, false, false]; const contacts = [false, false, false];
    bumpers.forEach((bumper, index) => { if ((x - bumper.x) ** 2 + (y - bumper.y) ** 2 < 625) { lit[index] = true; contacts[index] = true; if (!game.contacts[index]) { score += 100; vy = Math.abs(vy) + 150; vx += (x - bumper.x) * 4 || 45; } } });
    const nearLeft = x > 82 && x < 162 && y > 404 && y < 452;
    const nearRight = x > 168 && x < 248 && y > 404 && y < 452;
    if ((game.flippers.left && nearLeft) || (game.flippers.right && nearRight)) { vy = -310; vx += game.flippers.left ? 85 : -85; }
    if (y > 500) { const balls = game.balls - 1; return balls ? { ...game, balls, status: 'ready', ball: freshBall(), flippers: { left: false, right: false }, bumpers: lit, contacts } : { ...game, balls: 0, status: 'over', ball: { x, y, vx, vy }, flippers: { left: false, right: false }, bumpers: lit, contacts }; }
    return { ...game, score, ball: { x, y, vx, vy }, flippers: { left: false, right: false }, bumpers: lit, contacts };
  }
  const api = { createGame, launch, step, flip, reset, bumpers };
  if (typeof module !== 'undefined') module.exports = api;
  if (typeof window !== 'undefined') window.nightMarketPinball = api;
})(globalThis);
