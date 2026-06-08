(() => {
  const logic = window.PegSolitaireLogic;
  const boardElement = document.querySelector('#board');
  const summaryElement = document.querySelector('#summary');
  const resultElement = document.querySelector('#result');
  const messageElement = document.querySelector('#message');
  const resetButton = document.querySelector('#reset');

  let game = logic.createGame();

  function isSelected(row, col) {
    return game.selected && game.selected.row === row && game.selected.col === col;
  }

  function renderBoard() {
    boardElement.innerHTML = '';

    game.board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `hole ${cell}`;
        button.dataset.row = rowIndex;
        button.dataset.col = colIndex;

        if (cell === logic.CELL.BLOCKED) {
          button.disabled = true;
          button.setAttribute('aria-label', '사용하지 않는 칸');
        } else {
          button.setAttribute('aria-label', cell === logic.CELL.PEG ? '말' : '빈칸');
        }

        if (isSelected(rowIndex, colIndex)) {
          button.classList.add('selected');
          button.setAttribute('aria-pressed', 'true');
        }

        boardElement.appendChild(button);
      });
    });
  }

  function render() {
    summaryElement.textContent = logic.boardSummary(game);
    resultElement.textContent = logic.resultText(game);
    messageElement.textContent = game.message;
    renderBoard();
  }

  boardElement.addEventListener('click', (event) => {
    const target = event.target.closest('.hole');
    if (!target || target.disabled) return;

    game = logic.selectHole(game, {
      row: Number(target.dataset.row),
      col: Number(target.dataset.col),
    });
    render();
  });

  resetButton.addEventListener('click', () => {
    game = logic.createGame();
    render();
  });

  render();
})();
