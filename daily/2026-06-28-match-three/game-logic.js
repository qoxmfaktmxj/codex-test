(function defineMatchThree(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.MatchThree = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const GEMS = ['빨강', '노랑', '초록', '파랑', '보라'];
  const SIZE = 5;

  const STARTING_BOARD = [
    ['빨강', '노랑', '빨강', '초록', '파랑'],
    ['파랑', '빨강', '노랑', '보라', '초록'],
    ['초록', '보라', '파랑', '노랑', '빨강'],
    ['노랑', '초록', '보라', '파랑', '노랑'],
    ['보라', '파랑', '초록', '빨강', '보라'],
  ];

  function cloneBoard(board) {
    return board.map((row) => [...row]);
  }

  function cloneGame(game, overrides = {}) {
    return {
      board: cloneBoard(game.board),
      movesLeft: game.movesLeft,
      score: game.score,
      status: game.status,
      message: game.message,
      selected: game.selected ? { ...game.selected } : null,
      lastCleared: game.lastCleared.map((cell) => ({ ...cell })),
      ...overrides,
    };
  }

  function createGame(board = STARTING_BOARD, movesLeft = 12) {
    return {
      board: cloneBoard(board),
      movesLeft,
      score: 0,
      status: '진행 중',
      message: '붙어 있는 보석 두 개를 바꿔 같은 보석 3개를 맞추세요.',
      selected: null,
      lastCleared: [],
    };
  }

  function isInside(board, position) {
    return (
      position &&
      Number.isInteger(position.row) &&
      Number.isInteger(position.col) &&
      position.row >= 0 &&
      position.col >= 0 &&
      position.row < board.length &&
      position.col < board[position.row].length
    );
  }

  function validatePosition(board, position) {
    if (!isInside(board, position)) {
      throw new Error('보석 위치가 게임판 밖에 있습니다.');
    }
  }

  function areAdjacent(first, second) {
    return Math.abs(first.row - second.row) + Math.abs(first.col - second.col) === 1;
  }

  function addRun(matches, board, cells) {
    if (cells.length < 3) {
      return;
    }

    cells.forEach((cell) => {
      matches.set(`${cell.row}:${cell.col}`, {
        row: cell.row,
        col: cell.col,
        gem: board[cell.row][cell.col],
      });
    });
  }

  function findMatches(board) {
    const matches = new Map();

    board.forEach((row, rowIndex) => {
      let run = [];
      row.forEach((gem, colIndex) => {
        if (run.length === 0 || board[rowIndex][run[0].col] === gem) {
          run.push({ row: rowIndex, col: colIndex });
        } else {
          addRun(matches, board, run);
          run = [{ row: rowIndex, col: colIndex }];
        }
      });
      addRun(matches, board, run);
    });

    for (let col = 0; col < board[0].length; col += 1) {
      let run = [];
      for (let row = 0; row < board.length; row += 1) {
        const gem = board[row][col];
        if (run.length === 0 || board[run[0].row][col] === gem) {
          run.push({ row, col });
        } else {
          addRun(matches, board, run);
          run = [{ row, col }];
        }
      }
      addRun(matches, board, run);
    }

    return Array.from(matches.values())
      .sort((a, b) => a.row - b.row || a.col - b.col)
      .map(({ row, col }) => ({ row, col }));
  }

  function randomGem() {
    return GEMS[Math.floor(Math.random() * GEMS.length)];
  }

  function nextGemFrom(refillGems) {
    if (Array.isArray(refillGems) && refillGems.length > 0) {
      return refillGems.shift();
    }

    return randomGem();
  }

  function clearAndRefill(board, cells, refillGems = []) {
    const nextBoard = cloneBoard(board);

    cells.forEach(({ row, col }) => {
      nextBoard[row][col] = null;
    });

    for (let col = 0; col < nextBoard[0].length; col += 1) {
      const columnGems = [];

      for (let row = nextBoard.length - 1; row >= 0; row -= 1) {
        if (nextBoard[row][col] !== null) {
          columnGems.push(nextBoard[row][col]);
        }
      }

      for (let row = nextBoard.length - 1; row >= 0; row -= 1) {
        nextBoard[row][col] = columnGems.shift() || null;
      }

      for (let row = 0; row < nextBoard.length; row += 1) {
        if (nextBoard[row][col] === null) {
          nextBoard[row][col] = nextGemFrom(refillGems);
        }
      }
    }

    return nextBoard;
  }

  function swapOnBoard(board, first, second) {
    const nextBoard = cloneBoard(board);
    const firstGem = nextBoard[first.row][first.col];

    nextBoard[first.row][first.col] = nextBoard[second.row][second.col];
    nextBoard[second.row][second.col] = firstGem;

    return nextBoard;
  }

  function swapTiles(game, first, second, refillGems = []) {
    validatePosition(game.board, first);
    validatePosition(game.board, second);

    if (game.status === '완료') {
      return cloneGame(game, {
        message: '게임이 끝났습니다. 새 판을 시작하세요.',
        selected: null,
        lastCleared: [],
      });
    }

    if (!areAdjacent(first, second)) {
      return cloneGame(game, {
        message: '바로 붙은 보석 두 개만 바꿀 수 있습니다.',
        selected: null,
        lastCleared: [],
      });
    }

    const swappedBoard = swapOnBoard(game.board, first, second);
    const matches = findMatches(swappedBoard);

    if (matches.length === 0) {
      return cloneGame(game, {
        message: '맞는 보석이 없습니다. 다시 골라 보세요.',
        selected: null,
        lastCleared: [],
      });
    }

    const board = clearAndRefill(swappedBoard, matches, refillGems);
    const movesLeft = Math.max(0, game.movesLeft - 1);
    const score = game.score + matches.length * 10;
    const status = movesLeft === 0 ? '완료' : '진행 중';
    const message = movesLeft === 0
      ? `마지막 이동으로 보석 ${matches.length}개를 지웠습니다. 최종 점수 ${score}점!`
      : `보석 ${matches.length}개를 지웠습니다.`;

    return cloneGame(game, {
      board,
      movesLeft,
      score,
      status,
      message,
      selected: null,
      lastCleared: matches,
    });
  }

  return {
    GEMS,
    SIZE,
    createGame,
    cloneBoard,
    findMatches,
    areAdjacent,
    swapTiles,
    randomGem,
  };
}));
