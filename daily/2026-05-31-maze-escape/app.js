(function () {
  const {
    TILE,
    DIRECTIONS,
    createGame,
    getTile,
    movePlayer,
    statusText,
  } = window.MazeEscapeLogic;

  const mazeElement = document.querySelector('#maze');
  const messageElement = document.querySelector('#message');
  const statusElement = document.querySelector('#status');
  const resetButton = document.querySelector('#reset-button');
  const directionButtons = document.querySelectorAll('[data-direction]');

  const directionByKey = {
    ArrowUp: DIRECTIONS.UP,
    ArrowDown: DIRECTIONS.DOWN,
    ArrowLeft: DIRECTIONS.LEFT,
    ArrowRight: DIRECTIONS.RIGHT,
  };

  const labelByTile = {
    [TILE.WALL]: '벽',
    [TILE.PATH]: '길',
    [TILE.START]: '시작',
    [TILE.KEY]: '열쇠',
    [TILE.EXIT]: '출구',
  };

  let game = createGame();

  function classForTile(tile) {
    if (tile === TILE.WALL) return 'wall';
    if (tile === TILE.KEY) return 'key';
    if (tile === TILE.EXIT) return 'exit';
    if (tile === TILE.START) return 'start';
    return 'path';
  }

  function renderMaze() {
    mazeElement.innerHTML = '';
    mazeElement.style.setProperty('--rows', game.maze.length);
    mazeElement.style.setProperty('--columns', game.maze[0].length);

    for (let row = 0; row < game.maze.length; row += 1) {
      for (let column = 0; column < game.maze[row].length; column += 1) {
        const position = { row, column };
        const tile = getTile(game.maze, position);
        const cell = document.createElement('div');
        const isPlayer = game.player.row === row && game.player.column === column;
        const isCollectedKey = game.hasKey && tile === TILE.KEY;
        cell.className = `cell ${classForTile(isCollectedKey ? TILE.PATH : tile)}`;
        cell.setAttribute('role', 'gridcell');
        cell.setAttribute('aria-label', isPlayer ? '탐험가 위치' : labelByTile[isCollectedKey ? TILE.PATH : tile]);
        cell.textContent = isPlayer ? '🙂' : isCollectedKey ? '' : tile === TILE.KEY ? '🔑' : tile === TILE.EXIT ? '🚪' : '';
        mazeElement.appendChild(cell);
      }
    }
  }

  function render() {
    renderMaze();
    statusElement.textContent = statusText(game);
    messageElement.textContent = game.message;
    directionButtons.forEach((button) => {
      button.disabled = game.status !== 'playing';
    });
  }

  function play(direction) {
    game = movePlayer(game, direction);
    render();
  }

  directionButtons.forEach((button) => {
    button.addEventListener('click', () => play(button.dataset.direction));
  });

  resetButton.addEventListener('click', () => {
    game = createGame();
    render();
  });

  window.addEventListener('keydown', (event) => {
    const direction = directionByKey[event.key];
    if (!direction) return;
    event.preventDefault();
    play(direction);
  });

  render();
}());
