(function defineTafl(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Tafl = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const SIZE = 9;
  const CORNERS = new Set(['0,0', '0,8', '8,0', '8,8']);
  const THRONE = '4,4';
  const DIRECTIONS = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  function key(row, column) { return `${row},${column}`; }
  function inBounds(row, column) { return row >= 0 && row < SIZE && column >= 0 && column < SIZE; }
  function isCorner(row, column) { return CORNERS.has(key(row, column)); }
  function isSpecialSquare(row, column) { return isCorner(row, column) || key(row, column) === THRONE; }
  function sideOf(piece) { return piece === 'attacker' ? 'attackers' : piece ? 'defenders' : null; }
  function cloneBoard(board) { return board.map((row) => [...row]); }

  function emptyBoard(entries = []) {
    const board = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
    entries.forEach(([row, column, piece]) => { board[row][column] = piece; });
    return board;
  }

  function startingBoard() {
    return emptyBoard([
      [0, 3, 'attacker'], [0, 4, 'attacker'], [0, 5, 'attacker'], [1, 4, 'attacker'],
      [8, 3, 'attacker'], [8, 4, 'attacker'], [8, 5, 'attacker'], [7, 4, 'attacker'],
      [3, 0, 'attacker'], [4, 0, 'attacker'], [5, 0, 'attacker'], [4, 1, 'attacker'],
      [3, 8, 'attacker'], [4, 8, 'attacker'], [5, 8, 'attacker'], [4, 7, 'attacker'],
      [4, 4, 'king'], [3, 4, 'defender'], [5, 4, 'defender'], [4, 3, 'defender'], [4, 5, 'defender'],
      [3, 3, 'defender'], [3, 5, 'defender'], [5, 3, 'defender'], [5, 5, 'defender'],
    ]);
  }

  function createState(input = {}) {
    const board = input.board === undefined ? startingBoard() : input.board;
    const turn = input.turn === undefined ? 'defenders' : input.turn;
    if (!Array.isArray(board) || board.length !== SIZE || !board.every((row) => Array.isArray(row) && row.length === SIZE)) throw new Error('말판 정보가 올바르지 않습니다.');
    if (!board.flat().every((piece) => piece === null || ['attacker', 'defender', 'king'].includes(piece))) throw new Error('말 종류가 올바르지 않습니다.');
    if (!['attackers', 'defenders'].includes(turn)) throw new Error('차례 정보가 올바르지 않습니다.');
    return { board: cloneBoard(board), turn, captured: Number.isInteger(input.captured) ? input.captured : 0 };
  }

  function isPathClear(board, fromRow, fromColumn, toRow, toColumn) {
    const rowStep = Math.sign(toRow - fromRow);
    const columnStep = Math.sign(toColumn - fromColumn);
    for (let row = fromRow + rowStep, column = fromColumn + columnStep; row !== toRow || column !== toColumn; row += rowStep, column += columnStep) {
      if (board[row][column] !== null) return false;
    }
    return true;
  }

  function canSupportCapture(board, row, column, team) {
    if (!inBounds(row, column)) return false;
    return sideOf(board[row][column]) === team || isSpecialSquare(row, column);
  }

  function captureEnemies(board, row, column, team) {
    let captured = 0;
    DIRECTIONS.forEach(([rowStep, columnStep]) => {
      const enemyRow = row + rowStep;
      const enemyColumn = column + columnStep;
      const supportRow = enemyRow + rowStep;
      const supportColumn = enemyColumn + columnStep;
      const enemy = inBounds(enemyRow, enemyColumn) ? board[enemyRow][enemyColumn] : null;
      if (enemy && enemy !== 'king' && sideOf(enemy) !== team && canSupportCapture(board, supportRow, supportColumn, team)) {
        board[enemyRow][enemyColumn] = null;
        captured += 1;
      }
    });
    return captured;
  }

  function movePiece(state, fromRow, fromColumn, toRow, toColumn) {
    const next = createState(state);
    if (![fromRow, fromColumn, toRow, toColumn].every(Number.isInteger) || !inBounds(fromRow, fromColumn) || !inBounds(toRow, toColumn)) throw new Error('말판 안의 칸을 선택하세요.');
    const piece = next.board[fromRow][fromColumn];
    if (!piece) throw new Error('움직일 말이 없습니다.');
    if (sideOf(piece) !== next.turn) throw new Error('지금은 상대 말의 차례입니다.');
    if (next.board[toRow][toColumn] !== null) throw new Error('도착 칸이 비어 있지 않습니다.');
    if (fromRow !== toRow && fromColumn !== toColumn) throw new Error('말은 가로 또는 세로 직선으로만 움직입니다.');
    if (fromRow === toRow && fromColumn === toColumn) throw new Error('다른 칸을 선택하세요.');
    if (!isPathClear(next.board, fromRow, fromColumn, toRow, toColumn)) throw new Error('다른 말을 지나갈 수 없습니다.');
    if (piece !== 'king' && isSpecialSquare(toRow, toColumn)) throw new Error('왕만 모서리와 왕좌에 들어갈 수 있습니다.');
    next.board[fromRow][fromColumn] = null;
    next.board[toRow][toColumn] = piece;
    next.captured = captureEnemies(next.board, toRow, toColumn, sideOf(piece));
    next.turn = next.turn === 'attackers' ? 'defenders' : 'attackers';
    return next;
  }

  function findKing(board) {
    for (let row = 0; row < SIZE; row += 1) for (let column = 0; column < SIZE; column += 1) if (board[row][column] === 'king') return [row, column];
    return null;
  }

  function getStatus(state) {
    const current = createState(state);
    const king = findKing(current.board);
    if (!king) return 'attackers-won';
    if (isCorner(king[0], king[1])) return 'defenders-won';
    const surrounded = DIRECTIONS.every(([rowStep, columnStep]) => {
      const row = king[0] + rowStep;
      const column = king[1] + columnStep;
      return inBounds(row, column) && current.board[row][column] === 'attacker';
    });
    return surrounded ? 'attackers-won' : 'playing';
  }

  return { SIZE, emptyBoard, createState, movePiece, getStatus, isCorner, isSpecialSquare };
}));
