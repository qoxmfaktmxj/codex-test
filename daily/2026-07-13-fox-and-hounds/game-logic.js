(function defineFoxAndHounds(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.FoxAndHounds = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const FOX = 'FOX';
  const HOUNDS = 'HOUNDS';
  const BOARD_SIZE = 8;
  const DEFAULT_FOX = { row: 7, col: 0 };
  const DEFAULT_HOUNDS = [
    { row: 0, col: 1 },
    { row: 0, col: 3 },
    { row: 0, col: 5 },
    { row: 0, col: 7 },
  ];
  const FOX_DIRECTIONS = [
    { row: -1, col: -1 },
    { row: -1, col: 1 },
    { row: 1, col: -1 },
    { row: 1, col: 1 },
  ];
  const HOUND_DIRECTIONS = [
    { row: 1, col: -1 },
    { row: 1, col: 1 },
  ];

  function clonePoint(point) {
    return { row: point.row, col: point.col };
  }

  function cloneGame(game, overrides = {}) {
    return {
      fox: clonePoint(game.fox),
      hounds: game.hounds.map(clonePoint),
      turn: game.turn,
      status: game.status,
      message: game.message,
      lastMove: game.lastMove ? {
        piece: game.lastMove.piece,
        from: clonePoint(game.lastMove.from),
        to: clonePoint(game.lastMove.to),
        houndIndex: game.lastMove.houndIndex,
      } : null,
      ...overrides,
    };
  }

  function createGame(overrides = {}) {
    const game = {
      fox: clonePoint(DEFAULT_FOX),
      hounds: DEFAULT_HOUNDS.map(clonePoint),
      turn: FOX,
      status: '진행 중',
      message: '여우를 대각선 한 칸으로 움직이세요.',
      lastMove: null,
      ...overrides,
    };

    game.fox = clonePoint(game.fox);
    game.hounds = game.hounds.map(clonePoint);
    return cloneGame(game);
  }

  function samePoint(a, b) {
    return a.row === b.row && a.col === b.col;
  }

  function isInside(point) {
    return Number.isInteger(point.row)
      && Number.isInteger(point.col)
      && point.row >= 0
      && point.row < BOARD_SIZE
      && point.col >= 0
      && point.col < BOARD_SIZE;
  }

  function isDarkSquare(point) {
    return isInside(point) && (point.row + point.col) % 2 === 1;
  }

  function hasHoundAt(game, point) {
    return game.hounds.some((hound) => samePoint(hound, point));
  }

  function isEmptyDarkSquare(game, point) {
    return isDarkSquare(point) && !samePoint(game.fox, point) && !hasHoundAt(game, point);
  }

  function getFoxMoves(game) {
    if (game.status !== '진행 중') {
      return [];
    }

    return FOX_DIRECTIONS
      .map((direction) => ({
        row: game.fox.row + direction.row,
        col: game.fox.col + direction.col,
      }))
      .filter((point) => isEmptyDarkSquare(game, point));
  }

  function getHoundMoves(game, houndIndex) {
    if (game.status !== '진행 중' || !Number.isInteger(houndIndex) || !game.hounds[houndIndex]) {
      return [];
    }

    const hound = game.hounds[houndIndex];
    return HOUND_DIRECTIONS
      .map((direction) => ({
        row: hound.row + direction.row,
        col: hound.col + direction.col,
      }))
      .filter((point) => isEmptyDarkSquare(game, point));
  }

  function getAllHoundMoves(game) {
    return game.hounds.flatMap((hound, houndIndex) => getHoundMoves(game, houndIndex)
      .map((to) => ({ houndIndex, from: clonePoint(hound), to })));
  }

  function assertRunning(game) {
    if (game.status !== '진행 중') {
      throw new Error('이미 끝난 판입니다.');
    }
  }

  function assertDiagonalStep(from, to, allowedDirections) {
    const rowDiff = to.row - from.row;
    const colDiff = to.col - from.col;
    const isAllowed = allowedDirections.some((direction) => (
      direction.row === rowDiff && direction.col === colDiff
    ));
    if (!isAllowed) {
      throw new Error('대각선 한 칸으로만 움직일 수 있습니다.');
    }
  }

  function withFoxResult(game) {
    if (game.fox.row === 0) {
      return cloneGame(game, {
        status: '승리',
        message: '여우가 사냥개 뒤를 빠져나갔습니다. 승리!',
      });
    }

    return cloneGame(game, {
      message: '컴퓨터가 사냥개를 움직일 차례입니다.',
    });
  }

  function withHoundResult(game) {
    if (getFoxMoves(game).length === 0) {
      return cloneGame(game, {
        status: '패배',
        message: '여우가 움직일 곳이 없습니다. 패배.',
      });
    }

    return cloneGame(game, {
      message: '여우를 대각선 한 칸으로 움직이세요.',
    });
  }

  function moveFox(game, to) {
    assertRunning(game);
    if (game.turn !== FOX) {
      throw new Error('여우 차례가 아닙니다.');
    }
    assertDiagonalStep(game.fox, to, FOX_DIRECTIONS);
    if (!isEmptyDarkSquare(game, to)) {
      throw new Error('빈 어두운 칸으로만 움직일 수 있습니다.');
    }

    const moved = cloneGame(game, {
      fox: clonePoint(to),
      turn: HOUNDS,
      lastMove: { piece: FOX, from: clonePoint(game.fox), to: clonePoint(to) },
    });
    return withFoxResult(moved);
  }

  function moveHound(game, houndIndex, to) {
    assertRunning(game);
    if (game.turn !== HOUNDS) {
      throw new Error('사냥개 차례가 아닙니다.');
    }
    if (!Number.isInteger(houndIndex) || !game.hounds[houndIndex]) {
      throw new Error('움직일 사냥개를 고르세요.');
    }

    const from = game.hounds[houndIndex];
    assertDiagonalStep(from, to, HOUND_DIRECTIONS);
    if (!isEmptyDarkSquare(game, to)) {
      throw new Error('빈 어두운 칸으로만 움직일 수 있습니다.');
    }

    const hounds = game.hounds.map(clonePoint);
    hounds[houndIndex] = clonePoint(to);
    const moved = cloneGame(game, {
      hounds,
      turn: FOX,
      lastMove: { piece: HOUNDS, houndIndex, from: clonePoint(from), to: clonePoint(to) },
    });
    return withHoundResult(moved);
  }

  function scoreHoundMove(game, move) {
    const simulated = moveHound(game, move.houndIndex, move.to);
    if (simulated.status === '패배') {
      return -100;
    }

    const foxMoves = getFoxMoves(simulated);
    const upwardEscapes = foxMoves.filter((point) => point.row < simulated.fox.row).length;
    const distanceToFox = Math.abs(move.to.row - game.fox.row) + Math.abs(move.to.col - game.fox.col);
    return foxMoves.length * 10 + upwardEscapes * 4 + distanceToFox;
  }

  function playComputerTurn(game) {
    if (game.turn !== HOUNDS || game.status !== '진행 중') {
      return cloneGame(game);
    }

    const moves = getAllHoundMoves(game);
    if (moves.length === 0) {
      return cloneGame(game, {
        turn: FOX,
        message: '사냥개가 움직일 수 없습니다. 계속 여우 차례입니다.',
      });
    }

    const [best] = moves
      .map((move) => ({ move, score: scoreHoundMove(game, move) }))
      .sort((a, b) => a.score - b.score || a.move.houndIndex - b.move.houndIndex);

    return moveHound(game, best.move.houndIndex, best.move.to);
  }

  return {
    FOX,
    HOUNDS,
    BOARD_SIZE,
    createGame,
    getFoxMoves,
    getHoundMoves,
    getAllHoundMoves,
    moveFox,
    moveHound,
    playComputerTurn,
  };
}));
