(function defineTeeko(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Teeko = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const SIZE = 5;
  const WIN_LENGTH = 4;
  const COLORS = ['red', 'blue'];

  function validateColor(color) {
    if (!COLORS.includes(color)) throw new Error('말 색이 올바르지 않습니다.');
  }

  function validateBoard(board) {
    if (!Array.isArray(board) || board.length !== SIZE || !board.every((row) => Array.isArray(row) && row.length === SIZE && row.every((cell) => cell === null || COLORS.includes(cell)))) {
      throw new Error('말판 정보가 올바르지 않습니다.');
    }
  }

  function createBoard() {
    return Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
  }

  function isInside(row, column) {
    return Number.isInteger(row) && Number.isInteger(column)
      && row >= 0 && row < SIZE && column >= 0 && column < SIZE;
  }

  function isValidPlacement(board, row, column) {
    validateBoard(board);
    return isInside(row, column) && board[row][column] === null;
  }

  function placePiece(board, row, column, color) {
    validateBoard(board);
    validateColor(color);
    if (!isValidPlacement(board, row, column)) throw new Error('말을 놓을 수 없는 자리입니다.');
    return board.map((line, lineIndex) => line.map((cell, cellIndex) => (lineIndex === row && cellIndex === column ? color : cell)));
  }

  function isValidMove(board, fromRow, fromColumn, toRow, toColumn, color) {
    validateBoard(board);
    validateColor(color);
    if (!isInside(fromRow, fromColumn) || !isValidPlacement(board, toRow, toColumn)) return false;
    return board[fromRow][fromColumn] === color
      && Math.max(Math.abs(fromRow - toRow), Math.abs(fromColumn - toColumn)) === 1;
  }

  function movePiece(board, fromRow, fromColumn, toRow, toColumn, color) {
    if (!isValidMove(board, fromRow, fromColumn, toRow, toColumn, color)) throw new Error('말을 옮길 수 없습니다.');
    return board.map((line, row) => line.map((cell, column) => {
      if (row === fromRow && column === fromColumn) return null;
      if (row === toRow && column === toColumn) return color;
      return cell;
    }));
  }

  function hasWon(board, color) {
    validateBoard(board);
    validateColor(color);
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
    const lineWin = board.some((line, row) => line.some((cell, column) => (
      cell === color && directions.some(([rowStep, columnStep]) => {
        const endRow = row + rowStep * (WIN_LENGTH - 1);
        const endColumn = column + columnStep * (WIN_LENGTH - 1);
        return isInside(endRow, endColumn)
          && Array.from({ length: WIN_LENGTH }, (_, index) => board[row + rowStep * index][column + columnStep * index]).every((piece) => piece === color);
      })
    )));
    const squareWin = Array.from({ length: SIZE - 1 }, (_, row) => row).some((row) => Array.from({ length: SIZE - 1 }, (_, column) => column).some((column) => (
      board[row][column] === color && board[row + 1][column] === color
      && board[row][column + 1] === color && board[row + 1][column + 1] === color
    )));
    return lineWin || squareWin;
  }

  return { createBoard, isValidPlacement, placePiece, isValidMove, movePiece, hasWon };
}));
