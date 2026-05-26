const SIZE = 8;
const PLAYERS = { BLACK: '흑돌', WHITE: '백돌' };
const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
];

function opponentOf(player) {
  return player === PLAYERS.BLACK ? PLAYERS.WHITE : PLAYERS.BLACK;
}

function playerLabel(player) {
  return player === PLAYERS.BLACK ? '흑돌' : '백돌';
}

function createEmptyBoard() {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
}

function cloneBoard(board) {
  return board.map((row) => row.slice());
}

function createInitialBoard() {
  const board = createEmptyBoard();
  board[3][3] = PLAYERS.WHITE;
  board[3][4] = PLAYERS.BLACK;
  board[4][3] = PLAYERS.BLACK;
  board[4][4] = PLAYERS.WHITE;
  return board;
}

function isInside(row, column) {
  return row >= 0 && row < SIZE && column >= 0 && column < SIZE;
}

function getFlipsForMove(board, row, column, player) {
  if (!isInside(row, column) || board[row][column] !== null) return [];
  const opponent = opponentOf(player);
  const flips = [];

  DIRECTIONS.forEach(([rowDelta, columnDelta]) => {
    const line = [];
    let nextRow = row + rowDelta;
    let nextColumn = column + columnDelta;

    while (isInside(nextRow, nextColumn) && board[nextRow][nextColumn] === opponent) {
      line.push([nextRow, nextColumn]);
      nextRow += rowDelta;
      nextColumn += columnDelta;
    }

    if (line.length > 0 && isInside(nextRow, nextColumn) && board[nextRow][nextColumn] === player) {
      flips.push(...line);
    }
  });

  return flips;
}

function getValidMoves(board, player) {
  const moves = [];
  for (let row = 0; row < SIZE; row += 1) {
    for (let column = 0; column < SIZE; column += 1) {
      if (getFlipsForMove(board, row, column, player).length > 0) {
        moves.push([row, column]);
      }
    }
  }
  return moves;
}

function countDiscs(board) {
  return board.flat().reduce((score, cell) => {
    if (cell === PLAYERS.BLACK) score.black += 1;
    else if (cell === PLAYERS.WHITE) score.white += 1;
    else score.empty += 1;
    return score;
  }, { black: 0, white: 0, empty: 0 });
}

function winnerFromCounts(counts) {
  if (counts.black > counts.white) return PLAYERS.BLACK;
  if (counts.white > counts.black) return PLAYERS.WHITE;
  return null;
}

function buildMessage(status, winner, counts, currentPlayer) {
  if (status === 'won') {
    return `${playerLabel(winner)} 승리! ${counts.black} 대 ${counts.white}입니다.`;
  }
  if (status === 'draw') return `무승부입니다. ${counts.black} 대 ${counts.white}입니다.`;
  return `${playerLabel(currentPlayer)} 차례입니다.`;
}

function createGame(options = {}) {
  const board = options.board ? cloneBoard(options.board) : createInitialBoard();
  const currentPlayer = options.currentPlayer || PLAYERS.BLACK;
  const counts = countDiscs(board);
  const blackMoves = getValidMoves(board, PLAYERS.BLACK);
  const whiteMoves = getValidMoves(board, PLAYERS.WHITE);
  const status = blackMoves.length === 0 && whiteMoves.length === 0
    ? winnerFromCounts(counts) ? 'won' : 'draw'
    : 'playing';
  const winner = status === 'won' ? winnerFromCounts(counts) : null;
  return {
    board,
    currentPlayer,
    status,
    winner,
    message: options.message || buildMessage(status, winner, counts, currentPlayer),
  };
}

function placeDisc(game, row, column) {
  if (game.status !== 'playing') throw new Error('이미 끝난 게임입니다.');
  if (!isInside(row, column)) throw new Error('게임판 밖에는 둘 수 없습니다.');
  if (game.board[row][column] !== null) throw new Error('이미 돌이 있는 칸입니다.');

  const flips = getFlipsForMove(game.board, row, column, game.currentPlayer);
  if (flips.length === 0) throw new Error('놓을 수 없는 칸입니다.');

  const board = cloneBoard(game.board);
  board[row][column] = game.currentPlayer;
  flips.forEach(([flipRow, flipColumn]) => {
    board[flipRow][flipColumn] = game.currentPlayer;
  });

  const otherPlayer = opponentOf(game.currentPlayer);
  const otherMoves = getValidMoves(board, otherPlayer);
  const sameMoves = getValidMoves(board, game.currentPlayer);
  const counts = countDiscs(board);

  if (otherMoves.length === 0 && sameMoves.length === 0) {
    const winner = winnerFromCounts(counts);
    const status = winner ? 'won' : 'draw';
    return {
      board,
      currentPlayer: game.currentPlayer,
      status,
      winner,
      message: buildMessage(status, winner, counts, game.currentPlayer),
    };
  }

  if (otherMoves.length === 0) {
    return {
      board,
      currentPlayer: game.currentPlayer,
      status: 'playing',
      winner: null,
      message: `${playerLabel(otherPlayer)}이 둘 곳이 없어 ${playerLabel(game.currentPlayer)}이 한 번 더 둡니다.`,
    };
  }

  return {
    board,
    currentPlayer: otherPlayer,
    status: 'playing',
    winner: null,
    message: `${playerLabel(otherPlayer)} 차례입니다.`,
  };
}

function statusText(game) {
  return game.message;
}

const api = {
  SIZE,
  PLAYERS,
  DIRECTIONS,
  opponentOf,
  createEmptyBoard,
  createInitialBoard,
  createGame,
  getFlipsForMove,
  getValidMoves,
  placeDisc,
  countDiscs,
  statusText,
};

if (typeof module !== 'undefined' && module.exports) module.exports = api;
if (typeof window !== 'undefined') window.OthelloLogic = api;
