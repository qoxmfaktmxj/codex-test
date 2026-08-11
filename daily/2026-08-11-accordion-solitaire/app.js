(() => {
  const board = document.querySelector('#board');
  const message = document.querySelector('#message');
  const moves = document.querySelector('#moves');
  const newGame = document.querySelector('#new-game');
  let game;
  let selected = null;

  function cardLabel(card) { return `${card.rank}${card.suit}`; }
  function cardColor(card) { return card.suit === '♥' || card.suit === '♦' ? 'red' : 'black'; }

  function startGame() {
    game = Accordion.createGame(Accordion.shuffleDeck(Accordion.createDeck()));
    selected = null;
    render();
  }

  function render() {
    const possible = Accordion.legalMoves(game);
    const selectedMoves = selected === null ? [] : possible.filter((move) => move.from === selected);
    message.textContent = game.message;
    moves.textContent = game.moves;
    board.replaceChildren(...game.piles.map((pile, index) => {
      const card = pile[pile.length - 1];
      const canMove = possible.some((move) => move.from === index);
      const target = selectedMoves.some((move) => move.to === index);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `pile-card ${cardColor(card)}${canMove ? ' movable' : ''}${selected === index ? ' selected' : ''}${target ? ' target' : ''}`;
      button.innerHTML = `<span class="corner">${cardLabel(card)}</span><span class="suit">${card.suit}</span><span class="pile-size">${pile.length > 1 ? `${pile.length}장` : ''}</span>`;
      button.setAttribute('aria-label', `${index + 1}번째 더미, ${cardLabel(card)}${pile.length > 1 ? ` 포함 카드 ${pile.length}장` : ''}`);
      button.disabled = game.status !== '진행 중' || (!canMove && !target);
      button.addEventListener('click', () => {
        if (target) {
          const move = selectedMoves.find((item) => item.to === index);
          game = Accordion.moveCard(game, move.from, move.to);
          selected = null;
        } else if (canMove) {
          selected = selected === index ? null : index;
        }
        render();
      });
      return button;
    }));
  }

  newGame.addEventListener('click', startGame);
  startGame();
})();
