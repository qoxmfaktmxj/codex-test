const leftBankElement = document.querySelector('#left-bank');
const rightBankElement = document.querySelector('#right-bank');
const boatElement = document.querySelector('#boat');
const moveCountElement = document.querySelector('#move-count');
const statusElement = document.querySelector('#game-status');
const messageElement = document.querySelector('#message');
const restartButton = document.querySelector('#restart-button');
const controlButtons = Array.from(document.querySelectorAll('[data-passenger]'));

const ITEM_LABELS = {
  farmer: '농부',
  wolf: '늑대',
  goat: '염소',
  cabbage: '양배추',
};

let game = RiverCrossing.createGame();

function createItem(item) {
  const element = document.createElement('span');
  element.className = `item ${item}`;
  element.textContent = ITEM_LABELS[item];
  return element;
}

function renderBank(element, side) {
  element.innerHTML = '';
  RiverCrossing.getItemsOnSide(game, side).forEach((item) => {
    element.appendChild(createItem(item));
  });
}

function renderControls() {
  const farmerSide = game.positions.farmer;

  controlButtons.forEach((button) => {
    const passenger = button.dataset.passenger || null;
    const disabledBySide = passenger && game.positions[passenger] !== farmerSide;
    button.disabled = game.status === '성공' || disabledBySide;
  });
}

function render() {
  moveCountElement.textContent = `${game.moves}회`;
  statusElement.textContent = game.status;
  messageElement.textContent = game.message;
  boatElement.className = `boat ${game.positions.farmer}`;
  renderBank(leftBankElement, 'left');
  renderBank(rightBankElement, 'right');
  renderControls();
}

controlButtons.forEach((button) => {
  button.addEventListener('click', () => {
    game = RiverCrossing.crossRiver(game, button.dataset.passenger || null);
    render();
  });
});

restartButton.addEventListener('click', () => {
  game = RiverCrossing.createGame();
  render();
});

render();
