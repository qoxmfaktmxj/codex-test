const PLAYER_X = 'X';
const PLAYER_O = 'O';

const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function createGame() {
  return {
    board: Array(9).fill(null),
    currentPlayer: PLAYER_X,
    status: 'playing',
    winner: null,
  };
}

function getWinner(board) {
  for (const [a, b, c] of WINNING_LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return null;
}

function isBoardFull(board) {
  return board.every(Boolean);
}

function applyMove(game, index) {
  if (!Number.isInteger(index) || index < 0 || index > 8 || game.status !== 'playing' || game.board[index]) {
    return game;
  }

  const board = game.board.slice();
  board[index] = game.currentPlayer;

  const winner = getWinner(board);
  if (winner) {
    return {
      board,
      currentPlayer: game.currentPlayer,
      status: 'won',
      winner,
    };
  }

  if (isBoardFull(board)) {
    return {
      board,
      currentPlayer: game.currentPlayer,
      status: 'draw',
      winner: null,
    };
  }

  return {
    board,
    currentPlayer: game.currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X,
    status: 'playing',
    winner: null,
  };
}

const gameLogic = {
  createGame,
  applyMove,
  getWinner,
  isBoardFull,
};

if (typeof module !== 'undefined') {
  module.exports = gameLogic;
}

if (typeof window !== 'undefined') {
  window.gameLogic = gameLogic;
}
