const { createGame, takeStones } = window.gameLogic;

const pilesEl = document.getElementById('piles');
const playerEl = document.getElementById('player');
const statusEl = document.getElementById('status');
const winnerEl = document.getElementById('winner');
const messageEl = document.getElementById('message');
const pileSelect = document.getElementById('pile-select');
const countInput = document.getElementById('count-input');
const takeButton = document.getElementById('take-button');
const resetButton = document.getElementById('reset-button');

let game = createGame();

function renderPileOptions() {
  pileSelect.innerHTML = '';
  game.piles.forEach((count, index) => {
    const option = document.createElement('option');
    option.value = String(index);
    option.textContent = `${index + 1}번 더미 (${count}개)`;
    option.disabled = count === 0;
    pileSelect.appendChild(option);
  });
}

function renderPiles() {
  pilesEl.innerHTML = '';
  game.piles.forEach((count, index) => {
    const pile = document.createElement('div');
    pile.className = 'pile';
    pile.setAttribute('aria-label', `${index + 1}번 더미, 돌 ${count}개`);

    const title = document.createElement('strong');
    title.textContent = `${index + 1}번 더미`;
    pile.appendChild(title);

    const stones = document.createElement('div');
    stones.className = 'stones';
    for (let i = 0; i < count; i += 1) {
      const stone = document.createElement('span');
      stone.className = 'stone';
      stone.textContent = '●';
      stones.appendChild(stone);
    }
    pile.appendChild(stones);
    pilesEl.appendChild(pile);
  });
}

function render() {
  playerEl.textContent = game.currentPlayer;
  statusEl.textContent = game.status;
  winnerEl.textContent = game.winner || '-';
  messageEl.textContent = game.message;
  takeButton.disabled = game.status !== '진행 중';
  renderPileOptions();
  renderPiles();
}

takeButton.addEventListener('click', () => {
  const pileIndex = Number(pileSelect.value);
  const count = Number(countInput.value);
  game = takeStones(game, pileIndex, count);
  render();
});

resetButton.addEventListener('click', () => {
  game = createGame();
  countInput.value = '1';
  render();
});

render();
