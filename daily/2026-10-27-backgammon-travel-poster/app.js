(() => {
  const { createGame, legalMoves, move, winner } = window.BackgammonLogic;
  const board = document.querySelector('#board'), dice = document.querySelector('#dice'), status = document.querySelector('#status');
  let game = createGame();
  const name = side => side === 'light' ? '살구색' : '남색';
  function render() {
    board.innerHTML = '';
    for (let n = 1; n <= 24; n++) {
      const point = document.createElement('div'); point.className = `point ${n % 2 ? 'coral' : 'cream'}`;
      point.innerHTML = `<span>${String(n).padStart(2, '0')}</span>`;
      [['light', game.light], ['dark', game.dark]].forEach(([side, place]) => {
        if (place === n && game.pieces[side]) point.insertAdjacentHTML('beforeend', `<i class="checker ${side}" style="--count:${game.pieces[side]}">${game.pieces[side]}</i>`);
      });
      board.append(point);
    }
    const won = winner(game);
    status.textContent = won ? `${name(won)} 말이 항구를 모두 떠났습니다. 승리!` : `${name(game.turn)} 말의 차례 · 남은 말 ${game.pieces[game.turn]}개`;
    dice.innerHTML = '';
    [1,2,3,4,5,6].forEach(value => {
      const button = document.createElement('button'); button.type = 'button'; button.textContent = value; button.setAttribute('aria-label', `${value}칸 이동`);
      button.disabled = !legalMoves(game).includes(value); button.addEventListener('click', () => { game = move(game, value); render(); }); dice.append(button);
    });
  }
  document.querySelector('#reset').addEventListener('click', () => { game = createGame(); render(); }); render();
})();
