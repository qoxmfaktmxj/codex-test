const SIZE = 4;
const BOX_SIZE = 2;
const EMPTY = 0;

const PUZZLE = [
  [EMPTY, 2, EMPTY, EMPTY],
  [1, EMPTY, 4, 2],
  [3, EMPTY, EMPTY, EMPTY],
  [EMPTY, EMPTY, 3, EMPTY],
];

const SOLUTION = [
  [4, 2, 1, 3],
  [1, 3, 4, 2],
  [3, 4, 2, 1],
  [2, 1, 3, 4],
];

function cloneGrid(grid) {
  return grid.map((row) => row.slice());
}

function normalizePosition(position) {
  const row = Math.floor(Number(position && position.row));
  const col = Math.floor(Number(position && position.col));
  return isInside(row, col) ? { row, col } : { row: 0, col: 0 };
}

function isInside(row, col) {
  return row >= 0 && row < SIZE && col >= 0 && col < SIZE;
}

function createFixedMap(board = PUZZLE) {
  return board.map((row) => row.map((value) => value !== EMPTY));
}

function normalizeBoard(board) {
  if (!Array.isArray(board) || board.length !== SIZE) {
    return cloneGrid(PUZZLE);
  }

  return board.map((row, rowIndex) => {
    const source = Array.isArray(row) ? row : [];
    return Array.from({ length: SIZE }, (_, colIndex) => {
      const value = Math.floor(Number(source[colIndex]));
      return value >= EMPTY && value <= SIZE ? value : PUZZLE[rowIndex][colIndex];
    });
  });
}

function createGame(options = {}) {
  const board = normalizeBoard(options.board);
  const fixed = options.fixed ? cloneGrid(options.fixed).map((row) => row.map(Boolean)) : createFixedMap(PUZZLE);

  return {
    board,
    fixed,
    selected: normalizePosition(options.selected || { row: 0, col: 0 }),
    conflicts: Array.isArray(options.conflicts) ? options.conflicts.map(normalizePosition) : [],
    moves: Math.max(0, Math.floor(Number(options.moves) || 0)),
    errors: Math.max(0, Math.floor(Number(options.errors) || 0)),
    status: options.status || '진행 중',
    message: options.message || '빈칸을 고르고 1부터 4까지 숫자를 넣으세요.',
  };
}

function selectCell(game, row, col) {
  if (!game || !isInside(row, col)) {
    return game;
  }
  return {
    ...game,
    selected: { row, col },
    message: game.fixed[row][col] ? '처음부터 놓인 숫자입니다.' : '선택한 칸에 숫자를 넣으세요.',
  };
}

function isMoveValid(board, row, col, value) {
  if (!isInside(row, col) || value < 1 || value > SIZE) {
    return false;
  }

  for (let index = 0; index < SIZE; index += 1) {
    if (index !== col && board[row][index] === value) {
      return false;
    }
    if (index !== row && board[index][col] === value) {
      return false;
    }
  }

  const startRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const startCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;
  for (let r = startRow; r < startRow + BOX_SIZE; r += 1) {
    for (let c = startCol; c < startCol + BOX_SIZE; c += 1) {
      if ((r !== row || c !== col) && board[r][c] === value) {
        return false;
      }
    }
  }

  return true;
}

function isComplete(board) {
  const expected = [1, 2, 3, 4].join(',');
  const sortedValues = (values) => values.slice().sort((a, b) => a - b).join(',');

  for (let index = 0; index < SIZE; index += 1) {
    const row = board[index];
    const column = board.map((line) => line[index]);
    if (sortedValues(row) !== expected || sortedValues(column) !== expected) {
      return false;
    }
  }

  for (let row = 0; row < SIZE; row += BOX_SIZE) {
    for (let col = 0; col < SIZE; col += BOX_SIZE) {
      const box = [];
      for (let r = row; r < row + BOX_SIZE; r += 1) {
        for (let c = col; c < col + BOX_SIZE; c += 1) {
          box.push(board[r][c]);
        }
      }
      if (sortedValues(box) !== expected) {
        return false;
      }
    }
  }

  return true;
}

function setCellValue(game, rawValue) {
  if (!game || game.status !== '진행 중') {
    return game;
  }

  const { row, col } = game.selected;
  const value = Math.floor(Number(rawValue));

  if (game.fixed[row][col]) {
    return {
      ...game,
      message: '처음부터 놓인 숫자는 바꿀 수 없습니다.',
    };
  }
  if (value < 1 || value > SIZE) {
    return {
      ...game,
      message: '1부터 4까지의 숫자만 넣을 수 있습니다.',
    };
  }
  if (!isMoveValid(game.board, row, col, value)) {
    return {
      ...game,
      conflicts: [{ row, col }],
      errors: game.errors + 1,
      message: '그 숫자는 행, 열, 구역 중 하나와 겹칩니다.',
    };
  }

  const board = cloneGrid(game.board);
  board[row][col] = value;
  const complete = isComplete(board);

  return {
    ...game,
    board,
    conflicts: [],
    moves: game.moves + 1,
    status: complete ? '완료' : '진행 중',
    message: complete ? '완성했습니다. 모든 숫자가 제자리에 있습니다!' : '좋습니다. 다음 빈칸을 채워 보세요.',
  };
}

function clearCell(game) {
  if (!game || game.status !== '진행 중') {
    return game;
  }

  const { row, col } = game.selected;
  if (game.fixed[row][col]) {
    return {
      ...game,
      message: '처음부터 놓인 숫자는 지울 수 없습니다.',
    };
  }

  const board = cloneGrid(game.board);
  board[row][col] = EMPTY;

  return {
    ...game,
    board,
    conflicts: [],
    moves: game.moves + 1,
    message: '칸을 비웠습니다.',
  };
}

function getCellState(game, row, col) {
  return {
    value: game.board[row][col],
    fixed: game.fixed[row][col],
    selected: game.selected.row === row && game.selected.col === col,
    conflicted: game.conflicts.some((position) => position.row === row && position.col === col),
  };
}

function resetGame() {
  return createGame();
}

const MiniSudokuLogic = {
  EMPTY,
  SIZE,
  PUZZLE,
  SOLUTION,
  createGame,
  getCellState,
  isComplete,
  isMoveValid,
  selectCell,
  setCellValue,
  clearCell,
  resetGame,
};

if (typeof window !== 'undefined') {
  window.MiniSudokuLogic = MiniSudokuLogic;
}

if (typeof module !== 'undefined') {
  module.exports = MiniSudokuLogic;
}
