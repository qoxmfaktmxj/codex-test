(function defineBridgit(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Bridgit = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const COLORS = ['red', 'blue'];
  const STEPS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  function validateBoard(board) {
    if (!Array.isArray(board) || board.length < 3 || !board.every((row) => Array.isArray(row) && row.length === board.length && row.every((cell) => cell === null || COLORS.includes(cell)))) {
      throw new Error('보드 정보가 올바르지 않습니다.');
    }
  }

  function createBoard(size) {
    if (!Number.isInteger(size) || size < 3) throw new Error('보드 크기는 3 이상인 정수여야 합니다.');
    return Array.from({ length: size }, () => Array(size).fill(null));
  }

  function validateColor(color) {
    if (!COLORS.includes(color)) throw new Error('돌 색이 올바르지 않습니다.');
  }

  function isValidMove(board, row, column) {
    validateBoard(board);
    return Number.isInteger(row) && Number.isInteger(column)
      && row >= 0 && row < board.length && column >= 0 && column < board.length
      && board[row][column] === null;
  }

  function placeStone(board, row, column, color) {
    validateBoard(board);
    validateColor(color);
    if (!isValidMove(board, row, column)) throw new Error('둘 수 없는 자리입니다.');
    return board.map((line, lineIndex) => line.map((cell, cellIndex) => (lineIndex === row && cellIndex === column ? color : cell)));
  }

  function hasConnection(board, color) {
    validateBoard(board);
    validateColor(color);
    const size = board.length;
    const queue = [];
    const visited = new Set();
    const starts = color === 'red'
      ? Array.from({ length: size }, (_, column) => [0, column])
      : Array.from({ length: size }, (_, row) => [row, 0]);

    starts.forEach(([row, column]) => {
      if (board[row][column] === color) {
        queue.push([row, column]);
        visited.add(`${row},${column}`);
      }
    });

    while (queue.length) {
      const [row, column] = queue.shift();
      if ((color === 'red' && row === size - 1) || (color === 'blue' && column === size - 1)) return true;
      STEPS.forEach(([rowStep, columnStep]) => {
        const nextRow = row + rowStep;
        const nextColumn = column + columnStep;
        const key = `${nextRow},${nextColumn}`;
        if (nextRow >= 0 && nextRow < size && nextColumn >= 0 && nextColumn < size && board[nextRow][nextColumn] === color && !visited.has(key)) {
          visited.add(key);
          queue.push([nextRow, nextColumn]);
        }
      });
    }
    return false;
  }

  return { createBoard, isValidMove, placeStone, hasConnection };
}));
