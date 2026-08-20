(function defineNonogram(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Nonogram = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  function validateBoard(board) {
    if (!Array.isArray(board) || board.length === 0 || !board.every((row) => Array.isArray(row) && row.length === board[0].length)) {
      throw new Error('보드 정보가 올바르지 않습니다.');
    }
  }

  function cloneBoard(board) {
    return board.map((row) => row.slice());
  }

  function createPuzzle(solution) {
    validateBoard(solution);
    return {
      solution: cloneBoard(solution),
      cells: solution.map((row) => row.map(() => false)),
    };
  }

  function lineHint(line) {
    const groups = [];
    let count = 0;
    line.forEach((filled) => {
      if (filled) count += 1;
      else if (count) {
        groups.push(count);
        count = 0;
      }
    });
    if (count) groups.push(count);
    return groups.length ? groups : [0];
  }

  function getHints(solution) {
    validateBoard(solution);
    return {
      rows: solution.map(lineHint),
      columns: solution[0].map((_, column) => lineHint(solution.map((row) => row[column]))),
    };
  }

  function toggleCell(cells, row, column) {
    validateBoard(cells);
    if (!Number.isInteger(row) || !Number.isInteger(column) || row < 0 || column < 0 || row >= cells.length || column >= cells[0].length) {
      throw new Error('선택한 칸이 범위를 벗어났습니다.');
    }
    const next = cloneBoard(cells);
    next[row][column] = !next[row][column];
    return next;
  }

  function getStatus(solution, cells) {
    validateBoard(solution);
    validateBoard(cells);
    if (solution.length !== cells.length || solution[0].length !== cells[0].length) throw new Error('보드 크기가 맞지 않습니다.');
    return solution.every((row, rowIndex) => row.every((filled, columnIndex) => filled === cells[rowIndex][columnIndex])) ? 'won' : 'playing';
  }

  return { createPuzzle, getHints, toggleCell, getStatus };
}));
