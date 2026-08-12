(() => {
  const pyramid = document.querySelector('#pyramid');
  const message = document.querySelector('#message');
  const moves = document.querySelector('#moves');
  const stockCount = document.querySelector('#stock-count');
  const drawCard = document.querySelector('#draw-card');
  const wasteCard = document.querySelector('#waste-card');
  const newGame = document.querySelector('#new-game');
  let game;
  let selected = null;

  function cardColor(card) { return card.suit === '♥' || card.suit === '♦' ? 'red' : 'black'; }
  function cardText(card) { return `${card.rank}${card.suit}`; }
  function cardButton(card, selection, label) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `card ${cardColor(card)}${selected && selected.source === selection.source && selected.index === selection.index ? ' selected' : ''}`;
    button.innerHTML = `<span class="corner">${cardText(card)}</span><span class="suit">${card.suit}</span>`;
    button.setAttribute('aria-label', label);
    button.addEventListener('click', () => chooseCard(selection));
    return button;
  }
  function available(selection) {
    return selection.source === 'waste' || Pyramid.availablePyramidIndexes(game).includes(selection.index);
  }
  function chooseCard(selection) {
    if (game.status !== '진행 중' || !available(selection)) return;
    const card = selection.source === 'waste' ? game.waste.at(-1) : game.pyramid[selection.index];
    if (!card) return;
    try {
      if (Pyramid.VALUES[card.rank] === 13) game = Pyramid.removeKing(game, selection);
      else if (selected) {
        game = Pyramid.removePair(game, selected, selection);
        selected = null;
      } else selected = selection;
    } catch (error) {
      selected = selection;
      message.textContent = '합이 13인 다른 카드를 고르세요.';
      render();
      message.textContent = '합이 13인 다른 카드를 고르세요.';
      return;
    }
    render();
  }
  function render() {
    message.textContent = game.message;
    moves.textContent = game.moves;
    stockCount.textContent = `${game.stock.length}장 남음`;
    drawCard.disabled = game.status !== '진행 중' || !game.stock.length;
    pyramid.replaceChildren(...game.pyramid.map((card, index) => {
      const slot = document.createElement('div');
      const rowStart = (card.row * (card.row + 1)) / 2;
      slot.className = 'pyramid-slot';
      slot.style.gridRow = String(card.row + 1);
      slot.style.gridColumn = String(7 - card.row + ((index - rowStart) * 2));
      if (!card.removed) {
        const selection = { source: 'pyramid', index };
        const button = cardButton(card, selection, `${card.row + 1}줄 카드 ${cardText(card)}`);
        button.disabled = game.status !== '진행 중' || !available(selection);
        slot.append(button);
      }
      return slot;
    }));
    wasteCard.replaceChildren();
    const waste = game.waste.at(-1);
    if (waste) wasteCard.append(cardButton(waste, { source: 'waste' }, `버린 카드 ${cardText(waste)}`));
    else wasteCard.innerHTML = '<span>카드를 뽑으세요</span>';
  }
  function startGame() {
    game = Pyramid.createGame(Pyramid.shuffleDeck(Pyramid.createDeck()));
    selected = null;
    render();
  }
  drawCard.addEventListener('click', () => { game = Pyramid.drawCard(game); selected = null; render(); });
  newGame.addEventListener('click', startGame);
  startGame();
})();
