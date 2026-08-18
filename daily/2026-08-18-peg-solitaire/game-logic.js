(function definePegSolitaire(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.PegSolitaire = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const SIZE = 7;
  const BLOCKED = 'blocked';
  const PEG = 'peg';
  const EMPTY = 'empty';
  const CELLS = [BLOCKED, PEG, EMPTY];
  const DIRECTIONS = [[-2, 0], [2, 0], [0, -2], [0, 2]];

  function createBoard() {
    return Array.from({ length: SIZE }, (_, row) => Array.from({ length: SIZE }, (_, column) => {
      const isCorner = (row < 2 || row > 4) && (column < 2 || column > 4);
      if (isCorner) return BLOCKED;
      return row === 3 && column === 3 ? EMPTY : PEG;
    }));
  }

  function validateBoard(board) {
    if (!Array.isArray(board) || board.length !== SIZE || !board.every((row) => Array.isArray(row) && row.length === SIZE && row.every((cell) => CELLS.includes(cell)))) {
      throw new Error('말판 정보가 올바르지 않습니다.');
    }
  }

  function isInside(row, column) {
    return Number.isInteger(row) && Number.isInteger(column)
      && row >= 0 && row < SIZE && column >= 0 && column < SIZE;
  }

  function isValidJump(board, fromRow, fromColumn, toRow, toColumn) {
    validateBoard(board);
    if (!isInside(fromRow, fromColumn) || !isInside(toRow, toColumn)) return false;
    const isStraightTwo = DIRECTIONS.some(([rowStep, columnStep]) => fromRow + rowStep === toRow && fromColumn + columnStep === toColumn);
    if (!isStraightTwo || board[fromRow][fromColumn] !== PEG || board[toRow][toColumn] !== EMPTY) return false;
    return board[(fromRow + toRow) / 2][(fromColumn + toColumn) / 2] === PEG;
  }

  function jump(board, fromRow, fromColumn, toRow, toColumn) {
    if (!isValidJump(board, fromRow, fromColumn, toRow, toColumn)) throw new Error('그 방향으로는 뛸 수 없습니다.');
    const jumpedRow = (fromRow + toRow) / 2;
    const jumpedColumn = (fromColumn + toColumn) / 2;
    return board.map((row, rowIndex) => row.map((cell, columnIndex) => {
      if ((rowIndex === fromRow && columnIndex === fromColumn) || (rowIndex === jumpedRow && columnIndex === jumpedColumn)) return EMPTY;
      if (rowIndex === toRow && columnIndex === toColumn) return PEG;
      return cell;
    }));
  }

  function countPegs(board) {
    validateBoard(board);
    return board.flat().filter((cell) => cell === PEG).length;
  }

  function hasLegalMove(board) {
    validateBoard(board);
    return board.some((row, rowIndex) => row.some((cell, columnIndex) => cell === PEG && DIRECTIONS.some(([rowStep, columnStep]) => (
      isValidJump(board, rowIndex, columnIndex, rowIndex + rowStep, columnIndex + columnStep)
    ))));
  }

  function isComplete(board) {
    return countPegs(board) === 1;
  }

  return { createBoard, isValidJump, jump, countPegs, hasLegalMove, isComplete };
}));
