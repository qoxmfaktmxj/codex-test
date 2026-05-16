const boardElement = document.querySelector('[data-board]');
const statusElement = document.querySelector('[data-status]');
const scoreElement = document.querySelector('[data-score]');
const directionElement = document.querySelector('[data-direction]');
const stepButton = document.querySelector('[data-step]');
const resetButton = document.querySelector('[data-reset]');
const directionButtons = document.querySelectorAll('[data-direction-button]');

let game = window.gameLogic.createGame();
let timerId = null;

const cells = window.gameLogic.boardCells().map((cell) => {
  const element = document.createElement('div');
  element.className = 'cell';
  element.dataset.cell = window.gameLogic.cellKey(cell);
  element.setAttribute('aria-label', `${cell.row + 1}행 ${cell.col + 1}열`);
  boardElement.appendChild(element);
  return { cell, element };
});

function moveAndRender() {
  game = window.gameLogic.moveSnake(game);
  render();
}

function startTimer() {
  if (timerId) {
    window.clearInterval(timerId);
  }

  timerId = window.setInterval(() => {
    if (game.status !== 'playing') {
      window.clearInterval(timerId);
      timerId = null;
      return;
    }

    moveAndRender();
  }, 900);
}

function render() {
  const snakeCells = new Map(game.snake.map((cell, index) => [window.gameLogic.cellKey(cell), index]));
  const foodKey = game.food ? window.gameLogic.cellKey(game.food) : '';

  cells.forEach(({ cell, element }) => {
    const key = window.gameLogic.cellKey(cell);
    element.className = 'cell';
    element.textContent = '';

    if (snakeCells.has(key)) {
      element.classList.add(snakeCells.get(key) === 0 ? 'head' : 'snake');
      element.textContent = snakeCells.get(key) === 0 ? '머리' : '몸';
    }

    if (key === foodKey) {
      element.classList.add('food');
      element.textContent = '먹이';
    }
  });

  statusElement.textContent = game.message;
  scoreElement.textContent = String(game.score);
  directionElement.textContent = window.gameLogic.directionLabel(game.direction);
  stepButton.disabled = game.status !== 'playing';
  directionButtons.forEach((button) => {
    button.disabled = game.status !== 'playing';
  });
}

directionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    game = window.gameLogic.turnSnake(game, button.dataset.directionButton);
    render();
  });
});

stepButton.addEventListener('click', () => {
  moveAndRender();
});

resetButton.addEventListener('click', () => {
  game = window.gameLogic.createGame();
  render();
  startTimer();
});

document.addEventListener('keydown', (event) => {
  const directionByKey = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',
  };
  const direction = directionByKey[event.key];

  if (!direction) {
    return;
  }

  event.preventDefault();
  game = window.gameLogic.turnSnake(game, direction);
  render();
});

render();
startTimer();
