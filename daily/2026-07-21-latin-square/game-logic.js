(function defineLatinSquare(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.LatinSquare = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const SIZE = 4;
  const SYMBOLS = [1, 2, 3, 4];
  const START_BOARD = [
    [1, null, null, 4],
    [null, 4, null, null],
    [null, null, 4, null],
    [4, null, null, 1],
  ];
  const FIXED_CELLS = [
    [0, 0], [0, 3],
    [1, 1],
    [2, 2],
    [3, 0], [3, 3],
  ];

  function createGame(options = {}) {
    const board = options.board ? cloneBoard(options.board) : cloneBoard(START_BOARD);
    validateBoard(board);
    const selectedNumber = SYMBOLS.includes(options.selectedNumber) ? options.selectedNumber : null;
    const conflicts = findConflicts(board);
    const filledCount = countFilled(board);
    const full = filledCount === SIZE * SIZE;
    const status = full ? (conflicts.length === 0 ? '성공' : '실패') : '진행 중';

    return {
      size: SIZE,
      symbols: SYMBOLS.slice(),
      board,
      fixedCells: FIXED_CELLS.map((cell) => cell.slice()),
      selectedNumber,
      filledCount,
      conflicts,
      status,
      message: buildMessage(status, selectedNumber, conflicts, filledCount),
    };
  }

  function cloneBoard(board) {
    return board.map((row) => row.slice());
  }

  function validateBoard(board) {
    if (!Array.isArray(board) || board.length !== SIZE || board.some((row) => !Array.isArray(row) || row.length !== SIZE)) {
      throw new Error('말판 정보가 올바르지 않습니다.');
    }

    board.flat().forEach((value) => {
      if (value !== null && !SYMBOLS.includes(value)) {
        throw new Error('말판에는 1부터 4까지 숫자만 놓을 수 있습니다.');
      }
    });
  }

  function buildMessage(status, selectedNumber, conflicts, filledCount) {
    if (status === '성공') {
      return '라틴 사각형 완성! 모든 행과 열에 1부터 4까지 한 번씩 들어갔습니다.';
    }
    if (status === '실패') {
      return '가득 찼지만 중복이 있습니다. 말판을 다시 확인하세요.';
    }
    if (conflicts.length > 0) {
      return '같은 행이나 열에 중복 숫자가 있습니다.';
    }
    if (selectedNumber) {
      return `${selectedNumber}을 놓을 빈칸을 고르세요.`;
    }
    return `숫자를 고르세요. ${filledCount}/16칸이 채워졌습니다.`;
  }

  function assertInBounds(row, col) {
    if (!Number.isInteger(row) || !Number.isInteger(col) || row < 0 || row >= SIZE || col < 0 || col >= SIZE) {
      throw new Error('칸 범위를 벗어났습니다.');
    }
  }

  function cellKey(row, col) {
    return `${row},${col}`;
  }

  function fixedCellSet() {
    return new Set(FIXED_CELLS.map(([row, col]) => cellKey(row, col)));
  }

  function isFixedCell(row, col) {
    return fixedCellSet().has(cellKey(row, col));
  }

  function selectNumber(game, number) {
    if (game.status !== '진행 중') {
      throw new Error('이미 끝난 판입니다.');
    }
    if (!SYMBOLS.includes(number)) {
      throw new Error('없는 숫자입니다.');
    }

    return createGame({
      board: game.board,
      selectedNumber: number,
    });
  }

  function placeNumber(game, row, col) {
    if (game.status !== '진행 중') {
      throw new Error('이미 끝난 판입니다.');
    }
    if (!game.selectedNumber) {
      throw new Error('먼저 숫자를 고르세요.');
    }
    assertInBounds(row, col);
    if (isFixedCell(row, col)) {
      throw new Error('고정된 칸은 바꿀 수 없습니다.');
    }

    const board = cloneBoard(game.board);
    board[row][col] = game.selectedNumber;
    const next = createGame({
      board,
      selectedNumber: game.selectedNumber,
    });

    return {
      ...next,
      message: next.status === '진행 중' && next.conflicts.length === 0
        ? `${game.selectedNumber}을 놓았습니다.`
        : next.message,
    };
  }

  function clearCell(game, row, col) {
    if (game.status === '성공') {
      throw new Error('이미 완성한 판입니다.');
    }
    assertInBounds(row, col);
    if (isFixedCell(row, col)) {
      throw new Error('고정된 칸은 지울 수 없습니다.');
    }

    const board = cloneBoard(game.board);
    board[row][col] = null;
    return createGame({
      board,
      selectedNumber: game.selectedNumber,
    });
  }

  function countFilled(board) {
    return board.flat().filter((value) => value !== null).length;
  }

  function findConflicts(board) {
    return [
      ...findUnitConflicts(board, 'row'),
      ...findUnitConflicts(transpose(board), 'column'),
    ];
  }

  function findUnitConflicts(units, type) {
    const conflicts = [];
    units.forEach((unit, index) => {
      SYMBOLS.forEach((number) => {
        const count = unit.filter((value) => value === number).length;
        if (count > 1) {
          conflicts.push({ type, index, number });
        }
      });
    });
    return conflicts;
  }

  function transpose(board) {
    return Array.from({ length: SIZE }, (_, col) => board.map((row) => row[col]));
  }

  function cellHasConflict(game, row, col) {
    const value = game.board[row][col];
    if (value === null) {
      return false;
    }
    return game.conflicts.some((conflict) => (
      conflict.number === value
      && ((conflict.type === 'row' && conflict.index === row) || (conflict.type === 'column' && conflict.index === col))
    ));
  }

  return {
    SIZE,
    SYMBOLS,
    START_BOARD,
    createGame,
    selectNumber,
    placeNumber,
    clearCell,
    findConflicts,
    cellHasConflict,
  };
}));
