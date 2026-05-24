const {
  cardLabel,
  cardRankLabel,
  handValue,
  createGame,
  hitPlayer,
  standDealer,
  canPlayerAct,
} = window.gameLogic;

const playerScore = document.getElementById('player-score');
const dealerScore = document.getElementById('dealer-score');
const deckCount = document.getElementById('deck-count');
const playerHand = document.getElementById('player-hand');
const dealerHand = document.getElementById('dealer-hand');
const message = document.getElementById('message');
const hitButton = document.getElementById('hit-button');
const standButton = document.getElementById('stand-button');
const resetButton = document.getElementById('reset-button');

let game = createGame();

function createCardElement(card, hidden = false) {
  const item = document.createElement('div');
  item.className = hidden ? 'card hidden' : `card ${card.suit}`;
  item.setAttribute('aria-label', hidden ? '숨겨진 카드' : cardLabel(card));

  if (hidden) {
    item.innerHTML = '<span>비공개</span><strong>?</strong>';
    return item;
  }

  item.innerHTML = `<span>${card.suit}</span><strong>${cardRankLabel(card)}</strong>`;
  return item;
}

function renderHand(container, hand, hideSecondCard) {
  container.innerHTML = '';
  hand.forEach((card, index) => {
    container.appendChild(createCardElement(card, hideSecondCard && index === 1));
  });
}

function render() {
  const acting = canPlayerAct(game);
  const visibleDealerHand = acting ? game.dealerHand.slice(0, 1) : game.dealerHand;

  playerScore.textContent = handValue(game.playerHand);
  dealerScore.textContent = acting ? '?' : handValue(visibleDealerHand);
  deckCount.textContent = game.deck.length;
  renderHand(playerHand, game.playerHand, false);
  renderHand(dealerHand, game.dealerHand, acting);
  message.textContent = game.message;

  hitButton.disabled = !acting;
  standButton.disabled = !acting;
}

function updateGame(nextGame) {
  game = nextGame;
  render();
}

hitButton.addEventListener('click', () => updateGame(hitPlayer(game)));
standButton.addEventListener('click', () => updateGame(standDealer(game)));
resetButton.addEventListener('click', () => updateGame(createGame()));

document.addEventListener('keydown', (event) => {
  if (event.key === 'h' || event.key === 'H') {
    updateGame(hitPlayer(game));
  }
  if (event.key === 's' || event.key === 'S') {
    updateGame(standDealer(game));
  }
  if (event.key === 'r' || event.key === 'R') {
    updateGame(createGame());
  }
});

render();
