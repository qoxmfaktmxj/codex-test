(function(root) {
  'use strict';
  const solution = [1,2,3,4,3,4,1,2,2,1,4,3,4,3,2,1];
  const clues = new Set([0, 3, 4, 6, 8, 9]);
  function createGame() {
    return { board: solution.map((value, index) => clues.has(index) ? value : null), clues: [...clues], status: 'playing' };
  }
  function isAllowed(board, index, value) {
    const row = Math.floor(index / 4), col = index % 4;
    return board.every((cell, other) => cell !== value || other === index || (Math.floor(other / 4) !== row && other % 4 !== col && !(Math.floor(other / 8) === Math.floor(index / 8) && Math.floor((other % 4) / 2) === Math.floor((index % 4) / 2))));
  }
  function checkGame(game) {
    const valid = game.board.every((value, index) => value === null || isAllowed(game.board, index, value));
    const complete = valid && game.board.every(value => value !== null);
    return { valid, complete };
  }
  function setCell(game, index, value) {
    if (game.status !== 'playing' || game.clues.includes(index) || !Number.isInteger(value) || value < 1 || value > 4) return game;
    const board = game.board.slice();
    board[index] = value;
    const checked = checkGame({ ...game, board });
    return { ...game, board, status: checked.complete ? 'won' : 'playing' };
  }
  const api = { createGame, setCell, checkGame, reset: createGame };
  if (typeof module !== 'undefined') module.exports = api;
  if (typeof window !== 'undefined') window.origamiSudoku = api;
})(globalThis);
