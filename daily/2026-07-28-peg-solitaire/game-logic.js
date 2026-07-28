(function definePegSolitaire(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.PegSolitaire = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const SIZE = 7;
  const PEG = '말';
  const EMPTY = null;
  const INVALID = '사용 안 함';

  function isValidCell(row, col) {
    return (row >= 2 && row <= 4) || (col >= 2 && col <= 4);
  }

  function createBoard() {
    return Array.from({ length: SIZE }, (_, row) => Array.from({ length: SIZE }, (_, col) => {
      if (!isValidCell(row, col)) {
        return INVALID;
      }
      return row === 3 && col === 3 ? EMPTY : PEG;
    }));
  }

  function cloneBoard(board) {
    return board.map((row) => row.slice());
  }

  function countPegs(board) {
    return board.flat().filter((cell) => cell === PEG).length;
  }

  function isInBounds(row, col) {
    return Number.isInteger(row) && Number.isInteger(col) && row >= 0 && row < SIZE && col >= 0 && col < SIZE;
  }

  function hasMove(board) {
    for (let row = 0; row < SIZE; row += 1) {
      for (let col = 0; col < SIZE; col += 1) {
        if (board[row][col] !== PEG) {
          continue;
        }
        for (const [rowStep, colStep] of [[2, 0], [-2, 0], [0, 2], [0, -2]]) {
          const targetRow = row + rowStep;
          const targetCol = col + colStep;
          const middleRow = row + rowStep / 2;
          const middleCol = col + colStep / 2;
          if (isInBounds(targetRow, targetCol)
            && board[middleRow][middleCol] === PEG
            && board[targetRow][targetCol] === EMPTY) {
            return true;
          }
        }
      }
    }
    return false;
  }

  function makeGame(board) {
    const remaining = countPegs(board);
    const status = remaining === 1 ? '성공' : (hasMove(board) ? '진행 중' : '종료');
    const message = status === '성공'
      ? '축하합니다! 말 하나만 남겨 성공했습니다.'
      : (status === '종료' ? `더 이상 움직일 수 없습니다. ${remaining}개의 말이 남았습니다.` : `말 ${remaining}개를 하나만 남기세요.`);

    return { size: SIZE, board, remaining, status, message };
  }

  function createGame(options = {}) {
    const board = options.board ? cloneBoard(options.board) : createBoard();
    if (!Array.isArray(board) || board.length !== SIZE || board.some((row) => !Array.isArray(row) || row.length !== SIZE)) {
      throw new Error('말판 정보가 올바르지 않습니다.');
    }
    for (let row = 0; row < SIZE; row += 1) {
      for (let col = 0; col < SIZE; col += 1) {
        const expectedInvalid = !isValidCell(row, col);
        if ((expectedInvalid && board[row][col] !== INVALID) || (!expectedInvalid && board[row][col] !== PEG && board[row][col] !== EMPTY)) {
          throw new Error('말판 칸 정보가 올바르지 않습니다.');
        }
      }
    }
    return makeGame(board);
  }

  function movePeg(game, fromRow, fromCol, toRow, toCol) {
    if (game.status !== '진행 중') {
      throw new Error('이미 끝난 게임입니다.');
    }
    if (!isInBounds(fromRow, fromCol) || !isInBounds(toRow, toCol)) {
      throw new Error('말판 범위를 벗어났습니다.');
    }
    if (game.board[fromRow][fromCol] === INVALID || game.board[toRow][toCol] === INVALID) {
      throw new Error('사용할 수 없는 칸입니다.');
    }
    if (game.board[fromRow][fromCol] !== PEG) {
      throw new Error('시작 칸에 말이 없습니다.');
    }
    const rowDistance = toRow - fromRow;
    const colDistance = toCol - fromCol;
    if (rowDistance !== 0 && colDistance !== 0) {
      throw new Error('가로 또는 세로로만 움직일 수 있습니다.');
    }
    if (Math.abs(rowDistance) !== 2 && Math.abs(colDistance) !== 2) {
      throw new Error('정확히 두 칸을 건너뛰어야 합니다.');
    }
    if (game.board[toRow][toCol] !== EMPTY) {
      throw new Error('도착 칸은 비어 있어야 합니다.');
    }
    const middleRow = fromRow + rowDistance / 2;
    const middleCol = fromCol + colDistance / 2;
    if (game.board[middleRow][middleCol] !== PEG) {
      throw new Error('건너뛸 말이 없습니다.');
    }

    const board = cloneBoard(game.board);
    board[fromRow][fromCol] = EMPTY;
    board[middleRow][middleCol] = EMPTY;
    board[toRow][toCol] = PEG;
    return makeGame(board);
  }

  return { SIZE, PEG, EMPTY, INVALID, createGame, movePeg };
}));
