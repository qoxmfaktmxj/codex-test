(function defineChomp(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.Chomp = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const DEFAULT_MESSAGE = '독이 든 왼쪽 위 조각을 피해서 초콜릿을 고르세요.';

  function createBoard(rows = 4, cols = 5, fill = true) {
    return Array.from({ length: rows }, () => Array.from({ length: cols }, () => fill));
  }

  function cloneBoard(board) {
    return board.map((row) => row.slice());
  }

  function countSafeCells(board) {
    let count = 0;
    board.forEach((row, rowIndex) => {
      row.forEach((hasChocolate, colIndex) => {
        if (hasChocolate && !(rowIndex === 0 && colIndex === 0)) {
          count += 1;
        }
      });
    });
    return count;
  }

  function createGame(options = {}) {
    const rows = options.rows || 4;
    const cols = options.cols || 5;
    const board = options.board ? cloneBoard(options.board) : createBoard(rows, cols);

    return {
      rows,
      cols,
      board,
      currentPlayer: options.currentPlayer || '사람',
      status: options.status || '진행 중',
      remainingSafeCells: countSafeCells(board),
      message: options.message || DEFAULT_MESSAGE,
    };
  }

  function cloneGame(game, overrides = {}) {
    return {
      rows: game.rows,
      cols: game.cols,
      board: cloneBoard(game.board),
      currentPlayer: game.currentPlayer,
      status: game.status,
      remainingSafeCells: game.remainingSafeCells,
      message: game.message,
      ...overrides,
    };
  }

  function validatePosition(game, row, col) {
    if (!Number.isInteger(row) || !Number.isInteger(col) || row < 0 || col < 0 || row >= game.rows || col >= game.cols) {
      throw new Error('초콜릿 안의 조각만 고를 수 있습니다.');
    }
  }

  function nextPlayer(player) {
    return player === '사람' ? '컴퓨터' : '사람';
  }

  function playerWithSubjectParticle(player) {
    return player === '컴퓨터' ? '컴퓨터가' : `${player}이`;
  }

  function eatRectangle(board, row, col) {
    const nextBoard = cloneBoard(board);
    for (let rowIndex = row; rowIndex < nextBoard.length; rowIndex += 1) {
      for (let colIndex = col; colIndex < nextBoard[rowIndex].length; colIndex += 1) {
        nextBoard[rowIndex][colIndex] = false;
      }
    }
    return nextBoard;
  }

  function chooseCell(game, row, col) {
    validatePosition(game, row, col);

    if (game.status !== '진행 중') {
      return cloneGame(game, {
        message: '이미 끝난 판입니다. 새 판을 시작하세요.',
      });
    }

    if (!game.board[row][col]) {
      return cloneGame(game, {
        message: '이미 먹은 조각입니다. 남은 초콜릿을 고르세요.',
      });
    }

    const board = eatRectangle(game.board, row, col);
    const remainingSafeCells = countSafeCells(board);

    if (row === 0 && col === 0) {
      const status = game.currentPlayer === '사람' ? '패배' : '승리';
      return cloneGame(game, {
        board,
        status,
        remainingSafeCells,
        message: `${playerWithSubjectParticle(game.currentPlayer)} 독 초콜릿을 먹었습니다. ${status}입니다.`,
      });
    }

    return cloneGame(game, {
      board,
      currentPlayer: nextPlayer(game.currentPlayer),
      remainingSafeCells,
      message: `${playerWithSubjectParticle(game.currentPlayer)} ${row + 1}행 ${col + 1}열부터 오른쪽 아래를 먹었습니다.`,
    });
  }

  function availableMoves(game, includePoison = false) {
    const moves = [];
    game.board.forEach((row, rowIndex) => {
      row.forEach((hasChocolate, colIndex) => {
        if (hasChocolate && (includePoison || rowIndex !== 0 || colIndex !== 0)) {
          moves.push([rowIndex, colIndex]);
        }
      });
    });
    return moves;
  }

  function countEatenSafeCells(board, row, col) {
    let count = 0;
    for (let rowIndex = row; rowIndex < board.length; rowIndex += 1) {
      for (let colIndex = col; colIndex < board[rowIndex].length; colIndex += 1) {
        if (board[rowIndex][colIndex] && !(rowIndex === 0 && colIndex === 0)) {
          count += 1;
        }
      }
    }
    return count;
  }

  function findComputerMove(game) {
    const safeMoves = availableMoves(game, false);
    if (safeMoves.length === 0) {
      return [0, 0];
    }

    const winningMove = safeMoves.find(([row, col]) => countSafeCells(eatRectangle(game.board, row, col)) === 0);
    if (winningMove) {
      return winningMove;
    }

    const move = safeMoves
      .map(([row, col]) => ({ row, col, eaten: countEatenSafeCells(game.board, row, col) }))
      .sort((a, b) => b.eaten - a.eaten || b.row - a.row || b.col - a.col)[0];

    return [move.row, move.col];
  }

  function computerMove(game) {
    if (game.status !== '진행 중') {
      return cloneGame(game, {
        message: '이미 끝난 판입니다. 새 판을 시작하세요.',
      });
    }

    if (game.currentPlayer !== '컴퓨터') {
      return cloneGame(game, {
        message: '아직 컴퓨터 차례가 아닙니다.',
      });
    }

    const [row, col] = findComputerMove(game);
    return chooseCell(game, row, col);
  }

  return {
    availableMoves,
    chooseCell,
    computerMove,
    createBoard,
    createGame,
    findComputerMove,
  };
}));
