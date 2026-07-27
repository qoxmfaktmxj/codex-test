(function defineCheckers(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.Checkers = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const SIZE = 6;
  const BLACK = '흑';
  const WHITE = '백';

  function createBoard() {
    return Array.from({ length: SIZE }, (_, row) => Array.from({ length: SIZE }, (_, col) => {
      if ((row + col) % 2 === 0) {
        return null;
      }
      if (row < 2) {
        return BLACK;
      }
      if (row > 3) {
        return WHITE;
      }
      return null;
    }));
  }

  function cloneBoard(board) {
    return board.map((row) => row.slice());
  }

  function countPieces(board, color) {
    return board.flat().filter((piece) => piece === color).length;
  }

  function hasMove(board, color) {
    const direction = color === BLACK ? 1 : -1;
    for (let row = 0; row < SIZE; row += 1) {
      for (let col = 0; col < SIZE; col += 1) {
        if (board[row][col] !== color) {
          continue;
        }
        for (const colDirection of [-1, 1]) {
          const nextRow = row + direction;
          const nextCol = col + colDirection;
          if (nextRow >= 0 && nextRow < SIZE && nextCol >= 0 && nextCol < SIZE && board[nextRow][nextCol] === null) {
            return true;
          }
          const jumpRow = row + direction * 2;
          const jumpCol = col + colDirection * 2;
          if (jumpRow >= 0 && jumpRow < SIZE && jumpCol >= 0 && jumpCol < SIZE
            && board[nextRow]?.[nextCol] === (color === BLACK ? WHITE : BLACK) && board[jumpRow][jumpCol] === null) {
            return true;
          }
        }
      }
    }
    return false;
  }

  function makeGame(board, current) {
    const blackCount = countPieces(board, BLACK);
    const whiteCount = countPieces(board, WHITE);
    const winner = blackCount === 0 ? WHITE : (whiteCount === 0 ? BLACK : (hasMove(board, current) ? null : (current === BLACK ? WHITE : BLACK)));
    const status = winner ? `${winner} 승리` : '진행 중';

    return {
      size: SIZE,
      board,
      current,
      blackCount,
      whiteCount,
      status,
      message: winner ? `${winner}돌 승리! 상대 말을 모두 잡았거나 움직일 수 없습니다.` : `${current}돌 차례입니다.`,
    };
  }

  function createGame(options = {}) {
    const board = options.board ? cloneBoard(options.board) : createBoard();
    if (!Array.isArray(board) || board.length !== SIZE || board.some((row) => !Array.isArray(row) || row.length !== SIZE)) {
      throw new Error('말판 정보가 올바르지 않습니다.');
    }
    if (board.flat().some((piece) => piece !== null && piece !== BLACK && piece !== WHITE)) {
      throw new Error('말판에는 흑돌과 백돌만 놓을 수 있습니다.');
    }
    const current = options.current === WHITE ? WHITE : BLACK;
    return makeGame(board, current);
  }

  function assertInBounds(row, col) {
    if (!Number.isInteger(row) || !Number.isInteger(col) || row < 0 || row >= SIZE || col < 0 || col >= SIZE) {
      throw new Error('말판 범위를 벗어났습니다.');
    }
  }

  function movePiece(game, fromRow, fromCol, toRow, toCol) {
    if (game.status !== '진행 중') {
      throw new Error('이미 끝난 게임입니다.');
    }
    assertInBounds(fromRow, fromCol);
    assertInBounds(toRow, toCol);

    const piece = game.board[fromRow][fromCol];
    if (piece !== game.current) {
      throw new Error('자기 말만 움직일 수 있습니다.');
    }
    if (game.board[toRow][toCol] !== null) {
      throw new Error('도착 칸이 비어 있지 않습니다.');
    }

    const rowStep = toRow - fromRow;
    const colStep = toCol - fromCol;
    const direction = piece === BLACK ? 1 : -1;
    const distance = Math.abs(rowStep);
    if (Math.abs(colStep) !== distance || (distance !== 1 && distance !== 2)) {
      throw new Error('대각선으로 한 칸 또는 두 칸만 움직일 수 있습니다.');
    }
    if (rowStep !== direction * distance) {
      throw new Error('말은 정해진 방향으로만 움직일 수 있습니다.');
    }

    const board = cloneBoard(game.board);
    board[fromRow][fromCol] = null;
    board[toRow][toCol] = piece;
    if (distance === 2) {
      const jumpedRow = fromRow + rowStep / 2;
      const jumpedCol = fromCol + colStep / 2;
      if (board[jumpedRow][jumpedCol] !== (piece === BLACK ? WHITE : BLACK)) {
        throw new Error('잡을 상대 말이 없습니다.');
      }
      board[jumpedRow][jumpedCol] = null;
    }

    const next = makeGame(board, piece === BLACK ? WHITE : BLACK);
    return {
      ...next,
      message: next.status === '진행 중'
        ? `${piece}돌을 움직였습니다. ${next.current}돌 차례입니다.`
        : next.message,
    };
  }

  return {
    SIZE,
    BLACK,
    WHITE,
    createGame,
    movePiece,
  };
}));
