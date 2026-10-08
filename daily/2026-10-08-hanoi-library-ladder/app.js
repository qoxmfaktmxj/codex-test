(() => {
  const board = document.querySelector('#board');
  const message = document.querySelector('#message');
  const moves = document.querySelector('#moves');
  const reset = document.querySelector('#reset');
  let game = window.gameLogic.createGame(4);
  let selected = null;

  function draw() {
    board.innerHTML = '';
    game.rods.forEach((rod, index) => {
      const shelf = document.createElement('button');
      shelf.type = 'button'; shelf.className = `shelf ${selected === index ? 'selected' : ''}`;
      shelf.setAttribute('aria-label', `${index + 1}번 서가`);
      const pole = document.createElement('span'); pole.className = 'pole'; shelf.append(pole);
      rod.forEach((disk) => {
        const book = document.createElement('span'); book.className = `book book-${disk}`;
        book.textContent = `${disk}권`; shelf.append(book);
      });
      shelf.addEventListener('click', () => choose(index)); board.append(shelf);
    });
    message.textContent = game.message; moves.textContent = game.moves;
  }
  function choose(index) {
    if (game.status === 'won') return;
    if (selected === null) {
      if (window.gameLogic.topDisk(game, index) === null) { game = { ...game, message: '책이 있는 서가를 골라주세요.' }; }
      else { selected = index; game = { ...game, message: '놓을 서가를 고르세요.' }; }
    } else { game = window.gameLogic.moveDisk(game, selected, index); selected = null; }
    draw();
  }
  reset.addEventListener('click', () => { game = window.gameLogic.createGame(4); selected = null; draw(); });
  draw();
})();
