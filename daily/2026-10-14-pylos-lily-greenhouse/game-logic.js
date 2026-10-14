(function(root) {
  'use strict';
  const layers = [16, 9, 4, 1];
  const starts = [0, 16, 25, 29];
  function createGame() { return { board: Array(30).fill(null), turn: 'jade', remaining: { jade: 15, coral: 15 }, status: 'playing', winner: null, phase: 'place', reclaimLeft: 0 }; }
  function layerOf(index) { return starts.findIndex((start, layer) => index >= start && index < start + layers[layer]); }
  function supported(board, index) {
    const layer = layerOf(index); if (layer === 0) return true;
    const size = 4 - layer, local = index - starts[layer], row = Math.floor(local / size), column = local % size;
    const belowSize = size + 1, below = starts[layer - 1] + row * belowSize + column;
    return [below, below + 1, below + belowSize, below + belowSize + 1].every(spot => board[spot]);
  }
  function availableSpots(game) { return game.board.map((value, index) => !value && supported(game.board, index) ? index : -1).filter(index => index >= 0); }
  function supportsAbove(index, candidate) { const layer = layerOf(candidate); return layer > 0 && (() => { const size = 4 - layer, local = candidate - starts[layer], row = Math.floor(local / size), column = local % size, belowSize = size + 1, below = starts[layer - 1] + row * belowSize + column; return [below, below + 1, below + belowSize, below + belowSize + 1].includes(index); })(); }
  function isFree(board, index) { return !board.some((cell, candidate) => cell && supportsAbove(index, candidate)); }
  function makesSquare(board, index, color) { const layer = layerOf(index), size = 4 - layer, local = index - starts[layer], row = Math.floor(local / size), column = local % size; for (let r = Math.max(0, row - 1); r <= Math.min(size - 2, row); r += 1) for (let c = Math.max(0, column - 1); c <= Math.min(size - 2, column); c += 1) { const start = starts[layer] + r * size + c; if ([start, start + 1, start + size, start + size + 1].every(spot => board[spot] === color)) return true; } return false; }
  function next(game, board, remaining, index, color) { if (index === 29) return { ...game, board, remaining, status: 'won', winner: color }; if (makesSquare(board, index, color)) return { ...game, board, remaining, phase: 'reclaim', reclaimLeft: 2 }; return { ...game, board, remaining, turn: color === 'jade' ? 'coral' : 'jade' }; }
  function placeSphere(game, index) {
    if (game.status !== 'playing' || game.phase !== 'place' || !availableSpots(game).includes(index) || !game.remaining[game.turn]) return game;
    const color = game.turn, board = game.board.map((cell, cellIndex) => cellIndex === index ? color : cell);
    const remaining = { ...game.remaining, [color]: game.remaining[color] - 1 };
    return next(game, board, remaining, index, color);
  }
  function moveSphere(game, from, to) { if (game.status !== 'playing' || game.phase !== 'place' || game.board[from] !== game.turn || !isFree(game.board, from) || layerOf(to) <= layerOf(from) || game.board[to]) return game; const board = game.board.map((cell, index) => index === from ? null : cell); if (!supported(board, to)) return game; board[to] = game.turn; return next(game, board, game.remaining, to, game.turn); }
  function reclaimSphere(game, index) { if (game.status !== 'playing' || game.phase !== 'reclaim' || game.board[index] !== game.turn || !isFree(game.board, index)) return game; const board = game.board.map((cell, cellIndex) => cellIndex === index ? null : cell), remaining = { ...game.remaining, [game.turn]: game.remaining[game.turn] + 1 }, reclaimLeft = game.reclaimLeft - 1; return reclaimLeft ? { ...game, board, remaining, reclaimLeft } : { ...game, board, remaining, phase: 'place', reclaimLeft: 0, turn: game.turn === 'jade' ? 'coral' : 'jade' }; }
  function reset() { return createGame(); }
  const api = { createGame, placeSphere, moveSphere, reclaimSphere, availableSpots, reset, isFree };
  if (typeof module !== 'undefined') module.exports = api;
  if (typeof window !== 'undefined') window.lilyPylos = api;
})(globalThis);
