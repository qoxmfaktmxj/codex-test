(() => {
  const logic = window.lilyPylos; let game = logic.createGame(), selected = null;
  const board = document.querySelector('#board'), status = document.querySelector('#status');
  const colorName = color => color === 'jade' ? '옥빛' : '산호';
  function render() {
    board.innerHTML = ''; const available = logic.availableSpots(game);
    game.board.forEach((sphere, index) => { const movable = sphere === game.turn && logic.isFree(game.board, index); const enabled = game.status === 'playing' && (game.phase === 'reclaim' ? movable : available.includes(index) || movable); const button = document.createElement('button'); button.type = 'button'; button.className = `spot layer-${index < 16 ? 0 : index < 25 ? 1 : index < 29 ? 2 : 3}${sphere ? ` ${sphere}` : ''}${available.includes(index) && game.phase === 'place' ? ' open' : ''}${selected === index ? ' selected' : ''}`; button.disabled = !enabled; button.setAttribute('aria-label', sphere ? `${colorName(sphere)} 구슬` : `빈 받침 ${index + 1}`); button.addEventListener('click', () => { if (game.phase === 'reclaim') game = logic.reclaimSphere(game, index); else if (selected !== null && !sphere) { game = logic.moveSphere(game, selected, index); selected = null; } else if (movable) selected = selected === index ? null : index; else game = logic.placeSphere(game, index); render(); }); board.append(button); });
    document.querySelector('#jade-count').textContent = game.remaining.jade; document.querySelector('#coral-count').textContent = game.remaining.coral;
    status.textContent = game.status === 'won' ? `${colorName(game.winner)} 구슬이 온실 꼭대기를 완성했습니다!` : game.phase === 'reclaim' ? `${colorName(game.turn)} 네모 완성! 자유 구슬을 최대 두 개 되가져오세요` : selected !== null ? '올릴 빈 받침을 고르세요' : `${colorName(game.turn)} 구슬 차례입니다`;
    document.body.dataset.turn = game.turn;
  }
  document.querySelector('#reset').addEventListener('click', () => { game = logic.reset(); selected = null; render(); });
  window.addEventListener('keydown', event => { if (event.key.toLowerCase() === 'r') { game = logic.reset(); selected = null; render(); } }); render();
})();
