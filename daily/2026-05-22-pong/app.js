const {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  PADDLE_HEIGHT,
  createGame,
  movePlayer,
  stepGame,
} = window.gameLogic;

const board = document.getElementById('board');
const playerScore = document.getElementById('player-score');
const opponentScore = document.getElementById('opponent-score');
const message = document.getElementById('message');
const upButton = document.getElementById('up-button');
const downButton = document.getElementById('down-button');
const pauseButton = document.getElementById('pause-button');
const resetButton = document.getElementById('reset-button');

let game = createGame();
let paused = false;
let timerId = null;

function cellKind(x, y) {
  const onPlayer = x === 0 && y >= game.player.y && y < game.player.y + PADDLE_HEIGHT;
  const onOpponent = x === BOARD_WIDTH - 1 && y >= game.opponent.y && y < game.opponent.y + PADDLE_HEIGHT;
  const onBall = x === game.ball.x && y === game.ball.y;

  if (onBall) return 'ball';
  if (onPlayer) return 'player';
  if (onOpponent) return 'opponent';
  if (x === Math.floor(BOARD_WIDTH / 2)) return 'net';
  return '';
}

function render() {
  board.innerHTML = '';

  for (let y = 0; y < BOARD_HEIGHT; y += 1) {
    for (let x = 0; x < BOARD_WIDTH; x += 1) {
      const cell = document.createElement('div');
      const kind = cellKind(x, y);
      cell.className = `cell ${kind}`.trim();
      cell.setAttribute('aria-label', `${y + 1}행 ${x + 1}열`);
      board.appendChild(cell);
    }
  }

  playerScore.textContent = game.score.player;
  opponentScore.textContent = game.score.opponent;
  message.textContent = game.message;
  pauseButton.textContent = paused ? '계속하기' : '일시정지';
}

function updateGame(nextGame) {
  game = nextGame;
  render();
}

function moveBy(dy) {
  updateGame(movePlayer(game, dy));
}

function tick() {
  if (!paused) {
    updateGame(stepGame(game));
  }
}

function startTimer() {
  if (timerId !== null) {
    window.clearInterval(timerId);
  }
  timerId = window.setInterval(tick, 520);
}

upButton.addEventListener('click', () => moveBy(-1));
downButton.addEventListener('click', () => moveBy(1));
pauseButton.addEventListener('click', () => {
  paused = !paused;
  render();
});
resetButton.addEventListener('click', () => {
  game = createGame();
  paused = false;
  render();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp') {
    event.preventDefault();
    moveBy(-1);
  }
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    moveBy(1);
  }
  if (event.key === ' ') {
    event.preventDefault();
    paused = !paused;
    render();
  }
});

render();
startTimer();
