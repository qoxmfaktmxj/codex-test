(function defineLifeGame(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.LifeGame = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  function createBoard(width, height) {
    if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1) {
      throw new Error('보드 크기는 1 이상인 정수여야 합니다.');
    }
    return Array.from({ length: height }, () => Array(width).fill(false));
  }

  function validateBoard(board) {
    if (!Array.isArray(board) || !board.length || !Array.isArray(board[0]) || !board[0].length
      || board.some((row) => !Array.isArray(row) || row.length !== board[0].length || row.some((cell) => typeof cell !== 'boolean'))) {
      throw new Error('보드 정보가 올바르지 않습니다.');
    }
  }

  function validateCoordinates(board, x, y) {
    validateBoard(board);
    if (!Number.isInteger(x) || !Number.isInteger(y) || y < 0 || y >= board.length || x < 0 || x >= board[0].length) {
      throw new Error('좌표가 보드 범위를 벗어났습니다.');
    }
  }

  function countNeighbours(board, x, y) {
    validateCoordinates(board, x, y);
    let count = 0;
    for (let vertical = -1; vertical <= 1; vertical += 1) {
      for (let horizontal = -1; horizontal <= 1; horizontal += 1) {
        if (horizontal === 0 && vertical === 0) continue;
        const nextY = y + vertical;
        const nextX = x + horizontal;
        if (nextY >= 0 && nextY < board.length && nextX >= 0 && nextX < board[0].length && board[nextY][nextX]) count += 1;
      }
    }
    return count;
  }

  function nextGeneration(board) {
    validateBoard(board);
    return board.map((row, y) => row.map((alive, x) => {
      const neighbours = countNeighbours(board, x, y);
      return neighbours === 3 || (alive && neighbours === 2);
    }));
  }

  function toggleCell(board, x, y) {
    validateCoordinates(board, x, y);
    return board.map((row, rowIndex) => row.map((cell, cellIndex) => (rowIndex === y && cellIndex === x ? !cell : cell)));
  }

  function clearBoard(board) {
    validateBoard(board);
    return createBoard(board[0].length, board.length);
  }

  return { createBoard, countNeighbours, nextGeneration, toggleCell, clearBoard };
}));
