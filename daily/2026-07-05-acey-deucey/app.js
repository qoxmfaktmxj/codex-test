const chipsElement = document.querySelector('#chips');
const targetElement = document.querySelector('#target');
const roundElement = document.querySelector('#round');
const statusElement = document.querySelector('#status');
const lowCardElement = document.querySelector('#low-card');
const highCardElement = document.querySelector('#high-card');
const lastCardElement = document.querySelector('#last-card');
const messageElement = document.querySelector('#message');
const betInput = document.querySelector('#bet-input');
const betButton = document.querySelector('#bet-button');
const passButton = document.querySelector('#pass-button');
const resetButton = document.querySelector('#reset-button');
const historyElement = document.querySelector('#history');

let game = AceyDeucey.createGame();

function renderCard(element, card) {
  element.innerHTML = '';
  if (!card) {
    element.textContent = '?';
    element.classList.remove('is-red');
    return;
  }

  const rank = document.createElement('strong');
  rank.textContent = AceyDeucey.rankLabel(card.rank);
  const suit = document.createElement('span');
  suit.textContent = card.suit === 'hearts' || card.suit === 'diamonds' ? '♥' : '♠';
  const label = document.createElement('small');
  label.textContent = AceyDeucey.cardLabel(card);

  element.classList.toggle('is-red', card.suit === 'hearts' || card.suit === 'diamonds');
  element.append(rank, suit, label);
}

function renderHistory() {
  historyElement.innerHTML = '';
  game.history.slice(-5).reverse().forEach((entry) => {
    const item = document.createElement('li');
    if (entry.outcome === '패스') {
      item.textContent = `${entry.round}라운드: 패스 · 칩 ${entry.chips}`;
    } else {
      item.textContent = `${entry.round}라운드: ${entry.outcome} · ${entry.bet}칩 · ${AceyDeucey.cardLabel(entry.revealedCard)} · 칩 ${entry.chips}`;
    }
    historyElement.appendChild(item);
  });
}

function render() {
  chipsElement.textContent = String(game.chips);
  targetElement.textContent = String(game.targetChips);
  roundElement.textContent = String(game.round);
  statusElement.textContent = game.status;
  messageElement.textContent = game.message;
  betInput.max = String(Math.max(1, game.chips));
  if (Number(betInput.value) > game.chips) {
    betInput.value = String(Math.max(1, game.chips));
  }
  betInput.disabled = game.status !== '진행 중';
  betButton.disabled = game.status !== '진행 중';
  passButton.disabled = game.status !== '진행 중';
  renderCard(lowCardElement, game.lowCard);
  renderCard(highCardElement, game.highCard);
  renderCard(lastCardElement, game.lastCard);
  renderHistory();
}

betButton.addEventListener('click', () => {
  game = AceyDeucey.placeBet(game, Number(betInput.value));
  render();
});

passButton.addEventListener('click', () => {
  game = AceyDeucey.passRound(game);
  render();
});

resetButton.addEventListener('click', () => {
  game = AceyDeucey.createGame();
  betInput.value = '5';
  render();
});

render();
