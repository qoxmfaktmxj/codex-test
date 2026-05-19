(() => {
  const {
    BOARD_WIDTH,
    BOARD_HEIGHT,
    DEFENSE_LINE_Y,
    createGame,
    movePlayer,
    fireLaser,
    tickGame,
    isOccupied,
  } = window.gameLogic;

  const board = document.querySelector('#board');
  const score = document.querySelector('#score');
  const statusText = document.querySelector('#status');
  const message = document.querySelector('#message');
  const leftButton = document.querySelector('#left-button');
  const rightButton = document.querySelector('#right-button');
  const fireButton = document.querySelector('#fire-button');
  const resetButton = document.querySelector('#reset-button');

  let game = createGame();
  let timer = null;

  function cellContent(x, y) {
    if (game.playerX === x && y === BOARD_HEIGHT - 1) {
      return '🚀';
    }
    if (game.laser && game.laser.x === x && game.laser.y === y) {
      return '│';
    }
    if (isOccupied(game, x, y)) {
      return '👾';
    }
    return '';
  }

  function cellClass(x, y) {
    const classes = ['cell'];
    if (isOccupied(game, x, y)) classes.push('enemy');
    if (game.laser && game.laser.x === x && game.laser.y === y) classes.push('laser');
    if (game.playerX === x && y === BOARD_HEIGHT - 1) classes.push('player');
    if (y === DEFENSE_LINE_Y) classes.push('line');
    return classes.join(' ');
  }

  function render() {
    board.innerHTML = '';
    for (let y = 0; y < BOARD_HEIGHT; y += 1) {
      for (let x = 0; x < BOARD_WIDTH; x += 1) {
        const cell = document.createElement('div');
        cell.className = cellClass(x, y);
        cell.textContent = cellContent(x, y);
        board.appendChild(cell);
      }
    }

    score.textContent = game.score;
    statusText.textContent = game.status;
    message.textContent = game.message;

    if (game.status !== '진행 중' && timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function step(nextGame) {
    game = nextGame;
    render();
  }

  function reset() {
    game = createGame();
    if (timer) clearInterval(timer);
    timer = setInterval(() => step(tickGame(game)), 620);
    render();
  }

  leftButton.addEventListener('click', () => step(movePlayer(game, -1)));
  rightButton.addEventListener('click', () => step(movePlayer(game, 1)));
  fireButton.addEventListener('click', () => step(fireLaser(game)));
  resetButton.addEventListener('click', reset);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      step(movePlayer(game, -1));
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      step(movePlayer(game, 1));
    }
    if (event.code === 'Space') {
      event.preventDefault();
      step(fireLaser(game));
    }
  });

  reset();
})();
