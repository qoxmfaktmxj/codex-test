(() => {
  const logic = window.GomokuLogic;
  let game = logic.createGame();

  const boardElement = document.getElementById('board');
  const turnElement = document.getElementById('turn');
  const statusElement = document.getElementById('status');
  const winnerElement = document.getElementById('winner');
  const messageElement = document.getElementById('message');
  const resetButton = document.getElementById('reset-button');

  function renderBoard() {
    boardElement.innerHTML = '';
    game.board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'cell';
        button.setAttribute('aria-label', `${rowIndex + 1}행 ${colIndex + 1}열`);
        button.disabled = game.status !== '진행 중' || Boolean(cell);

        if (cell) {
          const stone = document.createElement('span');
          stone.className = cell === '흑' ? 'stone black' : 'stone white';
          stone.textContent = cell;
          button.appendChild(stone);
        }

        button.addEventListener('click', () => {
          game = logic.placeStone(game, rowIndex, colIndex);
          render();
        });

        boardElement.appendChild(button);
      });
    });
  }

  function renderStatus() {
    turnElement.textContent = game.status === '진행 중' ? logic.getPlayerLabel(game.currentPlayer) : '-';
    statusElement.textContent = game.status;
    winnerElement.textContent = game.winner ? logic.getPlayerLabel(game.winner) : '-';
    messageElement.textContent = game.message;
  }

  function render() {
    renderBoard();
    renderStatus();
  }

  resetButton.addEventListener('click', () => {
    game = logic.resetGame();
    render();
  });

  render();
})();
