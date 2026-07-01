const boardElement = document.querySelector('#board');
const shotsLeftElement = document.querySelector('#shots-left');
const hitsElement = document.querySelector('#hits');
const statusElement = document.querySelector('#status');
const messageElement = document.querySelector('#message');
const fleetListElement = document.querySelector('#fleet-list');
const resetButton = document.querySelector('#reset-button');

const ROW_LABELS = ['가', '나', '다', '라', '마'];

let game = Battleship.createGame();

function getCellLabel(row, col) {
  return `${ROW_LABELS[row]}${col + 1}`;
}

function getCellText(value) {
  if (value === 'hit') {
    return '명중';
  }
  if (value === 'miss') {
    return '빗나감';
  }
  return '수색';
}

function renderBoard() {
  boardElement.innerHTML = '';

  game.shots.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = value ? `cell is-${value}` : 'cell';
      button.textContent = getCellText(value);
      button.setAttribute('aria-label', `${getCellLabel(rowIndex, colIndex)} ${getCellText(value)}`);
      button.disabled = game.status !== '진행 중' || Boolean(value);
      button.addEventListener('click', () => {
        game = Battleship.fireAt(game, rowIndex, colIndex);
        render();
      });
      boardElement.appendChild(button);
    });
  });
}

function renderFleet() {
  fleetListElement.innerHTML = '';

  game.fleet.forEach((ship) => {
    const item = document.createElement('li');
    const remaining = ship.cells.length - ship.hits.length;
    item.className = ship.status === '격침' ? 'ship is-sunk' : 'ship';
    item.innerHTML = `
      <span class="ship-name">${ship.name}</span>
      <span class="ship-status">${ship.status === '격침' ? '격침' : `남은 칸 ${remaining}`}</span>
    `;
    fleetListElement.appendChild(item);
  });
}

function render() {
  shotsLeftElement.textContent = String(game.shotsLeft);
  hitsElement.textContent = `${game.hits}/6`;
  statusElement.textContent = game.status;
  messageElement.textContent = game.message;
  renderBoard();
  renderFleet();
}

resetButton.addEventListener('click', () => {
  game = Battleship.createGame();
  render();
});

render();
