const diceTotalElement = document.querySelector('#dice-total');
const scoreElement = document.querySelector('#score');
const statusElement = document.querySelector('#status');
const diceElement = document.querySelector('#dice');
const tilesElement = document.querySelector('#tiles');
const messageElement = document.querySelector('#message');
const rollButton = document.querySelector('#roll-button');
const closeButton = document.querySelector('#close-button');
const hintButton = document.querySelector('#hint-button');
const resetButton = document.querySelector('#reset-button');

let game = ShutTheBox.createGame();
let selectedTiles = [];

function toggleSelection(tile) {
  if (!game.tiles.includes(tile) || game.status !== '진행 중' || game.phase !== '선택 중') {
    return;
  }

  selectedTiles = selectedTiles.includes(tile)
    ? selectedTiles.filter((selectedTile) => selectedTile !== tile)
    : selectedTiles.concat(tile).sort((a, b) => a - b);
  render();
}

function renderDice() {
  diceElement.innerHTML = '';
  const pipMap = {
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8],
  };

  game.dice.forEach((value, index) => {
    const die = document.createElement('div');
    die.className = 'die';
    die.setAttribute('aria-label', `${index + 1}번째 주사위 ${value}`);
    for (let pipIndex = 0; pipIndex < 9; pipIndex += 1) {
      const pip = document.createElement('span');
      pip.className = pipMap[value].includes(pipIndex) ? 'pip is-on' : 'pip';
      die.appendChild(pip);
    }
    diceElement.appendChild(die);
  });
}

function renderTiles() {
  tilesElement.innerHTML = '';
  for (let tile = 1; tile <= 9; tile += 1) {
    const isOpen = game.tiles.includes(tile);
    const isSelected = selectedTiles.includes(tile);
    const button = document.createElement('button');
    button.type = 'button';
    button.className = [
      'tile',
      isOpen ? 'is-open' : 'is-closed',
      isSelected ? 'is-selected' : '',
    ].filter(Boolean).join(' ');
    button.textContent = String(tile);
    button.setAttribute('aria-label', `${tile}번 ${isOpen ? '열림' : '닫힘'}`);
    button.disabled = !isOpen || game.status !== '진행 중' || game.phase !== '선택 중';
    button.addEventListener('click', () => toggleSelection(tile));
    tilesElement.appendChild(button);
  }
}

function render() {
  diceTotalElement.textContent = String(game.rollTotal);
  scoreElement.textContent = String(game.score);
  statusElement.textContent = game.status;
  messageElement.textContent = game.message;
  closeButton.disabled = selectedTiles.length === 0 || game.status !== '진행 중' || game.phase !== '선택 중';
  rollButton.disabled = game.status !== '진행 중' || game.phase === '선택 중';
  hintButton.disabled = game.status !== '진행 중' || game.phase !== '선택 중';
  renderDice();
  renderTiles();
}

rollButton.addEventListener('click', () => {
  selectedTiles = [];
  game = ShutTheBox.rollDice(game);
  render();
});

closeButton.addEventListener('click', () => {
  game = ShutTheBox.closeTiles(game, selectedTiles);
  selectedTiles = [];
  render();
});

hintButton.addEventListener('click', () => {
  const hint = ShutTheBox.findCombination(game);
  selectedTiles = hint || [];
  game = ShutTheBox.checkRoll(game);
  if (hint) {
    game.message = `힌트: ${hint.join(', ')}를 고르면 ${game.rollTotal}가 됩니다.`;
  }
  render();
});

resetButton.addEventListener('click', () => {
  selectedTiles = [];
  game = ShutTheBox.createGame();
  render();
});

render();
