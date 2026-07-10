(function defineHexapawn(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.Hexapawn = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const PLAYER = 'P';
  const COMPUTER = 'C';
  const EMPTY = null;
  const BOARD_SIZE = 3;
  const DEFAULT_MESSAGE = '내 말을 골라 앞으로 전진하거나 대각선으로 잡으세요.';

  function cloneBoard(board) {
    return board.map((row) => row.slice());
  }

  function cloneMove(move) {
    return {
      from: move.from.slice(),
      to: move.to.slice(),
      capture: move.capture,
    };
  }

  function cloneGame(game, overrides = {}) {
    return {
      board: cloneBoard(game.board),
      turn: game.turn,
      status: game.status,
      message: game.message,
      lastMove: game.lastMove ? cloneMove(game.lastMove) : null,
      ...overrides,
    };
  }

  function createGame(overrides = {}) {
    const game = {
      board: [
        [COMPUTER, COMPUTER, COMPUTER],
        [EMPTY, EMPTY, EMPTY],
        [PLAYER, PLAYER, PLAYER],
      ],
      turn: PLAYER,
      status: '진행 중',
      message: DEFAULT_MESSAGE,
      lastMove: null,
      ...overrides,
    };

    return cloneGame(game);
  }

  function isInside(row, col) {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
  }

  function getOpponent(piece) {
    return piece === PLAYER ? COMPUTER : PLAYER;
  }

  function getDirection(piece) {
    return piece === PLAYER ? -1 : 1;
  }

  function getLegalMoves(game, row, col) {
    if (!isInside(row, col)) {
      return [];
    }

    const piece = game.board[row][col];
    if (piece !== PLAYER && piece !== COMPUTER) {
      return [];
    }

    const moves = [];
    const nextRow = row + getDirection(piece);
    const opponent = getOpponent(piece);

    if (isInside(nextRow, col) && game.board[nextRow][col] === EMPTY) {
      moves.push({ from: [row, col], to: [nextRow, col], capture: false });
    }

    [col - 1, col + 1].forEach((nextCol) => {
      if (isInside(nextRow, nextCol) && game.board[nextRow][nextCol] === opponent) {
        moves.push({ from: [row, col], to: [nextRow, nextCol], capture: true });
      }
    });

    return moves;
  }

  function getAllLegalMoves(game, piece = game.turn) {
    const moves = [];
    game.board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === piece) {
          moves.push(...getLegalMoves(game, rowIndex, colIndex));
        }
      });
    });
    return moves;
  }

  function hasPiece(board, piece) {
    return board.some((row) => row.includes(piece));
  }

  function getWinnerByRank(board) {
    if (board[0].includes(PLAYER)) {
      return PLAYER;
    }
    if (board[BOARD_SIZE - 1].includes(COMPUTER)) {
      return COMPUTER;
    }
    return null;
  }

  function getGameResult(game, nextTurn) {
    const rankWinner = getWinnerByRank(game.board);
    if (rankWinner === PLAYER) {
      return { status: '승리', message: '내 말이 끝줄에 도착했습니다. 승리!' };
    }
    if (rankWinner === COMPUTER) {
      return { status: '패배', message: '컴퓨터 말이 끝줄에 도착했습니다. 패배.' };
    }
    if (!hasPiece(game.board, PLAYER)) {
      return { status: '패배', message: '내 말이 모두 잡혔습니다. 패배.' };
    }
    if (!hasPiece(game.board, COMPUTER)) {
      return { status: '승리', message: '컴퓨터 말이 모두 잡혔습니다. 승리!' };
    }

    const opponentMoves = getAllLegalMoves(game, nextTurn);
    if (opponentMoves.length === 0) {
      return nextTurn === PLAYER
        ? { status: '패배', message: '움직일 수 있는 내 말이 없습니다. 패배.' }
        : { status: '승리', message: '컴퓨터가 움직일 수 없습니다. 승리!' };
    }

    return {
      status: '진행 중',
      message: nextTurn === PLAYER ? DEFAULT_MESSAGE : '컴퓨터가 수를 고르고 있습니다.',
    };
  }

  function sameSquare(a, b) {
    return a[0] === b[0] && a[1] === b[1];
  }

  function findMatchingMove(game, from, to) {
    return getLegalMoves(game, from[0], from[1]).find((move) => sameSquare(move.to, to));
  }

  function movePiece(game, from, to) {
    if (game.status !== '진행 중') {
      return cloneGame(game);
    }

    const piece = game.board[from[0]]?.[from[1]];
    if (piece !== game.turn) {
      throw new Error('지금 차례의 말만 움직일 수 있습니다.');
    }

    const move = findMatchingMove(game, from, to);
    if (!move) {
      throw new Error('허용되지 않는 이동입니다.');
    }

    const nextBoard = cloneBoard(game.board);
    nextBoard[to[0]][to[1]] = piece;
    nextBoard[from[0]][from[1]] = EMPTY;

    const nextTurn = getOpponent(piece);
    const moved = cloneGame(game, {
      board: nextBoard,
      turn: nextTurn,
      lastMove: move,
    });
    const result = getGameResult(moved, nextTurn);

    return cloneGame(moved, {
      status: result.status,
      message: result.message,
    });
  }

  function chooseComputerMove(game) {
    const moves = getAllLegalMoves(game, COMPUTER);
    const winning = moves.find((move) => move.to[0] === BOARD_SIZE - 1);
    if (winning) {
      return winning;
    }

    const capture = moves.find((move) => move.capture);
    return capture || moves[0] || null;
  }

  function playComputerTurn(game) {
    if (game.status !== '진행 중' || game.turn !== COMPUTER) {
      return cloneGame(game);
    }

    const move = chooseComputerMove(game);
    if (!move) {
      return cloneGame(game, {
        status: '승리',
        message: '컴퓨터가 움직일 수 없습니다. 승리!',
      });
    }

    return movePiece(game, move.from, move.to);
  }

  return {
    PLAYER,
    COMPUTER,
    BOARD_SIZE,
    createGame,
    getLegalMoves,
    getAllLegalMoves,
    movePiece,
    chooseComputerMove,
    playComputerTurn,
  };
}));
