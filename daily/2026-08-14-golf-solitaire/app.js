(() => {
  const tableau = document.querySelector('#tableau');
  const message = document.querySelector('#message');
  const moves = document.querySelector('#moves');
  const stockCount = document.querySelector('#stock-count');
  const drawCard = document.querySelector('#draw-card');
  const wasteCard = document.querySelector('#waste-card');
  const newGame = document.querySelector('#new-game');
  let game;

  function cardColor(card) { return card.suit === '♥' || card.suit === '♦' ? 'red' : 'black'; }
  function cardText(card) { return `${card.rank}${card.suit}`; }
  function cardElement(card, label) {
    const element = document.createElement('div');
    element.className = `card ${cardColor(card)}`;
    element.innerHTML = `<span class="corner">${cardText(card)}</span><span class="suit">${card.suit}</span>`;
    element.setAttribute('aria-label', label);
    return element;
  }
  function render() {
    message.textContent = game.message;
    moves.textContent = game.moves;
    stockCount.textContent = `${game.stock.length}장`;
    drawCard.disabled = game.status !== '진행 중' || !game.stock.length;
    tableau.replaceChildren(...game.tableau.map((column, index) => {
      const columnElement = document.createElement('div');
      columnElement.className = 'column';
      column.forEach((card, cardIndex) => {
        const isTop = cardIndex === column.length - 1;
        const cardButton = document.createElement('button');
        cardButton.type = 'button';
        cardButton.className = `tableau-card card ${cardColor(card)}`;
        cardButton.style.top = `${cardIndex * 33}px`;
        cardButton.innerHTML = `<span class="corner">${cardText(card)}</span><span class="suit">${card.suit}</span>`;
        cardButton.setAttribute('aria-label', `${index + 1}번째 줄 ${cardText(card)}`);
        cardButton.disabled = !isTop || game.status !== '진행 중' || !GolfSolitaire.isAdjacentRank(card.rank, game.waste.rank);
        cardButton.addEventListener('click', () => { game = GolfSolitaire.removeCard(game, index); render(); });
        columnElement.append(cardButton);
      });
      return columnElement;
    }));
    wasteCard.replaceChildren(cardElement(game.waste, `버린 카드 ${cardText(game.waste)}`));
  }
  function startGame() {
    game = GolfSolitaire.createGame(GolfSolitaire.shuffleDeck(GolfSolitaire.createDeck()));
    render();
  }
  drawCard.addEventListener('click', () => { game = GolfSolitaire.drawStock(game); render(); });
  newGame.addEventListener('click', startGame);
  startGame();
})();
