(function defineTapatan(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.Tapatan = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const PLAYER = 'X';
  const COMPUTER = 'O';
  const EMPTY = null;
  const PLACE_PHASE = '놓기';
  const MOVE_PHASE = '이동';
  const END_PHASE = '끝';
  const DEFAULT_MESSAGE = '내 말을 빈 점에 놓으세요.';
  const WIN_LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  const ADJACENT = {
    0: [1, 3, 4],
    1: [0, 2, 4],
    2: [1, 4, 5],
    3: [0, 4, 6],
    4: [0, 1, 2, 3, 5, 6, 7, 8],
    5: [2, 4, 8],
    6: [3, 4, 7],
    7: [4, 6, 8],
    8: [4, 5, 7],
  };

  function cloneGame(game, overrides = {}) {
    return {
      board: game.board.slice(),
      turn: game.turn,
      phase: game.phase,
      status: game.status,
      remaining: { ...game.remaining },
      selected: game.selected,
      message: game.message,
      lastMove: game.lastMove ? { ...game.lastMove } : null,
      ...overrides,
    };
  }

  function createGame(overrides = {}) {
    const game = {
      board: Array(9).fill(EMPTY),
      turn: PLAYER,
      phase: PLACE_PHASE,
      status: '진행 중',
      remaining: { [PLAYER]: 3, [COMPUTER]: 3 },
      selected: null,
      message: DEFAULT_MESSAGE,
      lastMove: null,
      ...overrides,
    };

    if (overrides.phase === undefined && game.remaining[PLAYER] === 0 && game.remaining[COMPUTER] === 0) {
      game.phase = MOVE_PHASE;
    }

    return cloneGame(game);
  }

  function getOpponent(piece) {
    return piece === PLAYER ? COMPUTER : PLAYER;
  }

  function isPoint(index) {
    return Number.isInteger(index) && index >= 0 && index < 9;
  }

  function getWinLine(board, piece) {
    return WIN_LINES.find((line) => line.every((index) => board[index] === piece)) || null;
  }

  function hasWon(board, piece) {
    return Boolean(getWinLine(board, piece));
  }

  function getEmptyPoints(board) {
    return board
      .map((cell, index) => (cell === EMPTY ? index : null))
      .filter((index) => index !== null);
  }

  function getPhaseAfterPlacement(remaining) {
    return remaining[PLAYER] === 0 && remaining[COMPUTER] === 0 ? MOVE_PHASE : PLACE_PHASE;
  }

  function getTurnMessage(turn, phase) {
    if (turn === PLAYER) {
      return phase === PLACE_PHASE ? DEFAULT_MESSAGE : '내 말을 골라 인접한 빈 점으로 옮기세요.';
    }
    return phase === PLACE_PHASE ? '컴퓨터가 말을 놓을 차례입니다.' : '컴퓨터가 말을 옮길 차례입니다.';
  }

  function withResult(game, movedPiece) {
    if (hasWon(game.board, movedPiece)) {
      return cloneGame(game, {
        phase: END_PHASE,
        status: movedPiece === PLAYER ? '승리' : '패배',
        message: movedPiece === PLAYER
          ? '세 말을 한 줄로 이었습니다. 승리!'
          : '컴퓨터가 세 말을 이었습니다. 패배.',
      });
    }

    return cloneGame(game, {
      message: getTurnMessage(game.turn, game.phase),
    });
  }

  function placeStone(game, point) {
    if (game.status !== '진행 중') {
      return cloneGame(game);
    }
    if (game.phase !== PLACE_PHASE) {
      throw new Error('지금은 말을 옮기는 단계입니다.');
    }
    if (!isPoint(point) || game.board[point] !== EMPTY) {
      throw new Error('빈 점에만 말을 놓을 수 있습니다.');
    }
    if (game.remaining[game.turn] <= 0) {
      throw new Error('남은 말이 없습니다.');
    }

    const board = game.board.slice();
    board[point] = game.turn;
    const remaining = { ...game.remaining, [game.turn]: game.remaining[game.turn] - 1 };
    const nextTurn = getOpponent(game.turn);
    const nextPhase = getPhaseAfterPlacement(remaining);
    const placed = cloneGame(game, {
      board,
      remaining,
      turn: nextTurn,
      phase: nextPhase,
      selected: null,
      lastMove: { type: PLACE_PHASE, to: point, piece: game.turn },
    });

    return withResult(placed, game.turn);
  }

  function getLegalMoves(game, from) {
    if (!isPoint(from) || game.board[from] !== game.turn) {
      return [];
    }
    if (game.phase === PLACE_PHASE || game.status !== '진행 중') {
      return [];
    }

    return ADJACENT[from].filter((point) => game.board[point] === EMPTY);
  }

  function getAllMoves(game, piece = game.turn) {
    if (game.phase !== MOVE_PHASE || game.status !== '진행 중') {
      return [];
    }

    return game.board.flatMap((cell, from) => {
      if (cell !== piece) {
        return [];
      }
      return ADJACENT[from]
        .filter((to) => game.board[to] === EMPTY)
        .map((to) => ({ from, to, piece }));
    });
  }

  function moveStone(game, from, to) {
    if (game.status !== '진행 중') {
      return cloneGame(game);
    }
    if (game.phase !== MOVE_PHASE) {
      throw new Error('아직 말을 놓는 단계입니다.');
    }
    if (!isPoint(from) || game.board[from] !== game.turn) {
      throw new Error('지금 차례의 말만 고를 수 있습니다.');
    }
    if (!getLegalMoves(game, from).includes(to)) {
      throw new Error('인접한 빈 점으로만 이동할 수 있습니다.');
    }

    const board = game.board.slice();
    board[to] = game.turn;
    board[from] = EMPTY;
    const moved = cloneGame(game, {
      board,
      turn: getOpponent(game.turn),
      selected: null,
      lastMove: { type: MOVE_PHASE, from, to, piece: game.turn },
    });

    return withResult(moved, game.turn);
  }

  function findPlacementForLine(game, piece) {
    return getEmptyPoints(game.board).find((point) => {
      const board = game.board.slice();
      board[point] = piece;
      return hasWon(board, piece);
    });
  }

  function chooseComputerPlacement(game) {
    const winning = findPlacementForLine(game, COMPUTER);
    if (winning !== undefined) {
      return winning;
    }

    const blocking = findPlacementForLine(game, PLAYER);
    if (blocking !== undefined) {
      return blocking;
    }

    return [4, 0, 2, 6, 8, 1, 3, 5, 7].find((point) => game.board[point] === EMPTY);
  }

  function chooseComputerMove(game) {
    const moves = getAllMoves(game, COMPUTER);
    const winning = moves.find((move) => {
      const board = game.board.slice();
      board[move.from] = EMPTY;
      board[move.to] = COMPUTER;
      return hasWon(board, COMPUTER);
    });
    if (winning) {
      return winning;
    }

    const blockingLine = WIN_LINES.find((line) => {
      const playerCount = line.filter((point) => game.board[point] === PLAYER).length;
      const emptyCount = line.filter((point) => game.board[point] === EMPTY).length;
      return playerCount === 2 && emptyCount === 1;
    });
    if (blockingLine) {
      const target = blockingLine.find((point) => game.board[point] === EMPTY);
      const block = moves.find((move) => move.to === target);
      if (block) {
        return block;
      }
    }

    return moves.find((move) => move.to === 4) || moves[0] || null;
  }

  function playComputerTurn(game) {
    if (game.status !== '진행 중' || game.turn !== COMPUTER) {
      return cloneGame(game);
    }

    if (game.phase === PLACE_PHASE) {
      return placeStone(game, chooseComputerPlacement(game));
    }

    const move = chooseComputerMove(game);
    if (!move) {
      return cloneGame(game, {
        phase: END_PHASE,
        status: '승리',
        message: '컴퓨터가 옮길 수 있는 말이 없습니다. 승리!',
      });
    }
    return moveStone(game, move.from, move.to);
  }

  return {
    PLAYER,
    COMPUTER,
    PLACE_PHASE,
    MOVE_PHASE,
    WIN_LINES,
    ADJACENT,
    createGame,
    getWinLine,
    hasWon,
    getEmptyPoints,
    getLegalMoves,
    getAllMoves,
    placeStone,
    moveStone,
    chooseComputerPlacement,
    chooseComputerMove,
    playComputerTurn,
  };
}));
