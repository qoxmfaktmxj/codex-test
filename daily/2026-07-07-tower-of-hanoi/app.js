const diskCountElement = document.querySelector('#disk-count');
const movesElement = document.querySelector('#moves');
const minimumMovesElement = document.querySelector('#minimum-moves');
const statusElement = document.querySelector('#status');
const boardElement = document.querySelector('#board');
const messageElement = document.querySelector('#message');
const diskSelectElement = document.querySelector('#disk-select');
const resetButton = document.querySelector('#reset-button');

let game = TowerOfHanoi.createGame(Number(diskSelectElement.value));

function renderDisk(disk) {
  const diskElement = document.createElement('span');
  diskElement.className = 'disk';
  diskElement.dataset.size = String(disk);
  diskElement.textContent = `${disk}`;
  diskElement.style.width = `${32 + disk * 13}%`;
  return diskElement;
}

function handlePegClick(pegIndex) {
  if (game.status !== '진행 중') {
    return;
  }

  game = game.selectedPeg === null
    ? TowerOfHanoi.selectPeg(game, pegIndex)
    : TowerOfHanoi.moveDisk(game, pegIndex);
  render();
}

function renderBoard() {
  boardElement.innerHTML = '';
  game.pegs.forEach((peg, pegIndex) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'peg';
    if (game.selectedPeg === pegIndex) {
      button.classList.add('is-selected');
    }
    button.setAttribute('aria-label', `${pegIndex + 1}번 기둥`);
    button.disabled = game.status !== '진행 중';
    button.addEventListener('click', () => handlePegClick(pegIndex));

    const pole = document.createElement('span');
    pole.className = 'pole';
    button.appendChild(pole);

    peg.forEach((disk) => {
      button.appendChild(renderDisk(disk));
    });

    const pegLabel = document.createElement('strong');
    pegLabel.textContent = `${pegIndex + 1}번`;
    button.appendChild(pegLabel);
    boardElement.appendChild(button);
  });
}

function render() {
  diskCountElement.textContent = String(game.diskCount);
  movesElement.textContent = String(game.moves);
  minimumMovesElement.textContent = String((2 ** game.diskCount) - 1);
  statusElement.textContent = game.status;
  messageElement.textContent = game.message;
  diskSelectElement.disabled = game.moves > 0 || game.status !== '진행 중';
  renderBoard();
}

diskSelectElement.addEventListener('change', () => {
  game = TowerOfHanoi.createGame(Number(diskSelectElement.value));
  render();
});

resetButton.addEventListener('click', () => {
  game = TowerOfHanoi.createGame(Number(diskSelectElement.value));
  render();
});

render();
