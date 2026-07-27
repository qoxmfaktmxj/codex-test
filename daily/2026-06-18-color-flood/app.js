(function startColorFlood() {
  const {
    COLORS: paletteColors,
    createGame,
    pickColor,
    resetGame,
  } = window.ColorFloodLogic;

  const COLOR_CLASS = {
    빨강: 'red',
    주황: 'orange',
    노랑: 'yellow',
    초록: 'green',
    파랑: 'blue',
    보라: 'purple',
  };

  const boardEl = document.getElementById('board');
  const paletteEl = document.getElementById('palette');
  const movesEl = document.getElementById('moves');
  const moveLimitEl = document.getElementById('move-limit');
  const currentColorEl = document.getElementById('current-color');
  const statusEl = document.getElementById('status');
  const messageEl = document.getElementById('message');
  const resetButton = document.getElementById('reset-button');

  let game = createGame();

  function renderBoard() {
    boardEl.innerHTML = '';
    boardEl.style.gridTemplateColumns = `repeat(${game.size}, 1fr)`;
    boardEl.style.gridTemplateRows = `repeat(${game.size}, 1fr)`;

    game.board.forEach((row, rowIndex) => {
      row.forEach((color, colIndex) => {
        const cell = document.createElement('div');
        cell.className = `cell ${COLOR_CLASS[color]}`;
        cell.setAttribute('aria-label', `${rowIndex + 1}행 ${colIndex + 1}열 ${color}`);
        boardEl.appendChild(cell);
      });
    });
  }

  function renderPalette() {
    paletteEl.innerHTML = '';
    paletteColors.forEach((color) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `color-button ${COLOR_CLASS[color]}`;
      button.textContent = color;
      button.disabled = game.status !== '진행 중';
      button.setAttribute('aria-pressed', String(color === game.currentColor));
      button.addEventListener('click', () => {
        game = pickColor(game, color);
        render();
      });
      paletteEl.appendChild(button);
    });
  }

  function render() {
    movesEl.textContent = String(game.moves);
    moveLimitEl.textContent = String(game.moveLimit);
    currentColorEl.textContent = game.currentColor;
    statusEl.textContent = game.status;
    messageEl.textContent = game.message;
    renderBoard();
    renderPalette();
  }

  resetButton.addEventListener('click', () => {
    game = resetGame();
    render();
  });

  render();
})();
