const WIDTH = 10;
const HEIGHT = 20;
const DEFAULT_SEQUENCE = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
const SCORE_BY_LINES = { 0: 0, 1: 100, 2: 300, 3: 500, 4: 800 };
const BLOCK_LABELS = {
  I: '긴 막대',
  O: '네모',
  T: '받침',
  S: '오른 계단',
  Z: '왼 계단',
  J: '왼 갈고리',
  L: '오른 갈고리',
};

const SHAPES = {
  I: [
    [[1, 0], [1, 1], [1, 2], [1, 3]],
    [[0, 2], [1, 2], [2, 2], [3, 2]],
    [[2, 0], [2, 1], [2, 2], [2, 3]],
    [[0, 1], [1, 1], [2, 1], [3, 1]],
  ],
  O: [
    [[0, 0], [0, 1], [1, 0], [1, 1]],
  ],
  T: [
    [[0, 1], [1, 0], [1, 1], [1, 2]],
    [[0, 1], [1, 1], [1, 2], [2, 1]],
    [[1, 0], [1, 1], [1, 2], [2, 1]],
    [[0, 1], [1, 0], [1, 1], [2, 1]],
  ],
  S: [
    [[0, 1], [0, 2], [1, 0], [1, 1]],
    [[0, 1], [1, 1], [1, 2], [2, 2]],
  ],
  Z: [
    [[0, 0], [0, 1], [1, 1], [1, 2]],
    [[0, 2], [1, 1], [1, 2], [2, 1]],
  ],
  J: [
    [[0, 0], [1, 0], [1, 1], [1, 2]],
    [[0, 1], [0, 2], [1, 1], [2, 1]],
    [[1, 0], [1, 1], [1, 2], [2, 2]],
    [[0, 1], [1, 1], [2, 0], [2, 1]],
  ],
  L: [
    [[0, 2], [1, 0], [1, 1], [1, 2]],
    [[0, 1], [1, 1], [2, 1], [2, 2]],
    [[1, 0], [1, 1], [1, 2], [2, 0]],
    [[0, 0], [0, 1], [1, 1], [2, 1]],
  ],
};

function createEmptyBoard() {
  return Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(null));
}

function cloneBoard(board) {
  return board.map((row) => row.slice());
}

function normalizeSequence(sequence) {
  if (!Array.isArray(sequence) || sequence.length === 0) return DEFAULT_SEQUENCE;
  const usable = sequence.filter((type) => SHAPES[type]);
  return usable.length > 0 ? usable : DEFAULT_SEQUENCE;
}

function cellsFor(piece) {
  return SHAPES[piece.type][piece.rotation % SHAPES[piece.type].length];
}

function spawnColumnFor(type) {
  return type === 'I' ? 3 : 4;
}

function buildPiece(type) {
  return {
    type,
    label: BLOCK_LABELS[type],
    row: 0,
    column: spawnColumnFor(type),
    rotation: 0,
    cells: SHAPES[type][0],
  };
}

function nextType(sequence, pieceIndex) {
  return sequence[pieceIndex % sequence.length];
}

function withCells(piece) {
  return { ...piece, cells: cellsFor(piece) };
}

function isInside(row, column) {
  return row >= 0 && row < HEIGHT && column >= 0 && column < WIDTH;
}

function isValidPosition(board, piece) {
  return cellsFor(piece).every(([cellRow, cellColumn]) => {
    const row = piece.row + cellRow;
    const column = piece.column + cellColumn;
    return isInside(row, column) && board[row][column] === null;
  });
}

function lineMessage(clearedLines, score) {
  if (clearedLines === 0) return '블록을 내려 줄을 지우세요.';
  const label = ['영', '한', '두', '세', '네'][clearedLines];
  return `${label} 줄 제거! 점수 ${score}점`;
}

function createGame(options = {}) {
  const sequence = normalizeSequence(options.sequence);
  const pieceIndex = options.pieceIndex || 0;
  const board = options.board ? cloneBoard(options.board) : createEmptyBoard();
  const currentPiece = options.currentPiece ? withCells({ ...options.currentPiece }) : buildPiece(nextType(sequence, pieceIndex));
  const baseGame = {
    board,
    sequence,
    pieceIndex,
    currentPiece,
    score: options.score || 0,
    lines: options.lines || 0,
    level: options.level || 1,
    status: 'playing',
    message: options.message || '블록을 내려 줄을 지우세요.',
  };

  if (!isValidPosition(board, currentPiece)) {
    return {
      ...baseGame,
      status: 'ended',
      message: '게임 종료! 다시 시작해 보세요.',
    };
  }

  return baseGame;
}

