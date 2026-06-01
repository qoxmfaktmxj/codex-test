(function () {
  const {
    TILE,
    DIRECTIONS,
    createGame,
    getTile,
    movePlayer,
    statusText,
  } = window.SokobanLogic;

  const boardElement = document.querySelector('#board');
  const statusElement = document.querySelector('#status');
  const messageElement = document.querySelector('#message');
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
    [TILE.FLOOR]: '바닥',
    [TILE.TARGET]: '목표 칸',
    [TILE.PLAYER]: '관리자 위치',
    [TILE.PLAYER_ON_TARGET]: '목표 위 관리자',
    [TILE.CRATE]: '상자',
    [TILE.CRATE_ON_TARGET]: '목표 위 상자',
  };

  const symbolByTile = {
    [TILE.WALL]: '',
    [TILE.FLOOR]: '',
    [TILE.TARGET]: '◎',
    [TILE.PLAYER]: '일꾼',
    [TILE.PLAYER_ON_TARGET]: '일꾼',
    [TILE.CRATE]: '상자',
    [TILE.CRATE_ON_TARGET]: '완료',
  };

  let game = createGame();

  function classForTile(tile) {
    if (tile === TILE.WALL) return 'wall';
    if (tile === TILE.TARGET) return 'target';
    if (tile === TILE.PLAYER || tile === TILE.PLAYER_ON_TARGET) return 'player';
    if (tile === TILE.CRATE) return 'crate';
    if (tile === TILE.CRATE_ON_TARGET) return 'crate target-crate';
    return 'floor';
  }

  function renderBoard() {
    boardElement.innerHTML = '';
    boardElement.style.setProperty('--rows', game.terrain.length);
    boardElement.style.setProperty('--columns', game.terrain[0].length);

    for (let row = 0; row < game.terrain.length; row += 1) {
      for (let column = 0; column < game.terrain[row].length; column += 1) {
        const tile = getTile(game, { row, column });
        const cell = document.createElement('div');
        cell.className = `cell ${classForTile(tile)}`;
        cell.setAttribute('role', 'gridcell');
        cell.setAttribute('aria-label', labelByTile[tile]);
        cell.textContent = symbolByTile[tile];
        boardElement.appendChild(cell);
      }
    }
  }

  function render() {
    renderBoard();
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
