const CELL = {
  BLOCKED: 'blocked',
  EMPTY: 'empty',
  PEG: 'peg',
};

const STATUS = {
  PLAYING: 'playing',
  WON: 'won',
  LOST: 'lost',
};

const DIRECTIONS = [
  { row: -1, col: 0 },
  { row: 1, col: 0 },
  { row: 0, col: -1 },
  { row: 0, col: 1 },
];

function createBoard() {
  return Array.from({ length: 7 }, (_, row) => (
    Array.from({ length: 7 }, (_, col) => {
      const corner = (row < 2 || row > 4) && (col < 2 || col > 4);
      if (corner) return CELL.BLOCKED;
      return row === 3 && col === 3 ? CELL.EMPTY : CELL.PEG;
    })
  ));
}

function cloneBoard(board) {
  return board.map((row) => row.slice());
}

function createGame() {
  return {
    board: createBoard(),
    selected: null,
    pegsLeft: 32,
    moves: 0,
    status: STATUS.PLAYING,
    message: '말을 하나 건너 빈칸으로 뛰어넘으세요.',
  };
}

function isInside(row, col) {
  return row >= 0 && row < 7 && col >= 0 && col < 7;
}

function cellAt(board, hole) {
  if (!hole || !isInside(hole.row, hole.col)) return CELL.BLOCKED;
  return board[hole.row][hole.col];
}

function isValidMove(game, from, to) {
  if (game.status !== STATUS.PLAYING) return false;
  if (cellAt(game.board, from) !== CELL.PEG || cellAt(game.board, to) !== CELL.EMPTY) return false;

  const rowDistance = to.row - from.row;
  const colDistance = to.col - from.col;
  const straightJump = (Math.abs(rowDistance) === 2 && colDistance === 0)
    || (Math.abs(colDistance) === 2 && rowDistance === 0);
  if (!straightJump) return false;

  const middle = {
    row: from.row + rowDistance / 2,
    col: from.col + colDistance / 2,
  };
  return cellAt(game.board, middle) === CELL.PEG;
}

function getValidMoves(game) {
  const moves = [];

  for (let row = 0; row < 7; row += 1) {
    for (let col = 0; col < 7; col += 1) {
      if (game.board[row][col] !== CELL.PEG) continue;

      DIRECTIONS.forEach((direction) => {
        const from = { row, col };
        const to = {
          row: row + direction.row * 2,
          col: col + direction.col * 2,
        };
        if (isValidMove(game, from, to)) {
          moves.push({
            from,
            over: { row: row + direction.row, col: col + direction.col },
            to,
          });
        }
      });
    }
  }

  return moves;
}

function finishIfStuck(game) {
  if (getValidMoves(game).length > 0) return game;

  if (game.pegsLeft === 1) {
    return {
      ...game,
      status: STATUS.WON,
      selected: null,
      message: '성공입니다! 마지막 말 하나만 남겼습니다.',
    };
  }

  return {
    ...game,
    status: STATUS.LOST,
    selected: null,
    message: '더 움직일 수 없습니다. 새 판에서 다시 도전하세요.',
  };
}

function makeMove(game, from, to) {
  if (!isValidMove(game, from, to)) {
    return finishIfStuck({
      ...game,
      board: cloneBoard(game.board),
      selected: null,
      message: '말 하나를 정확히 건너 빈칸으로 이동해야 합니다.',
    });
  }

  const board = cloneBoard(game.board);
  const over = {
    row: from.row + (to.row - from.row) / 2,
    col: from.col + (to.col - from.col) / 2,
  };

  board[from.row][from.col] = CELL.EMPTY;
  board[over.row][over.col] = CELL.EMPTY;
  board[to.row][to.col] = CELL.PEG;

  return finishIfStuck({
    ...game,
    board,
    selected: null,
    pegsLeft: game.pegsLeft - 1,
    moves: game.moves + 1,
    message: '좋은 이동입니다. 다음 점프를 이어 가세요.',
  });
}

function selectHole(game, hole) {
  if (game.status !== STATUS.PLAYING) return { ...game };
  if (game.selected && game.selected.row === hole.row && game.selected.col === hole.col) {
    return { ...game, selected: null, message: '선택을 취소했습니다.' };
  }

  if (!game.selected) {
    if (cellAt(game.board, hole) !== CELL.PEG) {
      return { ...game, selected: null, message: '움직일 말을 먼저 고르세요.' };
    }
    return { ...game, selected: hole, message: '이동할 빈칸을 고르세요.' };
  }

  if (cellAt(game.board, hole) === CELL.PEG) {
    return { ...game, selected: hole, message: '다른 말을 선택했습니다.' };
  }

  return makeMove(game, game.selected, hole);
}

function boardSummary(game) {
  return `남은 말 ${game.pegsLeft}개 · 이동 ${game.moves}회`;
}

function resultText(game) {
  if (game.status === STATUS.WON) return `성공 · 마지막 말 ${game.pegsLeft}개`;
  if (game.status === STATUS.LOST) return '종료 · 더 움직일 수 없습니다';
  return `진행 중 · 가능한 이동 ${getValidMoves(game).length}개`;
}

const api = {
  CELL,
  STATUS,
  createGame,
  getValidMoves,
  isValidMove,
  makeMove,
  selectHole,
  boardSummary,
  resultText,
};

if (typeof module !== 'undefined' && module.exports) module.exports = api;
if (typeof window !== 'undefined') window.PegSolitaireLogic = api;
