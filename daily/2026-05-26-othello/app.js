(function () {
const LogicFallback = (() => {
  const SIZE = 8;
  const PLAYERS = { BLACK: '흑돌', WHITE: '백돌' };
  const createEmptyBoard = () => Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
  return {
    SIZE,
    PLAYERS,
    createGame: () => ({ board: createEmptyBoard(), currentPlayer: PLAYERS.BLACK, status: 'playing', winner: null, message: '게임을 불러오는 중입니다.' }),
    getValidMoves: () => [],
    placeDisc: (game) => game,
    countDiscs: () => ({ black: 0, white: 0, empty: 64 }),
  };
})();

const {
  SIZE,
  PLAYERS,
  createGame,
  getValidMoves,
  placeDisc,
  countDiscs,
} = window.OthelloLogic || LogicFallback;

const boardElement = document.querySelector('#board');
const blackCountElement = document.querySelector('#black-count');
const whiteCountElement = document.querySelector('#white-count');
const emptyCountElement = document.querySelector('#empty-count');
const messageElement = document.querySelector('#message');
const resetButton = document.querySelector('#reset-button');

let game = createGame();

function isValidMove(row, column, validMoves) {
  return validMoves.some(([moveRow, moveColumn]) => moveRow === row && moveColumn === column);
}

function discLabel(value) {
  if (value === PLAYERS.BLACK) return '흑돌';
  if (value === PLAYERS.WHITE) return '백돌';
  return '빈칸';
}

function render() {
  const counts = countDiscs(game.board);
  const validMoves = game.status === 'playing' ? getValidMoves(game.board, game.currentPlayer) : [];

  boardElement.innerHTML = '';
  for (let row = 0; row < SIZE; row += 1) {
    for (let column = 0; column < SIZE; column += 1) {
      const value = game.board[row][column];
      const hint = isValidMove(row, column, validMoves);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `cell ${value === PLAYERS.BLACK ? 'black' : value === PLAYERS.WHITE ? 'white' : ''} ${hint ? 'hint' : ''}`;
      button.disabled = !hint;
      button.setAttribute('aria-label', `${row + 1}행 ${column + 1}열 ${hint ? '놓을 수 있는 칸' : discLabel(value)}`);
      if (value) {
        const disc = document.createElement('span');
        disc.className = 'disc';
        disc.textContent = value === PLAYERS.BLACK ? '흑' : '백';
        button.appendChild(disc);
      }
      button.addEventListener('click', () => {
        game = placeDisc(game, row, column);
        render();
      });
      boardElement.appendChild(button);
    }
  }

  blackCountElement.textContent = counts.black;
  whiteCountElement.textContent = counts.white;
  emptyCountElement.textContent = counts.empty;
  messageElement.textContent = game.message;
}

resetButton.addEventListener('click', () => {
  game = createGame();
  render();
});

render();
})();
