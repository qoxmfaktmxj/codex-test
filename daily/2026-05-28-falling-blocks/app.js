(function () {
const LogicFallback = (() => {
  const WIDTH = 10;
  const HEIGHT = 20;
  const createEmptyBoard = () => Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(null));
  return {
    WIDTH,
    HEIGHT,
    createGame: () => ({ board: createEmptyBoard(), currentPiece: null, score: 0, lines: 0, level: 1, status: 'ended', message: '게임을 불러오지 못했습니다.' }),
    movePiece: (game) => game,
    rotatePiece: (game) => game,
    tick: (game) => game,
    hardDrop: (game) => game,
    boardWithPiece: (game) => game.board,
  };
})();

const {
  WIDTH,
  HEIGHT,
  createGame,
  movePiece,
  rotatePiece,
  tick,
  hardDrop,
  boardWithPiece,
  BLOCK_LABELS,
} = window.FallingBlocksLogic || LogicFallback;

const blockClasses = {
  I: 'block-i',
  O: 'block-o',
  T: 'block-t',
  S: 'block-s',
  Z: 'block-z',
  J: 'block-j',
  L: 'block-l',
  '회색': 'block-locked',
};

const boardElement = document.querySelector('#board');
const scoreElement = document.querySelector('#score');
const linesElement = document.querySelector('#lines');
const levelElement = document.querySelector('#level');
const messageElement = document.querySelector('#message');
const leftButton = document.querySelector('#left-button');
const rightButton = document.querySelector('#right-button');
const rotateButton = document.querySelector('#rotate-button');
const downButton = document.querySelector('#down-button');
const dropButton = document.querySelector('#drop-button');
const resetButton = document.querySelector('#reset-button');

let game = createGame();
let timerId = null;

function blockLabel(value) {
  if (!value) return '빈칸';
  return (BLOCK_LABELS && BLOCK_LABELS[value]) || '잠긴 블록';
}

function render() {
  const board = boardWithPiece(game);
  boardElement.innerHTML = '';
  boardElement.style.gridTemplateColumns = `repeat(${WIDTH}, 1fr)`;

  for (let row = 0; row < HEIGHT; row += 1) {
    for (let column = 0; column < WIDTH; column += 1) {
      const value = board[row][column];
      const cell = document.createElement('span');
      cell.className = `cell ${value ? blockClasses[value] || 'block-locked' : ''}`;
      cell.setAttribute('aria-label', `${row + 1}행 ${column + 1}열 ${blockLabel(value)}`);
      boardElement.appendChild(cell);
    }
  }

  scoreElement.textContent = game.score;
  linesElement.textContent = game.lines;
  levelElement.textContent = game.level;
  messageElement.textContent = game.message;
}

function step(nextGame) {
  game = nextGame;
  render();
  if (game.status === 'ended' && timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

function restartTimer() {
  if (timerId) clearInterval(timerId);
  timerId = setInterval(() => step(tick(game)), Math.max(180, 720 - game.level * 45));
}

leftButton.addEventListener('click', () => step(movePiece(game, -1)));
rightButton.addEventListener('click', () => step(movePiece(game, 1)));
rotateButton.addEventListener('click', () => step(rotatePiece(game)));
downButton.addEventListener('click', () => step(tick(game)));
dropButton.addEventListener('click', () => step(hardDrop(game)));
resetButton.addEventListener('click', () => {
  game = createGame();
  render();
  restartTimer();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') step(movePiece(game, -1));
  if (event.key === 'ArrowRight') step(movePiece(game, 1));
  if (event.key === 'ArrowUp') step(rotatePiece(game));
  if (event.key === 'ArrowDown') step(tick(game));
  if (event.code === 'Space') {
    event.preventDefault();
    step(hardDrop(game));
  }
});

render();
restartTimer();
})();
