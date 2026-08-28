(function defineFiveFieldKono(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.FiveFieldKono = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const SIZE = 5;
  const BLUE_HOME = [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [1, 1], [1, 3]];
  const ORANGE_HOME = [[4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [3, 1], [3, 3]];

  function emptyBoard(entries = []) {
    const board = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
    entries.forEach(([row, column, piece]) => { board[row][column] = piece; });
    return board;
  }

  function startingBoard() {
    return emptyBoard([
      ...BLUE_HOME.map(([row, column]) => [row, column, 'blue']),
      ...ORANGE_HOME.map(([row, column]) => [row, column, 'orange']),
    ]);
  }

  function createState(input = {}) {
    const board = input.board === undefined ? startingBoard() : input.board;
    const turn = input.turn === undefined ? 'blue' : input.turn;
    if (!Array.isArray(board) || board.length !== SIZE || !board.every((row) => Array.isArray(row) && row.length === SIZE)) throw new Error('말판 정보가 올바르지 않습니다.');
    if (!board.flat().every((piece) => piece === null || piece === 'blue' || piece === 'orange')) throw new Error('말 종류가 올바르지 않습니다.');
    if (!['blue', 'orange'].includes(turn)) throw new Error('차례 정보가 올바르지 않습니다.');
    return { board: board.map((row) => [...row]), turn };
  }

  function isInside(row, column) { return row >= 0 && row < SIZE && column >= 0 && column < SIZE; }

  function movePiece(state, fromRow, fromColumn, toRow, toColumn) {
    const next = createState(state);
    if (![fromRow, fromColumn, toRow, toColumn].every(Number.isInteger) || !isInside(fromRow, fromColumn) || !isInside(toRow, toColumn)) throw new Error('말판 안의 칸을 선택하세요.');
    const piece = next.board[fromRow][fromColumn];
    if (!piece) throw new Error('움직일 말이 없습니다.');
    if (piece !== next.turn) throw new Error('지금은 상대 말의 차례입니다.');
    if (next.board[toRow][toColumn]) throw new Error('도착 칸이 비어 있지 않습니다.');
    if (Math.abs(toRow - fromRow) !== Math.abs(toColumn - fromColumn)) throw new Error('말은 대각선으로만 움직입니다.');
    if (Math.abs(toRow - fromRow) !== 1) throw new Error('말은 대각선 한 칸만 움직입니다.');
    next.board[fromRow][fromColumn] = null;
    next.board[toRow][toColumn] = piece;
    next.turn = next.turn === 'blue' ? 'orange' : 'blue';
    return next;
  }

  function hasFilledHome(board, home, piece) {
    return home.every(([row, column]) => board[row][column] === piece);
  }

  function getStatus(state) {
    const current = createState(state);
    if (hasFilledHome(current.board, ORANGE_HOME, 'blue')) return 'blue-won';
    if (hasFilledHome(current.board, BLUE_HOME, 'orange')) return 'orange-won';
    return 'playing';
  }

  return { SIZE, BLUE_HOME, ORANGE_HOME, emptyBoard, createState, movePiece, getStatus };
}));
