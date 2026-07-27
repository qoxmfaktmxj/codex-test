const SIZE = 4;
const DIRECTIONS = ['up', 'down', 'left', 'right'];

function createEmptyBoard() {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

function cloneBoard(board) {
  return board.map((row) => row.slice());
}

function boardEquals(a, b) {
  return a.every((row, rowIndex) => row.every((cell, columnIndex) => cell === b[rowIndex][columnIndex]));
}

function slideLineLeft(line) {
  const compacted = line.filter((value) => value !== 0);
  const merged = [];
  let gained = 0;

  for (let index = 0; index < compacted.length; index += 1) {
    const current = compacted[index];
    if (compacted[index + 1] === current) {
      const value = current * 2;
      merged.push(value);
      gained += value;
      index += 1;
    } else {
      merged.push(current);
    }
  }

  while (merged.length < SIZE) merged.push(0);
  const changed = merged.some((value, index) => value !== line[index]);
  return { line: merged, gained, changed };
}

function transpose(board) {
  return Array.from({ length: SIZE }, (_, row) => Array.from({ length: SIZE }, (_, column) => board[column][row]));
}

function reverseRows(board) {
  return board.map((row) => row.slice().reverse());
}

function moveRowsLeft(board) {
  let gained = 0;
  const next = board.map((row) => {
    const result = slideLineLeft(row);
    gained += result.gained;
    return result.line;
  });
  return { board: next, gained, changed: !boardEquals(board, next) };
}

function moveBoard(board, direction) {
  if (!DIRECTIONS.includes(direction)) {
    throw new Error('알 수 없는 이동 방향입니다.');
  }

  if (direction === 'left') return moveRowsLeft(board);

  if (direction === 'right') {
    const reversed = reverseRows(board);
    const result = moveRowsLeft(reversed);
    return { board: reverseRows(result.board), gained: result.gained, changed: result.changed };
  }

  if (direction === 'up') {
    const transposed = transpose(board);
    const result = moveRowsLeft(transposed);
    return { board: transpose(result.board), gained: result.gained, changed: result.changed };
  }

  const transposed = transpose(board);
  const reversed = reverseRows(transposed);
  const result = moveRowsLeft(reversed);
  return { board: transpose(reverseRows(result.board)), gained: result.gained, changed: result.changed };
}

function emptyCells(board) {
  const cells = [];
  for (let row = 0; row < SIZE; row += 1) {
    for (let column = 0; column < SIZE; column += 1) {
      if (board[row][column] === 0) cells.push([row, column]);
    }
  }
  return cells;
}

function pickRandom(randoms) {
  if (Array.isArray(randoms) && randoms.length > 0) return randoms.shift();
  if (Array.isArray(randoms)) return 0;
  return Math.random();
}

function addRandomTile(board, randoms) {
  const cells = emptyCells(board);
  if (cells.length === 0) return board;
  const next = cloneBoard(board);
  const positionRandom = pickRandom(randoms);
  const valueRandom = pickRandom(randoms);
  const index = Math.min(cells.length - 1, Math.floor(positionRandom * cells.length));
  const [row, column] = cells[index];
  next[row][column] = valueRandom < 0.9 ? 2 : 4;
  return next;
}

function has2048(board) {
  return board.flat().some((value) => value >= 2048);
}

function hasAvailableMoves(board) {
  if (emptyCells(board).length > 0) return true;
  return DIRECTIONS.some((direction) => moveBoard(board, direction).changed);
}

function createGame(randoms) {
  let board = createEmptyBoard();
  const seed = Array.isArray(randoms) ? randoms.slice() : null;
  board = addRandomTile(board, seed);
  board = addRandomTile(board, seed);
  return { board, score: 0, best: 0, status: 'playing', message: '화살표 키나 버튼으로 숫자를 합쳐 2048을 만드세요.' };
}

function statusFor(board) {
  if (has2048(board)) return 'won';
  if (!hasAvailableMoves(board)) return 'lost';
  return 'playing';
}

function playMove(game, direction, randoms) {
  if (game.status !== 'playing') return game;
  const moved = moveBoard(game.board, direction);
  if (!moved.changed) {
    return { ...game, message: '그 방향으로는 움직일 수 없습니다.' };
  }
  const board = addRandomTile(moved.board, Array.isArray(randoms) ? randoms.slice() : null);
  const score = game.score + moved.gained;
  const best = Math.max(game.best || 0, score);
  const status = statusFor(board);
  const message = status === 'won'
    ? '2048 달성! 계속 더 높은 점수에 도전해 보세요.'
    : status === 'lost'
      ? '더 이상 움직일 곳이 없습니다. 다시 도전하세요!'
      : moved.gained > 0
        ? `${moved.gained}점을 얻었습니다.`
        : '좋아요, 계속 합쳐 보세요.';
  return { board, score, best, status, message };
}

function scoreText(game) {
  return `점수 ${game.score} · 최고 ${game.best || 0}`;
}

const api = {
  SIZE,
  DIRECTIONS,
  createEmptyBoard,
  createGame,
  slideLineLeft,
  moveBoard,
  hasAvailableMoves,
  playMove,
  scoreText,
};

if (typeof module !== 'undefined' && module.exports) module.exports = api;
if (typeof window !== 'undefined') window.Puzzle2048Logic = api;
