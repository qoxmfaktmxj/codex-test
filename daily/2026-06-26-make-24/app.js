const tilesElement = document.querySelector('#tiles');
const operatorsElement = document.querySelector('#operators');
const tileCountElement = document.querySelector('#tile-count');
const statusElement = document.querySelector('#game-status');
const messageElement = document.querySelector('#message');
const historyElement = document.querySelector('#history');
const combineButton = document.querySelector('#combine-button');
const undoButton = document.querySelector('#undo-button');
const resetButton = document.querySelector('#reset-button');
const nextButton = document.querySelector('#next-button');

let game = Make24.createGame();
let selectedTiles = [];
let selectedOperator = '+';

function clearSelection() {
  selectedTiles = [];
}

function renderTiles() {
  tilesElement.innerHTML = '';

  game.tiles.forEach((tile) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = selectedTiles.includes(tile.id) ? 'tile selected' : 'tile';
    button.dataset.tileId = tile.id;
    button.setAttribute('aria-pressed', selectedTiles.includes(tile.id) ? 'true' : 'false');
    button.setAttribute('aria-label', `${tile.expression} 숫자 선택`);
    button.innerHTML = `<span>${Make24.formatNumber(tile.value)}</span><small>${tile.expression}</small>`;
    tilesElement.appendChild(button);
  });
}

function renderOperators() {
  operatorsElement.querySelectorAll('button').forEach((button) => {
    const isSelected = button.dataset.operator === selectedOperator;
    button.classList.toggle('selected', isSelected);
    button.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
  });
}

function renderHistory() {
  historyElement.innerHTML = '';

  game.moves.slice(-5).forEach((move) => {
    const item = document.createElement('li');
    item.textContent = move;
    historyElement.appendChild(item);
  });
}

function render() {
  tileCountElement.textContent = `${game.tiles.length}개`;
  statusElement.textContent = game.status;
  messageElement.textContent = game.message;
  renderTiles();
  renderOperators();
  renderHistory();
}

tilesElement.addEventListener('click', (event) => {
  const tileButton = event.target.closest('.tile');
  if (!tileButton) {
    return;
  }

  const tileId = tileButton.dataset.tileId;
  if (selectedTiles.includes(tileId)) {
    selectedTiles = selectedTiles.filter((id) => id !== tileId);
  } else {
    selectedTiles = selectedTiles.concat(tileId).slice(-2);
  }

  render();
});

operatorsElement.addEventListener('click', (event) => {
  const operatorButton = event.target.closest('button');
  if (!operatorButton) {
    return;
  }

  selectedOperator = operatorButton.dataset.operator;
  render();
});

combineButton.addEventListener('click', () => {
  game = Make24.combineTiles(game, selectedTiles[0], selectedTiles[1], selectedOperator);
  clearSelection();
  render();
});

undoButton.addEventListener('click', () => {
  game = Make24.undo(game);
  clearSelection();
  render();
});

resetButton.addEventListener('click', () => {
  game = Make24.createGame(game.numbers, game.puzzleIndex);
  clearSelection();
  render();
});

nextButton.addEventListener('click', () => {
  game = Make24.nextPuzzle(game);
  clearSelection();
  render();
});

render();
