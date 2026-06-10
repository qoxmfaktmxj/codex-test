(function () {
const LogicFallback = (() => {
  const SIZE = 4;
  const createEmptyBoard = () => Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  return { SIZE, createEmptyBoard, createGame: () => ({ board: createEmptyBoard(), score: 0, best: 0, status: 'playing', message: '게임을 불러오는 중입니다.' }) };
})();

const { SIZE, createGame, playMove } = window.Puzzle2048Logic || LogicFallback;
const boardElement = document.querySelector('#board');
const scoreElement = document.querySelector('#score');
const bestElement = document.querySelector('#best');
const stateElement = document.querySelector('#state');
const messageElement = document.querySelector('#message');
const resetButton = document.querySelector('#reset-button');
const controlButtons = document.querySelectorAll('[data-direction]');

let game = createGame();

function tileClass(value) {
  if (!value) return 'tile empty';
  return `tile v${Math.min(value, 4096)}`;
}

function stateText(status) {
  if (status === 'won') return '2048 달성';
  if (status === 'lost') return '종료';
  return '진행 중';
}

function render() {
  boardElement.innerHTML = '';
  for (let row = 0; row < SIZE; row += 1) {
    for (let column = 0; column < SIZE; column += 1) {
      const value = game.board[row][column];
      const tile = document.createElement('div');
      tile.className = tileClass(value);
      tile.textContent = value || '0';
      tile.setAttribute('aria-label', value ? `${value} 타일` : '빈칸');
      boardElement.appendChild(tile);
    }
  }
  scoreElement.textContent = game.score;
  bestElement.textContent = game.best || 0;
  stateElement.textContent = stateText(game.status);
  messageElement.textContent = game.message;
}

function move(direction) {
  game = playMove(game, direction);
  render();
}

controlButtons.forEach((button) => {
  button.addEventListener('click', () => move(button.dataset.direction));
});

document.addEventListener('keydown', (event) => {
  const map = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
  if (!map[event.key]) return;
  event.preventDefault();
  move(map[event.key]);
});

resetButton.addEventListener('click', () => {
  game = createGame();
  render();
});

render();
})();
