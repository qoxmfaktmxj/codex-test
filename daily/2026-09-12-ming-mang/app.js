(() => {
  const board = document.querySelector('#board');
  const message = document.querySelector('#message');
  const turnDot = document.querySelector('#turn-dot');
  const redCount = document.querySelector('#red-count');
  const blueCount = document.querySelector('#blue-count');
  const reset = document.querySelector('#reset');
  const names = { red: '붉은', blue: '푸른' };
  let state = MingMang.createState();
  let selected = null;

  function render(notice = '') {
    const winner = MingMang.getWinner(state);
    const targets = selected === null || winner ? [] : MingMang.getLegalMoves(state).filter((move) => move.from === selected).map((move) => move.to);
    turnDot.className = `dot ${state.turn}`;
    message.textContent = notice || (winner ? `${names[winner]} 말의 승리입니다!` : selected === null ? `${names[state.turn]} 말을 고르세요.` : '빛나는 빈칸으로 움직이세요.');
    redCount.textContent = state.captures.red;
    blueCount.textContent = state.captures.blue;
    board.innerHTML = '';
    state.board.forEach((piece, index) => {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.disabled = Boolean(winner);
      cell.className = `cell${selected === index ? ' selected' : ''}${targets.includes(index) ? ' target' : ''}`;
      cell.setAttribute('aria-label', piece ? `${names[piece]} 말` : '빈칸');
      if (piece) cell.innerHTML = `<i class="piece ${piece}"></i>`;
      cell.addEventListener('click', () => choose(index));
      board.appendChild(cell);
    });
  }

  function choose(index) {
    if (state.board[index] === state.turn) { selected = selected === index ? null : index; render(); return; }
    if (selected === null) { render('내 말을 먼저 고르세요.'); return; }
    try { state = MingMang.play(state, { from: selected, to: index }); selected = null; render(); }
    catch (error) { selected = null; render(error.message); }
  }

  reset.addEventListener('click', () => { state = MingMang.createState(); selected = null; render(); });
  render();
})();
