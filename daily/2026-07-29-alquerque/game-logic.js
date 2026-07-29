(function defineAlquerque(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.Alquerque = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const SIZE = 5;
  const WHITE = '백돌';
  const BLACK = '흑돌';
  const EMPTY = null;
  const DIRECTIONS = [
    [-1, 0], [1, 0], [0, -1], [0, 1],
    [-1, -1], [-1, 1], [1, -1], [1, 1],
  ];

  function isInBounds(row, col) {
    return Number.isInteger(row) && Number.isInteger(col) && row >= 0 && row < SIZE && col >= 0 && col < SIZE;
  }

  function supportsDiagonal(row, col) {
    return (row + col) % 2 === 0;
  }

  function isConnected(fromRow, fromCol, toRow, toCol) {
    const rowDistance = Math.abs(toRow - fromRow);
    const colDistance = Math.abs(toCol - fromCol);
    if ((rowDistance === 1 && colDistance === 0) || (rowDistance === 0 && colDistance === 1)) return true;
    return rowDistance === 1 && colDistance === 1 && supportsDiagonal(fromRow, fromCol);
  }

  function emptyBoard() {
    return Array.from({ length: SIZE }, () => Array(SIZE).fill(EMPTY));
  }

  function createOpeningBoard() {
    const board = emptyBoard();
    for (let row = 0; row < SIZE; row += 1) {
      for (let col = 0; col < SIZE; col += 1) {
        if (row < 2 || (row === 2 && col < 2)) board[row][col] = WHITE;
        if (row > 2 || (row === 2 && col > 2)) board[row][col] = BLACK;
      }
    }
    return board;
  }

  function cloneBoard(board) {
    return board.map((row) => row.slice());
  }

  function opposite(piece) {
    return piece === WHITE ? BLACK : WHITE;
  }

  function pieceCount(board, piece) {
    return board.flat().filter((cell) => cell === piece).length;
  }

  function validDirections(row, col) {
    return DIRECTIONS.filter(([rowStep, colStep]) => (rowStep === 0 || colStep === 0 || supportsDiagonal(row, col)));
  }

  function captureMoves(board, piece) {
    const captures = [];
    for (let row = 0; row < SIZE; row += 1) {
      for (let col = 0; col < SIZE; col += 1) {
        if (board[row][col] !== piece) continue;
        validDirections(row, col).forEach(([rowStep, colStep]) => {
          const middleRow = row + rowStep;
          const middleCol = col + colStep;
          const targetRow = row + rowStep * 2;
          const targetCol = col + colStep * 2;
          if (isInBounds(targetRow, targetCol)
            && board[middleRow][middleCol] === opposite(piece)
            && board[targetRow][targetCol] === EMPTY) {
            captures.push({ fromRow: row, fromCol: col, toRow: targetRow, toCol: targetCol });
          }
        });
      }
    }
    return captures;
  }

  function hasStep(board, piece) {
    for (let row = 0; row < SIZE; row += 1) {
      for (let col = 0; col < SIZE; col += 1) {
        if (board[row][col] !== piece) continue;
        if (validDirections(row, col).some(([rowStep, colStep]) => {
          const targetRow = row + rowStep;
          const targetCol = col + colStep;
          return isInBounds(targetRow, targetCol) && board[targetRow][targetCol] === EMPTY;
        })) return true;
      }
    }
    return false;
  }

  function makeGame(board, turn, captured, forcedPiece = null) {
    const whiteLeft = pieceCount(board, WHITE);
    const blackLeft = pieceCount(board, BLACK);
    let status = '진행 중';
    let message = `${turn} 차례입니다.`;
    if (blackLeft === 0) {
      status = '백 승리';
      message = '백돌이 모든 흑돌을 잡아 승리했습니다.';
    } else if (whiteLeft === 0) {
      status = '흑 승리';
      message = '흑돌이 모든 백돌을 잡아 승리했습니다.';
    } else if (forcedPiece) {
      message = `${turn}은 같은 말로 계속 잡아야 합니다.`;
    } else if (captureMoves(board, turn).length === 0 && !hasStep(board, turn)) {
      const winner = opposite(turn);
      status = `${winner === WHITE ? '백' : '흑'} 승리`;
      message = `${turn}은 움직일 수 없어 ${winner}이 승리했습니다.`;
    } else if (captureMoves(board, turn).length > 0) {
      message = `${turn} 차례입니다. 잡을 수 있는 말을 반드시 뛰어넘으세요.`;
    }
    return { size: SIZE, board, turn, captured, forcedPiece, status, message };
  }

  function createGame(options = {}) {
    const board = options.board ? cloneBoard(options.board) : createOpeningBoard();
    const turn = options.turn || WHITE;
    const captured = { white: 0, black: 0, ...(options.captured || {}) };
    if (!Array.isArray(board) || board.length !== SIZE || board.some((row) => !Array.isArray(row) || row.length !== SIZE)) {
      throw new Error('말판 정보가 올바르지 않습니다.');
    }
    if (board.flat().some((cell) => cell !== WHITE && cell !== BLACK && cell !== EMPTY)) {
      throw new Error('말판 칸 정보가 올바르지 않습니다.');
    }
    if (turn !== WHITE && turn !== BLACK) throw new Error('차례 정보가 올바르지 않습니다.');
    return makeGame(board, turn, captured);
  }

  function movePiece(game, fromRow, fromCol, toRow, toCol) {
    if (game.status !== '진행 중') throw new Error('이미 끝난 게임입니다.');
    if (!isInBounds(fromRow, fromCol) || !isInBounds(toRow, toCol)) throw new Error('말판 범위를 벗어났습니다.');
    if (game.forcedPiece && (game.forcedPiece.row !== fromRow || game.forcedPiece.col !== fromCol)) {
      throw new Error('연속 잡기에서는 반드시 같은 말을 움직여야 합니다.');
    }
    if (game.board[fromRow][fromCol] !== game.turn) throw new Error('내 말을 선택하세요.');
    if (game.board[toRow][toCol] !== EMPTY) throw new Error('도착 칸은 비어 있어야 합니다.');
    const rowDistance = toRow - fromRow;
    const colDistance = toCol - fromCol;
    const isStep = isConnected(fromRow, fromCol, toRow, toCol);
    const directionRow = rowDistance / 2;
    const directionCol = colDistance / 2;
    const absoluteRowDistance = Math.abs(rowDistance);
    const absoluteColDistance = Math.abs(colDistance);
    const isJump = (absoluteRowDistance === 2 && (absoluteColDistance === 0 || absoluteColDistance === 2))
      || (absoluteColDistance === 2 && absoluteRowDistance === 0);
    const jumpIsConnected = isJump && isConnected(fromRow, fromCol, fromRow + directionRow, fromCol + directionCol);
    const mustCapture = captureMoves(game.board, game.turn).length > 0;

    if (isStep && game.forcedPiece) throw new Error('연속 잡기에서는 반드시 같은 말을 움직여야 합니다.');
    if (isStep && mustCapture) throw new Error('잡을 수 있는 말이 있으면 반드시 잡아야 합니다.');
    if (isStep) {
      const board = cloneBoard(game.board);
      board[fromRow][fromCol] = EMPTY;
      board[toRow][toCol] = game.turn;
      return makeGame(board, opposite(game.turn), { ...game.captured });
    }
    if (!jumpIsConnected) throw new Error('말은 연결선을 따라 한 칸 이동하거나 한 말을 뛰어넘어야 합니다.');
    const middleRow = fromRow + directionRow;
    const middleCol = fromCol + directionCol;
    if (game.board[middleRow][middleCol] !== opposite(game.turn)) throw new Error('뛰어넘을 상대 말이 없습니다.');
    const board = cloneBoard(game.board);
    board[fromRow][fromCol] = EMPTY;
    board[middleRow][middleCol] = EMPTY;
    board[toRow][toCol] = game.turn;
    const captured = { ...game.captured, [game.turn === WHITE ? 'white' : 'black']: game.captured[game.turn === WHITE ? 'white' : 'black'] + 1 };
    const followUpCapture = captureMoves(board, game.turn).find((move) => move.fromRow === toRow && move.fromCol === toCol);
    if (followUpCapture) {
      return makeGame(board, game.turn, captured, { row: toRow, col: toCol });
    }
    return makeGame(board, opposite(game.turn), captured);
  }

  return { SIZE, WHITE, BLACK, EMPTY, emptyBoard, createGame, movePiece };
}));
