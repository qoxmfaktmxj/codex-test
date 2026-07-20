(function defineMagicSquare(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.MagicSquare = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const SIZE = 3;
  const TARGET_SUM = 15;
  const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  function createEmptyBoard() {
    return Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => null));
  }

  function cloneBoard(board) {
    return board.map((row) => row.slice());
  }

  function createGame(options = {}) {
    const board = options.board ? cloneBoard(options.board) : createEmptyBoard();
    validateBoard(board);
    const used = usedNumbers(board);
    const availableNumbers = NUMBERS.filter((number) => !used.includes(number));
    const selectedNumber = availableNumbers.includes(options.selectedNumber) ? options.selectedNumber : null;
    const lineSums = calculateLineSums(board);
    const completedLines = calculateCompletedLines(board, lineSums);
    const score = countCompletedLines(completedLines);
    const full = availableNumbers.length === 0;
    const status = full ? (score === 8 ? '성공' : '실패') : '진행 중';

    return {
      size: SIZE,
      targetSum: TARGET_SUM,
      board,
      availableNumbers,
      selectedNumber,
      lineSums,
      completedLines,
      score,
      status,
      message: buildMessage(status, selectedNumber, score),
    };
  }

  function validateBoard(board) {
    if (!Array.isArray(board) || board.length !== SIZE || board.some((row) => !Array.isArray(row) || row.length !== SIZE)) {
      throw new Error('말판 정보가 올바르지 않습니다.');
    }

    const seen = new Set();
    board.flat().forEach((value) => {
      if (value === null) {
        return;
      }
      if (!NUMBERS.includes(value)) {
        throw new Error('말판 숫자는 1부터 9까지여야 합니다.');
      }
      if (seen.has(value)) {
        throw new Error('같은 숫자는 한 번만 놓을 수 있습니다.');
      }
      seen.add(value);
    });
  }

  function usedNumbers(board) {
    return board.flat().filter((value) => value !== null);
  }

  function buildMessage(status, selectedNumber, score) {
    if (status === '성공') {
      return '마방진 완성! 모든 줄의 합이 15입니다.';
    }
    if (status === '실패') {
      return `${score}줄만 15가 되었습니다. 새 판으로 다시 도전하세요.`;
    }
    if (selectedNumber) {
      return `${selectedNumber}을 놓을 칸을 고르세요.`;
    }
    return '숫자를 고르세요. 각 가로, 세로, 대각선의 합을 15로 만드세요.';
  }

  function assertInBounds(row, col) {
    if (!Number.isInteger(row) || !Number.isInteger(col) || row < 0 || row >= SIZE || col < 0 || col >= SIZE) {
      throw new Error('칸 범위를 벗어났습니다.');
    }
  }

  function selectNumber(game, number) {
    if (game.status !== '진행 중') {
      throw new Error('이미 끝난 판입니다.');
    }
    if (!game.availableNumbers.includes(number)) {
      throw new Error('사용할 수 없는 숫자입니다.');
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
    if (game.board[row][col] !== null) {
      throw new Error('이미 숫자가 놓인 칸입니다.');
    }

    const board = cloneBoard(game.board);
    board[row][col] = game.selectedNumber;
    const next = createGame({ board });
    return {
      ...next,
      message: next.status === '진행 중'
        ? `${game.selectedNumber}을 놓았습니다. 다음 숫자를 고르세요.`
        : next.message,
    };
  }

  function calculateLineSums(board) {
    const rows = board.map(sumLine);
    const columns = Array.from({ length: SIZE }, (_, col) => sumLine(board.map((row) => row[col])));
    const diagonals = [
      sumLine([board[0][0], board[1][1], board[2][2]]),
      sumLine([board[0][2], board[1][1], board[2][0]]),
    ];
    return { rows, columns, diagonals };
  }

  function sumLine(line) {
    return line.reduce((total, value) => total + (value || 0), 0);
  }

  function calculateCompletedLines(board, lineSums) {
    return {
      rows: lineSums.rows.map((sum, row) => sum === TARGET_SUM && board[row].every((value) => value !== null)),
      columns: lineSums.columns.map((sum, col) => (
        sum === TARGET_SUM && board.every((row) => row[col] !== null)
      )),
      diagonals: [
        lineSums.diagonals[0] === TARGET_SUM && [board[0][0], board[1][1], board[2][2]].every((value) => value !== null),
        lineSums.diagonals[1] === TARGET_SUM && [board[0][2], board[1][1], board[2][0]].every((value) => value !== null),
      ],
    };
  }

  function countCompletedLines(completedLines) {
    return completedLines.rows.concat(completedLines.columns, completedLines.diagonals)
      .filter(Boolean).length;
  }

  return {
    SIZE,
    TARGET_SUM,
    NUMBERS,
    createGame,
    selectNumber,
    placeNumber,
    calculateLineSums,
    calculateCompletedLines,
  };
}));
