(function() {
  const { createGame, legalMoves, play, count } = window.picnicReversi;
  const board = document.querySelector('#board'), message = document.querySelector('#message'), score = document.querySelector('#score');
  let game = createGame(), focus = 19;
  const label = color => color === 'black' ? '검은 단추' : '하얀 단추';
  function render() {
    const moves = legalMoves(game, game.turn); const totals = count(game.board);
    board.innerHTML = '';
    game.board.forEach((piece, index) => {
      const cell = document.createElement('button'); cell.type = 'button'; cell.className = `cell ${moves.includes(index) ? 'legal' : ''}`;
      cell.setAttribute('role', 'gridcell'); cell.setAttribute('aria-label', `${Math.floor(index / 8) + 1}행 ${index % 8 + 1}열${piece ? `, ${label(piece)}` : moves.includes(index) ? ', 놓을 수 있음' : ''}`);
      cell.tabIndex = index === focus ? 0 : -1;
      if (piece) { const disc = document.createElement('i'); disc.className = `disc ${piece}`; cell.append(disc); }
      cell.addEventListener('click', () => { const next = play(game, index); if (next !== game) { game = next; focus = index; render(); } });
      cell.addEventListener('focus', () => { focus = index; }); board.append(cell);
    });
    score.textContent = `검은 ${totals.black} · 하얀 ${totals.white}`;
    if (game.status === 'finished') { const winner = totals.black === totals.white ? '비겼어요' : `${totals.black > totals.white ? '검은' : '하얀'} 단추 승리!`; message.textContent = `${winner} 새 보자기를 펴서 다시 할 수 있어요.`; }
    else if (game.passed) message.textContent = `${label(game.turn === 'black' ? 'white' : 'black')}이 둘 곳이 없어 한 번 쉬었어요. ${label(game.turn)} 차례예요.`;
    else message.textContent = `${label(game.turn)} 차례예요. 둘 수 있는 칸을 골라 보세요.`;
  }
  board.addEventListener('keydown', event => { const keys = { ArrowLeft:-1, ArrowRight:1, ArrowUp:-8, ArrowDown:8 }; if (event.key in keys) { event.preventDefault(); const row = Math.floor(focus/8), col = focus%8, d = keys[event.key]; if (!((d===-1&&col===0)||(d===1&&col===7)||(d===-8&&row===0)||(d===8&&row===7))) { focus += d; render(); board.children[focus].focus(); } } else if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); const next = play(game, focus); if (next !== game) { game=next; render(); } } });
  document.querySelector('#reset').addEventListener('click', () => { game = createGame(); focus = 19; render(); }); render();
})();
