const { BOARD_WIDTH, BOARD_HEIGHT, createGame, movePlayer, tickGame, hasCarAt } = window.gameLogic;

const board = document.getElementById('board');
const statusEl = document.getElementById('status');
const scoreEl = document.getElementById('score');
const tickEl = document.getElementById('tick');
const messageEl = document.getElementById('message');
const waitButton = document.getElementById('wait-button');
const resetButton = document.getElementById('reset-button');

let game = createGame();

function laneClass(y) {
  if (y === 0) return 'goal';
  if (y === BOARD_HEIGHT - 1) return 'start';
  return 'road';
}

function cellLabel(x, y, content) {
  if (content === '💥') return `충돌 위치 ${x + 1}, ${y + 1}`;
  if (content === '🐸') return `개구리 위치 ${x + 1}, ${y + 1}`;
  if (content === '🚗') return `자동차 위치 ${x + 1}, ${y + 1}`;
  if (y === 0) return '도착 연못';
  if (y === BOARD_HEIGHT - 1) return '출발선';
  return '도로';
}

function render() {
  board.innerHTML = '';
  statusEl.textContent = game.status;
  scoreEl.textContent = String(game.score);
  tickEl.textContent = String(game.tick);
  messageEl.textContent = game.message;

  for (let y = 0; y < BOARD_HEIGHT; y += 1) {
    for (let x = 0; x < BOARD_WIDTH; x += 1) {
      const cell = document.createElement('div');
      const hasFrog = game.player.x === x && game.player.y === y;
      const hasCar = hasCarAt(game, x, y);
      let content = '';
      if (hasFrog && hasCar) {
        content = '💥';
        cell.classList.add('crash');
      } else if (hasFrog) {
        content = '🐸';
        cell.classList.add('frog');
      } else if (hasCar) {
        content = '🚗';
        cell.classList.add('car');
      } else if (y === 0) {
        content = '🌿';
      }
      cell.className = `cell ${laneClass(y)} ${cell.className}`.trim();
      cell.textContent = content;
      cell.setAttribute('role', 'img');
      cell.setAttribute('aria-label', cellLabel(x, y, content));
      board.appendChild(cell);
    }
  }
}

function afterPlayerMove(nextGame) {
  if (nextGame.status === '진행 중') {
    game = tickGame(nextGame);
  } else {
    game = nextGame;
  }
  render();
}

function move(direction) {
  const moves = {
    up: [0, -1],
    down: [0, 1],
    left: [-1, 0],
    right: [1, 0],
  };
  const [dx, dy] = moves[direction];
  afterPlayerMove(movePlayer(game, dx, dy));
}

document.querySelectorAll('[data-move]').forEach((button) => {
  button.addEventListener('click', () => move(button.dataset.move));
});

waitButton.addEventListener('click', () => {
  game = tickGame(game);
  render();
});

resetButton.addEventListener('click', () => {
  game = createGame();
  render();
});

document.addEventListener('keydown', (event) => {
  const keyMap = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',
  };
  if (keyMap[event.key]) {
    event.preventDefault();
    move(keyMap[event.key]);
  }
  if (event.code === 'Space') {
    event.preventDefault();
    game = tickGame(game);
    render();
  }
});

render();
