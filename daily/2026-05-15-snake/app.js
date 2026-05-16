const boardElement = document.querySelector('[data-board]');
const scoreElement = document.querySelector('[data-score]');
const statusElement = document.querySelector('[data-status]');
const resetButton = document.querySelector('[data-reset]');

let game = window.gameLogic.createGame();
let timer = null;

function pickFood(snake) {
  const openCells = [];
  for (let y = 0; y < window.gameLogic.BOARD_SIZE; y += 1) {
    for (let x = 0; x < window.gameLogic.BOARD_SIZE; x += 1) {
      if (!snake.some((part) => part.x === x && part.y === y)) {
        openCells.push({ x, y });
      }
    }
  }

  return openCells[Math.floor(Math.random() * openCells.length)] || null;
}

function cellType(cell) {
  if (game.snake.some((part) => part.x === cell.x && part.y === cell.y)) {
    return 'snake';
  }

  if (game.food && game.food.x === cell.x && game.food.y === cell.y) {
    return 'food';
  }

  return 'empty';
}

function render() {
  scoreElement.textContent = `점수: ${game.score}`;
  if (game.status === '승리') {
    statusElement.textContent = '승리! 모든 칸을 채웠습니다.';
  } else {
    statusElement.textContent =
      game.status === '게임 종료' ? '게임 종료! 다시 시작해 보세요.' : '방향키로 움직이세요.';
  }

  for (const cell of boardElement.children) {
    cell.className = `cell ${cellType({
      x: Number(cell.dataset.x),
      y: Number(cell.dataset.y),
    })}`;
  }
}

function tick() {
  game = window.gameLogic.stepGame(game, pickFood);
  render();

  if (game.status !== '진행 중') {
    clearInterval(timer);
    timer = null;
  }
}

function startTimer() {
  if (!timer) {
    timer = setInterval(tick, 180);
  }
}

function buildBoard() {
  boardElement.replaceChildren();
  for (let y = 0; y < window.gameLogic.BOARD_SIZE; y += 1) {
    for (let x = 0; x < window.gameLogic.BOARD_SIZE; x += 1) {
      const cell = document.createElement('span');
      cell.className = 'cell empty';
      cell.dataset.x = x;
      cell.dataset.y = y;
      boardElement.append(cell);
    }
  }
}

document.addEventListener('keydown', (event) => {
  const directions = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',
  };
  const direction = directions[event.key];

  if (direction) {
    event.preventDefault();
    game = window.gameLogic.changeDirection(game, direction);
    startTimer();
    render();
  }
});

resetButton.addEventListener('click', () => {
  clearInterval(timer);
  timer = null;
  game = window.gameLogic.createGame();
  render();
});

buildBoard();
render();
