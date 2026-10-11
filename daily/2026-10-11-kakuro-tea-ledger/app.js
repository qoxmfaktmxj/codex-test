(() => {
  const logic = window.teaLedgerKakuro; let game = logic.createGame(); let selected = 'a1';
  const cells = ['x','x','clue down-12','clue down-18','x','x','clue right-9','a1','a2','clue down-5','x','clue right-15','b1','b2','b3','x','clue right-11','c1','c2','x','x','x','x','x','x'];
  const board = document.querySelector('#board'), status = document.querySelector('#status'), keypad = document.querySelector('#keypad');
  const labels = { 'clue down-12':'↓ 12', 'clue down-18':'↓ 18', 'clue down-5':'↓ 5', 'clue right-9':'→ 9', 'clue right-15':'→ 15', 'clue right-11':'→ 11' };
  const cellLabels = { a1:'가로 합계 9, 세로 합계 12의 첫 칸', a2:'가로 합계 9, 세로 합계 18의 두 번째 칸', b1:'가로 합계 15, 세로 합계 12의 두 번째 칸', b2:'가로 합계 15, 세로 합계 18의 두 번째 칸', b3:'가로 합계 15, 세로 합계 5의 칸', c1:'가로 합계 11, 세로 합계 12의 세 번째 칸', c2:'가로 합계 11, 세로 합계 18의 세 번째 칸' };
  function render() {
    board.innerHTML = ''; cells.forEach(item => { const el = document.createElement(item === 'x' || item.startsWith('clue') ? 'div' : 'button');
      if (item === 'x') el.className = 'block'; else if (item.startsWith('clue')) { el.className = 'clue'; el.textContent = labels[item]; } else { el.className = `cell ${selected === item ? 'selected' : ''}`; el.textContent = game.cells[item] || ''; el.dataset.cell = item; el.setAttribute('aria-label', cellLabels[item]); } board.append(el); });
    const states = Object.keys(logic.groups).map(id => logic.groupState(game, id)); const bad = states.some(s => s.duplicate || s.sum > s.target || (s.complete && s.sum !== s.target));
    status.textContent = logic.isComplete(game) ? '장부 완성!' : bad ? '합계나 중복을 확인하세요' : '장부를 채우는 중'; document.body.classList.toggle('finished', logic.isComplete(game));
    requestAnimationFrame(() => board.querySelector(`[data-cell="${selected}"]`)?.focus());
  }
  function input(digit) { game = logic.enterDigit(game, selected, digit); render(); }
  board.addEventListener('click', event => { if (event.target.dataset.cell) { selected = event.target.dataset.cell; render(); } });
  [1,2,3,4,5,6,7,8,9].forEach(n => { const b = document.createElement('button'); b.textContent = n; b.type = 'button'; b.addEventListener('click', () => input(n)); keypad.append(b); });
  document.querySelector('#erase').addEventListener('click', () => { game = logic.clearCell(game, selected); render(); });
  document.querySelector('#reset').addEventListener('click', () => { game = logic.createGame(); selected = 'a1'; render(); });
  window.addEventListener('keydown', event => { if (/^[1-9]$/.test(event.key)) input(Number(event.key)); if (event.key === 'Backspace') { game = logic.clearCell(game, selected); render(); } }); render();
})();