function movePiece(game, columnDelta) {
  if (game.status !== 'playing') return game;
  const currentPiece = withCells({ ...game.currentPiece, column: game.currentPiece.column + columnDelta });
  if (!isValidPosition(game.board, currentPiece)) return game;
  return { ...game, currentPiece };
}

function moveDown(game) {
  const currentPiece = withCells({ ...game.currentPiece, row: game.currentPiece.row + 1 });
  if (!isValidPosition(game.board, currentPiece)) return null;
  return { ...game, currentPiece };
}

function rotatePiece(game) {
  if (game.status !== 'playing') return game;
  const rotationCount = SHAPES[game.currentPiece.type].length;
  const rotated = withCells({ ...game.currentPiece, rotation: (game.currentPiece.rotation + 1) % rotationCount });
  const candidates = [rotated, { ...rotated, column: rotated.column - 1 }, { ...rotated, column: rotated.column + 1 }].map(withCells);
  const valid = candidates.find((piece) => isValidPosition(game.board, piece));
  if (!valid) return game;
  return { ...game, currentPiece: valid };
}

function mergePiece(board, piece) {
  const nextBoard = cloneBoard(board);
  cellsFor(piece).forEach(([cellRow, cellColumn]) => {
    nextBoard[piece.row + cellRow][piece.column + cellColumn] = piece.type;
  });
  return nextBoard;
}

function clearLines(board) {
  const remaining = board.filter((row) => row.some((cell) => cell === null));
  const clearedLines = HEIGHT - remaining.length;
  const emptyRows = Array.from({ length: clearedLines }, () => Array(WIDTH).fill(null));
  return { board: emptyRows.concat(remaining), clearedLines };
}

function lockAndSpawn(game) {
  const merged = mergePiece(game.board, game.currentPiece);
  const cleared = clearLines(merged);
  const gained = SCORE_BY_LINES[cleared.clearedLines] || 0;
  const score = game.score + gained;
  const lines = game.lines + cleared.clearedLines;
  const level = Math.floor(lines / 10) + 1;
  const pieceIndex = game.pieceIndex + 1;
  const currentPiece = buildPiece(nextType(game.sequence, pieceIndex));
  const nextGame = {
    ...game,
    board: cleared.board,
    pieceIndex,
    currentPiece,
    score,
    lines,
    level,
    message: lineMessage(cleared.clearedLines, score),
  };

  if (!isValidPosition(nextGame.board, currentPiece)) {
    return { ...nextGame, status: 'ended', message: '게임 종료! 다시 시작해 보세요.' };
  }
  return nextGame;
}

function tick(game) {
  if (game.status !== 'playing') return game;
  const moved = moveDown(game);
  return moved || lockAndSpawn(game);
}

function hardDrop(game) {
  if (game.status !== 'playing') return game;
  let dropped = game;
  let next = moveDown(dropped);
  while (next) {
    dropped = next;
    next = moveDown(dropped);
  }
  return lockAndSpawn(dropped);
}

function boardWithPiece(game) {
  const board = cloneBoard(game.board);
  if (game.status === 'playing') {
    cellsFor(game.currentPiece).forEach(([cellRow, cellColumn]) => {
      const row = game.currentPiece.row + cellRow;
      const column = game.currentPiece.column + cellColumn;
      if (isInside(row, column)) board[row][column] = game.currentPiece.type;
    });
  }
  return board;
}

const api = {
  WIDTH,
  HEIGHT,
  DEFAULT_SEQUENCE,
  SCORE_BY_LINES,
  BLOCK_LABELS,
  SHAPES,
  createEmptyBoard,
  createGame,
  isValidPosition,
  movePiece,
  rotatePiece,
  tick,
  hardDrop,
  boardWithPiece,
};

if (typeof module !== 'undefined' && module.exports) module.exports = api;
if (typeof window !== 'undefined') window.FallingBlocksLogic = api;
