(() => {
  const { createGame, rollSticks, movePiece, resetGame } = window.UrClayRaceLogic;
  let game = createGame();
  const board = document.querySelector('#board');
  const path = Array.from({ length: 14 }, (_, i) => i);
  const cols = [0,1,2,3,3,4,5,6,7,6,5,4,3,4], rows = [0,0,0,0,1,1,1,1,1,1,1,1,2,2];
  const render = () => {
    document.querySelector('#message').textContent = game.message;
    document.querySelector('#indigo-score').textContent = game.finished.indigo;
    document.querySelector('#terracotta-score').textContent = game.finished.terracotta;
    document.querySelector('#steps').textContent = game.steps;
    document.querySelector('#roll').disabled = game.phase !== '던지기' || !!game.winner;
    document.querySelector('#sticks').innerHTML = (game.dice.length ? game.dice : [0,0,0,0]).map(v => '<i class="' + (v ? 'marked' : '') + '"></i>').join('');
    board.innerHTML = '';
    path.forEach(n => { const cell = document.createElement('div'); cell.className = 'cell ' + ([3,7,12].includes(n) ? 'rosette ' : '') + 'p' + n; board.append(cell); });
    [['indigo','남빛'], ['terracotta','토빛']].forEach(([key, label]) => game.pieces[key].forEach((pos, index) => {
      if (pos > 13) return;
      const piece = document.createElement('button'); piece.type = 'button';
      piece.className = 'piece ' + key + (pos < 0 ? ' start' : '');
      piece.textContent = label + ' 말 ' + (index + 1);
      piece.setAttribute('aria-label', label + ' 말 ' + (index + 1) + (pos < 0 ? ' · 출발 대기' : '') + (game.phase === '이동' && game.turn === label ? ' · ' + game.steps + '칸 이동' : ''));
      piece.disabled = game.phase !== '이동' || game.turn !== label || game.winner;
      piece.onclick = () => { game = movePiece(game, index); render(); };
      piece.style.setProperty('--x', pos < 0 ? (key === 'indigo' ? .1 : 7.9) : cols[pos]);
      piece.style.setProperty('--y', pos < 0 ? index / 3 : rows[pos]);
      piece.style.setProperty('--stack', pos < 0 ? 0 : game.pieces[key].slice(0,index).filter(v => v === pos).length);
      board.append(piece);
    }));
  };
  document.querySelector('#roll').onclick = () => { game = rollSticks(game); render(); };
  document.querySelector('#reset').onclick = () => { game = resetGame(); render(); };
  render();
})();
