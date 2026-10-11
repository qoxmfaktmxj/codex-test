(function(root) {
  'use strict';
  const groups = {
    'row-a': { target: 9, cells: ['a1', 'a2'] },
    'row-b': { target: 15, cells: ['b1', 'b2', 'b3'] },
    'row-c': { target: 11, cells: ['c1', 'c2'] },
    'col-1': { target: 12, cells: ['a1', 'b1', 'c1'] },
    'col-2': { target: 18, cells: ['a2', 'b2', 'c2'] },
    'col-3': { target: 5, cells: ['b3'] }
  };
  const solution = { a1: 4, a2: 5, b1: 3, b2: 7, b3: 5, c1: 5, c2: 6 };
  function createGame() { return { cells: Object.fromEntries(Object.keys(solution).map(key => [key, null])) }; }
  function enterDigit(game, cell, digit) {
    if (!Object.hasOwn(game.cells, cell) || !Number.isInteger(digit) || digit < 1 || digit > 9) return game;
    return { cells: { ...game.cells, [cell]: digit } };
  }
  function clearCell(game, cell) { return Object.hasOwn(game.cells, cell) ? { cells: { ...game.cells, [cell]: null } } : game; }
  function groupState(game, id) {
    const group = groups[id]; const digits = group.cells.map(cell => game.cells[cell]).filter(Number.isInteger);
    const sum = digits.reduce((total, digit) => total + digit, 0);
    return { sum, target: group.target, duplicate: new Set(digits).size !== digits.length, complete: digits.length === group.cells.length };
  }
  function isComplete(game) { return Object.entries(solution).every(([cell, digit]) => game.cells[cell] === digit); }
  const api = { createGame, enterDigit, clearCell, groupState, isComplete, groups };
  if (typeof module !== 'undefined') module.exports = api;
  if (typeof window !== 'undefined') window.teaLedgerKakuro = api;
})(globalThis);
