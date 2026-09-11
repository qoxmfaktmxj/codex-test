(() => {
  const board = document.querySelector('#board');
  const message = document.querySelector('#message');
  const turnDot = document.querySelector('#turn-dot');
  const sunCount = document.querySelector('#sun-count');
  const moonCount = document.querySelector('#moon-count');
  const reset = document.querySelector('#reset');
  const names = { sun: '해', moon: '달' };
  let state = Awithlaknannai.createState();
  let selected = null;

  function render(notice = '') {
    const winner = Awithlaknannai.getWinner(state);
    const moves = winner ? [] : Awithlaknannai.getLegalMoves(state);
    const targets = state.pendingCapture ? moves.map((move) => move.target) : selected === null ? [] : moves.filter((move) => move.type === 'move' && move.from === selected).map((move) => move.to);
    turnDot.className = `dot ${state.turn}`;
    message.textContent = notice || (winner ? `${names[winner]}의 승리입니다!` : state.pendingCapture ? '잡을 상대 말 하나를 고르세요.' : state.phase === 'place' ? `${names[state.turn]} 말을 빈칸에 놓으세요. (${state.reserve[state.turn]}개 남음)` : selected === null ? `${names[state.turn]} 말을 고르세요.` : '인접한 빈칸으로 움직이세요.');
    sunCount.textContent = state.board.filter((piece) => piece === 'sun').length + state.reserve.sun;
    moonCount.textContent = state.board.filter((piece) => piece === 'moon').length + state.reserve.moon;
    board.innerHTML = '';
    state.board.forEach((piece, index) => {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = `cell${selected === index ? ' selected' : ''}${targets.includes(index) ? ' target' : ''}`;
      cell.disabled = Boolean(winner);
      cell.setAttribute('aria-label', piece ? `${names[piece]} 말` : '빈칸');
      if (piece) cell.innerHTML = `<i class="piece ${piece}"></i>`;
      cell.addEventListener('click', () => choose(index));
      board.appendChild(cell);
    });
  }

  function choose(index) {
    if (state.pendingCapture) {
      try { state = Awithlaknannai.play(state, { type: 'capture', target: index }); render(); }
      catch (error) { render(error.message); }
      return;
    }
    if (state.phase === 'place') {
      try { state = Awithlaknannai.play(state, { type: 'place', to: index }); render(); }
      catch (error) { render(error.message); }
      return;
    }
    if (selected === null) { selected = state.board[index] === state.turn ? index : null; render(state.board[index] === state.turn ? '' : '내 말을 고르세요.'); return; }
    if (selected === index) { selected = null; render(); return; }
    try { state = Awithlaknannai.play(state, { type: 'move', from: selected, to: index }); selected = null; render(); }
    catch (error) { selected = null; render(error.message); }
  }

  reset.addEventListener('click', () => { state = Awithlaknannai.createState(); selected = null; render(); });
  render();
})();
