(() => {
  const { createGame, placeLetter } = window.SosStormLogic;
  const board = document.querySelector('#board'), status = document.querySelector('#status'), score = document.querySelector('#score'), turn = document.querySelector('#turn-label');
  let game = createGame(5), selected = 'S';
  const render = () => {
    board.innerHTML = ''; board.style.setProperty('--size', game.size);
    game.board.forEach((line, row) => line.forEach((cell, col) => {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'cell' + (cell ? ' filled' : ''); button.textContent = cell || '·'; button.setAttribute('aria-label', `${row + 1}행 ${col + 1}열 ${cell || '빈 칸'}`);
      if (game.lastLines.some(cells => cells.some(([r,c]) => r === row && c === col))) button.classList.add('flash');
      button.disabled = Boolean(cell) || game.finished; button.addEventListener('click', () => { game = placeLetter(game, row, col, selected); render(); }); board.append(button);
    }));
    status.textContent = game.message; score.textContent = `등대 ${game.scores.등대} : ${game.scores.배} 배`; turn.textContent = game.finished ? '전보 종료' : game.turn + ' 차례';
  };
  const selectLetter = letter => { selected = letter; document.querySelectorAll('[data-letter]').forEach(item => { const active = item.dataset.letter === letter; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active)); }); };
  document.querySelectorAll('[data-letter]').forEach(button => button.addEventListener('click', () => selectLetter(button.dataset.letter)));
  document.querySelector('#reset').addEventListener('click', () => { game = createGame(5); selectLetter('S'); render(); });
  render();
})();
