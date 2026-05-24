const { BOARD_SIZE, createGame, revealCell, toggleFlag, remainingSafeCells } = window.gameLogic;

const boardElement = document.querySelector('#board');
const statusElement = document.querySelector('#status');
const safeCountElement = document.querySelector('#safe-count');
const flagCountElement = document.querySelector('#flag-count');
const messageElement = document.querySelector('#message');
const resetButton = document.querySelector('#reset-button');
const flagModeButton = document.querySelector('#flag-mode-button');

let game = createGame();
let flagMode = false;

function visibleTextForCell(cell) {
  if (cell.isFlagged) {
    return '🚩';
  }
  if (!cell.isRevealed) {
    return '';
  }
  if (cell.hasMine) {
    return '💣';
  }
  return cell.neighborMines > 0 ? String(cell.neighborMines) : '';
}

function labelForCell(cell) {
  const position = `${cell.row + 1}행 ${cell.col + 1}열`;
  if (cell.isFlagged) {
    return `${position}, 깃발 표시됨`;
  }
  if (!cell.isRevealed) {
    return `${position}, 닫힌 칸`;
  }
  if (cell.hasMine) {
    return `${position}, 지뢰`;
  }
  if (cell.neighborMines > 0) {
    return `${position}, 주변 지뢰 ${cell.neighborMines}개`;
  }
  return `${position}, 빈 칸`;
}

function renderBoard() {
  boardElement.style.setProperty('--board-size', BOARD_SIZE);
  boardElement.innerHTML = '';

  game.cells.forEach((cell) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'cell';
    button.dataset.index = String(cell.index);
    button.setAttribute('aria-label', labelForCell(cell));
    button.textContent = visibleTextForCell(cell);

    if (cell.isRevealed) {
      button.classList.add('revealed');
    }
    if (cell.hasMine && cell.isRevealed) {
      button.classList.add('mine');
    }
    if (cell.isFlagged) {
      button.classList.add('flagged');
    }
    if (cell.neighborMines > 0 && cell.isRevealed && !cell.hasMine) {
      button.dataset.neighbor = String(cell.neighborMines);
    }

    boardElement.appendChild(button);
  });
}

function renderStatus() {
  const flags = game.cells.filter((cell) => cell.isFlagged).length;
  statusElement.textContent = game.status;
  safeCountElement.textContent = String(remainingSafeCells(game));
  flagCountElement.textContent = String(flags);
  messageElement.textContent = game.message;
  flagModeButton.textContent = flagMode ? '깃발 모드 켜짐' : '깃발 모드 끄기';
  flagModeButton.setAttribute('aria-pressed', String(flagMode));
}

function render() {
  renderBoard();
  renderStatus();
}

function handleOpen(index) {
  game = revealCell(game, index);
  render();
}

function handleFlag(index) {
  game = toggleFlag(game, index);
  render();
}

boardElement.addEventListener('click', (event) => {
  const target = event.target.closest('.cell');
  if (!target) {
    return;
  }

  const index = Number(target.dataset.index);
  if (flagMode) {
    handleFlag(index);
  } else {
    handleOpen(index);
  }
});

boardElement.addEventListener('contextmenu', (event) => {
  const target = event.target.closest('.cell');
  if (!target) {
    return;
  }
  event.preventDefault();
  handleFlag(Number(target.dataset.index));
});

flagModeButton.addEventListener('click', () => {
  flagMode = !flagMode;
  renderStatus();
});

resetButton.addEventListener('click', () => {
  game = createGame();
  flagMode = false;
  render();
});

render();
