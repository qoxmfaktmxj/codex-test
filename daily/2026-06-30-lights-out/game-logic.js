(function defineLightsOut(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.LightsOut = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const DEFAULT_BOARD = [
    [true, false, false, false, false],
    [false, true, false, false, true],
    [false, true, false, true, true],
    [false, true, true, true, true],
    [false, true, true, false, true],
  ];

  const DEFAULT_MESSAGE = '켜진 칸을 모두 끄세요. 칸을 누르면 십자 모양으로 바뀝니다.';
  const DIRECTIONS = [
    [0, 0],
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  function createBoard(size = 5, fill = false) {
    return Array.from({ length: size }, () => Array.from({ length: size }, () => Boolean(fill)));
  }

  function cloneBoard(board) {
    return board.map((row) => row.map(Boolean));
  }

  function countLights(board) {
    return board.reduce((total, row) => total + row.filter(Boolean).length, 0);
  }

  function validateBoard(board) {
    if (!Array.isArray(board) || board.length === 0 || !board.every((row) => Array.isArray(row) && row.length === board.length)) {
      throw new Error('정사각형 말판이 필요합니다.');
    }
  }

  function createGame(options = {}) {
    const board = cloneBoard(options.board || DEFAULT_BOARD);
    validateBoard(board);

    const lightCount = countLights(board);

    return {
      board,
      size: board.length,
      moves: options.moves || 0,
      status: options.status || '진행 중',
      lightCount,
      message: options.message || DEFAULT_MESSAGE,
    };
  }

  function cloneGame(game, overrides = {}) {
    return {
      board: cloneBoard(game.board),
      size: game.size,
      moves: game.moves,
      status: game.status,
      lightCount: game.lightCount,
      message: game.message,
      ...overrides,
    };
  }

  function validatePosition(game, row, col) {
    if (!Number.isInteger(row) || !Number.isInteger(col) || row < 0 || col < 0 || row >= game.size || col >= game.size) {
      throw new Error('말판 안의 칸만 누를 수 있습니다.');
    }
  }

  function toggleAt(game, row, col) {
    validatePosition(game, row, col);

    if (game.status === '완료') {
      return cloneGame(game, {
        message: '이미 끝난 판입니다. 새 판을 시작하세요.',
      });
    }

    const board = cloneBoard(game.board);

    DIRECTIONS.forEach(([rowOffset, colOffset]) => {
      const nextRow = row + rowOffset;
      const nextCol = col + colOffset;

      if (nextRow >= 0 && nextCol >= 0 && nextRow < game.size && nextCol < game.size) {
        board[nextRow][nextCol] = !board[nextRow][nextCol];
      }
    });

    const moves = game.moves + 1;
    const lightCount = countLights(board);
    const isComplete = lightCount === 0;

    return cloneGame(game, {
      board,
      moves,
      lightCount,
      status: isComplete ? '완료' : '진행 중',
      message: isComplete ? `성공! ${moves}번 만에 모든 불을 껐습니다.` : `켜진 칸 ${lightCount}개가 남았습니다.`,
    });
  }

  return {
    createBoard,
    createGame,
    countLights,
    toggleAt,
  };
}));
