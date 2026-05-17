const {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  PADDLE_WIDTH,
  PADDLE_Y,
  createGame,
  movePaddle,
  tickGame,
} = window.gameLogic;

const board = document.querySelector('[data-board]');
const score = document.querySelector('[data-score]');
const status = document.querySelector('[data-status]');
const resetButton = document.querySelector('[data-reset]');
const leftButton = document.querySelector('[data-left]');
const rightButton = document.querySelector('[data-right]');

let game = createGame();
let timer = null;

function cellType(x, y) {
  if (game.ball.x === x && game.ball.y === y) {
    return 'ball';
  }
  if (game.bricks.some((brick) => brick.x === x && brick.y === y)) {
    return 'brick';
  }
  if (y === PADDLE_Y && x >= game.paddleX && x < game.paddleX + PADDLE_WIDTH) {
    return 'paddle';
  }
  return 'empty';
}

function draw() {
  board.innerHTML = '';
  for (let y = 0; y < BOARD_HEIGHT; y += 1) {
    for (let x = 0; x < BOARD_WIDTH; x += 1) {
      const cell = document.createElement('span');
      cell.className = `cell ${cellType(x, y)}`;
      cell.setAttribute('aria-hidden', 'true');
      board.appendChild(cell);
    }
  }

  score.textContent = `점수: ${game.score}`;
  status.textContent = `상태: ${game.status}`;
}

function stopIfDone() {
  if (game.status !== '진행 중' && timer) {
    clearInterval(timer);
    timer = null;
  }
}

function step() {
  game = tickGame(game);
  draw();
  stopIfDone();
}

function move(amount) {
  game = movePaddle(game, amount);
  draw();
}

function start() {
  if (!timer) {
    timer = setInterval(step, 360);
  }
}

function reset() {
  game = createGame();
  if (timer) {
    clearInterval(timer);
  }
  timer = setInterval(step, 360);
  draw();
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
    move(-1);
    start();
  }
  if (event.key === 'ArrowRight') {
    move(1);
    start();
  }
});

leftButton.addEventListener('click', () => {
  move(-1);
  start();
});

rightButton.addEventListener('click', () => {
  move(1);
  start();
});

resetButton.addEventListener('click', reset);

draw();
start();
