(function(root) {
  'use strict';
  const walls = new Set([0,1,2,3,4,5,6,7,11,12,17,18,23,24,29,30,31,32,33,34,35]);
  const targets = new Set([16]);
  function createGame() { return { player: 13, crates: [15], status: 'playing', moves: 0 }; }
  function move(game, direction) {
    if (game.status !== 'playing') return game;
    const steps = { up: -6, down: 6, left: -1, right: 1 };
    const step = steps[direction]; if (!step) return game;
    const next = game.player + step;
    if (walls.has(next)) return game;
    const crateIndex = game.crates.indexOf(next);
    let crates = game.crates.slice();
    if (crateIndex !== -1) {
      const beyond = next + step;
      if (walls.has(beyond) || crates.includes(beyond)) return game;
      crates[crateIndex] = beyond;
    }
    const status = crates.every(cell => targets.has(cell)) ? 'won' : 'playing';
    return { player: next, crates, status, moves: game.moves + 1 };
  }
  const api = { createGame, move, reset: createGame, walls: [...walls], targets: [...targets] };
  if (typeof module !== 'undefined') module.exports = api;
  if (typeof window !== 'undefined') window.matchboxSokoban = api;
})(globalThis);
