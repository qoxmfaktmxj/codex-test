(function(root) {
  'use strict';
  const SIZE = 8;
  const directions = [-9, -8, -7, -1, 1, 7, 8, 9];
  function createGame() {
    const board = Array(SIZE * SIZE).fill(null);
    board[27] = board[36] = 'white'; board[28] = board[35] = 'black';
    return { board, turn: 'black', status: 'playing', passed: false };
  }
  function step(index, direction) {
    const next = index + direction;
    if (next < 0 || next >= 64) return -1;
    const col = index % SIZE, nextCol = next % SIZE;
    if (Math.abs(nextCol - col) > 1) return -1;
    return next;
  }
  function flips(board, color, index) {
    if (board[index]) return [];
    const other = color === 'black' ? 'white' : 'black'; const result = [];
    directions.forEach(direction => {
      const line = []; let cursor = step(index, direction);
      while (cursor >= 0 && board[cursor] === other) { line.push(cursor); cursor = step(cursor, direction); }
      if (line.length && cursor >= 0 && board[cursor] === color) result.push(...line);
    });
    return result;
  }
  function legalMoves(game, color) {
    return game.board.map((_, index) => flips(game.board, color, index).length ? index : -1).filter(index => index >= 0);
  }
  function count(board) { return { black: board.filter(v => v === 'black').length, white: board.filter(v => v === 'white').length }; }
  function play(game, index) {
    if (game.status !== 'playing' || !Number.isInteger(index)) return game;
    const taken = flips(game.board, game.turn, index); if (!taken.length) return game;
    const board = game.board.slice(); board[index] = game.turn; taken.forEach(cell => { board[cell] = game.turn; });
    const turn = game.turn === 'black' ? 'white' : 'black';
    const next = { ...game, board, turn, passed: false };
    if (legalMoves(next, turn).length) return next;
    if (legalMoves(next, game.turn).length) return { ...next, turn: game.turn, passed: true };
    return { ...next, status: 'finished' };
  }
  const api = { createGame, legalMoves, play, count, flips };
  if (typeof module !== 'undefined') module.exports = api;
  if (typeof window !== 'undefined') window.picnicReversi = api;
})(globalThis);
