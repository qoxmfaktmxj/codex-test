const boardElement = document.querySelector('#board');
const movesElement = document.querySelector('#moves');
const statusElement = document.querySelector('#status');
const messageElement = document.querySelector('#message');
const shuffleButton = document.querySelector('#shuffle-button');
const resetButton = document.querySelector('#reset-button');

let game = FifteenPuzzle.createGame();

function renderBoard() {
  boardElement.innerHTML = '';

  game.tiles.forEach((tileNumber, index) => {
    const tile = document.createElement(tileNumber === 0 ? 'span' : 'button');
    tile.className = tileNumber === 0 ? 'tile tile-blank' : 'tile';

    if (tileNumber === 0) {
      tile.setAttribute('aria-label', '빈칸');
    } else {
      tile.type = 'button';
      tile.textContent = String(tileNumber);
      tile.disabled = game.status !== '진행 중';
      tile.setAttribute('aria-label', `${tileNumber}번 타일`);

      if (FifteenPuzzle.canMove(game, tileNumber)) {
        tile.classList.add('is-movable');
      }

      tile.addEventListener('click', () => {
        game = FifteenPuzzle.moveTile(game, tileNumber);
        render();
      });
    }

    tile.style.gridColumn = `${(index % FifteenPuzzle.SIZE) + 1}`;
    tile.style.gridRow = `${Math.floor(index / FifteenPuzzle.SIZE) + 1}`;
    boardElement.appendChild(tile);
  });
}

function moveByKeyboard(event) {
  const blankIndex = game.tiles.indexOf(0);
  const blankRow = Math.floor(blankIndex / FifteenPuzzle.SIZE);
  const blankColumn = blankIndex % FifteenPuzzle.SIZE;
  const offsets = {
    ArrowUp: [1, 0],
    ArrowDown: [-1, 0],
    ArrowLeft: [0, 1],
    ArrowRight: [0, -1],
  };

  if (!offsets[event.key] || game.status !== '진행 중') {
    return;
  }

  const [rowOffset, columnOffset] = offsets[event.key];
  const targetRow = blankRow + rowOffset;
  const targetColumn = blankColumn + columnOffset;

  if (
    targetRow < 0
    || targetRow >= FifteenPuzzle.SIZE
    || targetColumn < 0
    || targetColumn >= FifteenPuzzle.SIZE
  ) {
    return;
  }

  const targetIndex = targetRow * FifteenPuzzle.SIZE + targetColumn;
  const tileNumber = game.tiles[targetIndex];
  event.preventDefault();
  game = FifteenPuzzle.moveTile(game, tileNumber);
  render();
}

function render() {
  movesElement.textContent = String(game.moves);
  statusElement.textContent = game.status;
  messageElement.textContent = game.message;
  renderBoard();
}

shuffleButton.addEventListener('click', () => {
  game = FifteenPuzzle.createGame(FifteenPuzzle.shuffleTiles());
  render();
});

resetButton.addEventListener('click', () => {
  game = FifteenPuzzle.createGame();
  render();
});

document.addEventListener('keydown', moveByKeyboard);

render();
