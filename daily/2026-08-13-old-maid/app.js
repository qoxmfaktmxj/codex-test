(() => {
  const message = document.querySelector('#message');
  const moves = document.querySelector('#moves');
  const playerHand = document.querySelector('#player-hand');
  const computerHand = document.querySelector('#computer-hand');
  const playerCount = document.querySelector('#player-count');
  const computerCount = document.querySelector('#computer-count');
  const newGame = document.querySelector('#new-game');
  let game;
  let computerTimer;

  function cardText(card) { return card.rank === '조커' ? '★' : card.rank; }

  function render() {
    message.textContent = game.message;
    moves.textContent = game.moves;
    playerCount.textContent = `${game.player.length}장`;
    computerCount.textContent = `${game.computer.length}장`;
    playerHand.replaceChildren(...game.player.map((card) => {
      const item = document.createElement('div');
      item.className = `card face ${card.rank === '조커' ? 'joker' : ''}`;
      item.textContent = cardText(card);
      item.setAttribute('aria-label', card.rank === '조커' ? '조커 카드' : `${card.rank} 카드`);
      return item;
    }));
    computerHand.replaceChildren(...game.computer.map((_, index) => {
      const item = document.createElement('button');
      item.className = 'card back';
      item.type = 'button';
      item.textContent = '?';
      item.disabled = game.turn !== '플레이어' || game.status !== '진행 중';
      item.setAttribute('aria-label', `${index + 1}번째 컴퓨터 카드 고르기`);
      item.addEventListener('click', () => draw(index));
      return item;
    }));
  }

  function draw(index) {
    game = OldMaid.playerDraw(game, index);
    render();
    if (game.status === '진행 중') {
      computerTimer = window.setTimeout(() => {
        game = OldMaid.computerDraw(game);
        computerTimer = undefined;
        render();
      }, 550);
    }
  }

  function start() {
    if (computerTimer) window.clearTimeout(computerTimer);
    computerTimer = undefined;
    game = OldMaid.createGame(OldMaid.shuffleDeck(OldMaid.createDeck()));
    render();
  }

  newGame.addEventListener('click', start);
  start();
})();
