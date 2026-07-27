const {
  PIT_COUNT: MANCALA_PIT_COUNT,
  createGame: makeGame,
  selectPit: choosePit,
  getPitState: readPitState,
} = window.MancalaLogic;

const turnEl = document.getElementById('turn');
const southStoreEl = document.getElementById('south-store');
const northStoreEl = document.getElementById('north-store');
const southStoreBoardEl = document.getElementById('south-store-board');
const northStoreBoardEl = document.getElementById('north-store-board');
const movesEl = document.getElementById('moves');
const messageEl = document.getElementById('message');
const southPitsEl = document.getElementById('south-pits');
const northPitsEl = document.getElementById('north-pits');
const resetButton = document.getElementById('reset-button');

let game = makeGame();

function makeStone(index) {
  const stone = document.createElement('span');
  stone.className = 'stone';
  stone.setAttribute('aria-hidden', 'true');
  stone.style.setProperty('--stone-index', String(index));
  return stone;
}

function renderStones(container, count) {
  const visibleCount = Math.min(count, 14);
  for (let index = 0; index < visibleCount; index += 1) {
    container.appendChild(makeStone(index));
  }
  if (count > visibleCount) {
    const extra = document.createElement('span');
    extra.className = 'extra-stones';
    extra.textContent = `+${count - visibleCount}`;
    container.appendChild(extra);
  }
}

function makePit(player, index) {
  const state = readPitState(game, player, index);
  const button = document.createElement('button');
  button.type = 'button';
  button.className = ['pit', state.selectable ? 'selectable' : ''].filter(Boolean).join(' ');
  button.disabled = !state.selectable;
  button.setAttribute('aria-label', `${player} ${index + 1}번 칸, 돌 ${state.stones}개`);
  button.addEventListener('click', () => {
    game = choosePit(game, player, index);
    render();
  });

  const count = document.createElement('strong');
  count.textContent = String(state.stones);
  button.appendChild(count);
  renderStones(button, state.stones);
  return button;
}

function renderPits() {
  southPitsEl.innerHTML = '';
  northPitsEl.innerHTML = '';

  for (let index = 0; index < MANCALA_PIT_COUNT; index += 1) {
    northPitsEl.appendChild(makePit('북쪽', index));
  }
  for (let index = 0; index < MANCALA_PIT_COUNT; index += 1) {
    southPitsEl.appendChild(makePit('남쪽', index));
  }
}

function render() {
  turnEl.textContent = game.status === '완료' ? '끝' : game.currentPlayer;
  turnEl.className = game.currentPlayer === '남쪽' ? 'south' : 'north';
  southStoreEl.textContent = String(game.stores['남쪽']);
  northStoreEl.textContent = String(game.stores['북쪽']);
  southStoreBoardEl.textContent = String(game.stores['남쪽']);
  northStoreBoardEl.textContent = String(game.stores['북쪽']);
  movesEl.textContent = String(game.moves);
  messageEl.textContent = game.message;
  renderPits();
}

resetButton.addEventListener('click', () => {
  game = makeGame();
  render();
});

render();
