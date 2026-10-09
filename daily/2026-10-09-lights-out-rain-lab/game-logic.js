(function(root) {
  'use strict';
  function createGame(size, lights) {
    const count = Number.isInteger(size) && size >= 3 ? size : 5;
    const initial = lights ? lights.slice() : [1,0,1,0,1, 0,1,1,1,0, 1,1,0,1,1, 0,1,1,1,0, 1,0,1,0,1];
    return { size: count, lights: initial, moves: 0, status: initial.every(v => !v) ? 'won' : 'playing' };
  }
  function affected(size, index) {
    const row = Math.floor(index / size), col = index % size, cells = [index];
    if (row) cells.push(index - size); if (row < size - 1) cells.push(index + size);
    if (col) cells.push(index - 1); if (col < size - 1) cells.push(index + 1);
    return cells;
  }
  function isSolved(game) { return game.lights.every(value => !value); }
  function press(game, index) {
    if (game.status === 'won' || !Number.isInteger(index) || index < 0 || index >= game.lights.length) return game;
    const lights = game.lights.slice(); affected(game.size, index).forEach(cell => { lights[cell] = lights[cell] ? 0 : 1; });
    const next = { ...game, lights, moves: game.moves + 1 }; return isSolved(next) ? { ...next, status: 'won' } : next;
  }
  const api = { createGame, affected, press, isSolved };
  if (typeof module !== 'undefined') module.exports = api;
  if (typeof window !== 'undefined') window.rainLab = api;
})(globalThis);
