(function(root) {
  'use strict';
  const numbers = Array.from({ length: 25 }, (_, index) => index + 1);
  function shuffled(random) { const pool = [...numbers]; for (let i = pool.length - 1; i > 0; i -= 1) { const j = Math.floor(random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; } return pool; }
  function createGame(random = Math.random) { return { board: numbers.map(number => ({ number, marked: false })), bag: shuffled(random), drawn: [], current: null, status: 'playing', random }; }
  function isBingo(board) { const rows = [0, 1, 2, 3, 4].map(row => [0, 1, 2, 3, 4].map(column => row * 5 + column)); const columns = [0, 1, 2, 3, 4].map(column => [0, 1, 2, 3, 4].map(row => row * 5 + column)); return [...rows, ...columns, [0, 6, 12, 18, 24], [4, 8, 12, 16, 20]].some(line => line.every(index => board[index].marked)); }
  function drawNumber(game) { if (game.status !== 'playing' || !game.bag.length) return game; const current = game.bag[0]; return { ...game, current, bag: game.bag.slice(1), drawn: [...game.drawn, current] }; }
  function markCell(game, index) { if (game.status !== 'playing' || game.current !== game.board[index]?.number) return game; const board = game.board.map((cell, cellIndex) => cellIndex === index ? { ...cell, marked: true } : cell); return { ...game, board, status: isBingo(board) ? 'won' : 'playing' }; }
  function reset(game, random = game.random) { return createGame(random); }
  const api = { createGame, drawNumber, markCell, reset, isBingo };
  if (typeof module !== 'undefined') module.exports = api;
  if (typeof window !== 'undefined') window.lifeguardBingo = api;
})(globalThis);
