(() => {
  const board = document.querySelector('#board');
  const message = document.querySelector('#message');
  const turnDot = document.querySelector('#turn-dot');
  const reset = document.querySelector('#reset');
  const names = { white: '흰 돌', black: '검은 돌' };
  let state = UmulGonu.createState();
  let selected = null;

  function render(notice = '') {
    const winner = UmulGonu.getWinner(state);
    const status = UmulGonu.getStatus(state);
    const targets = selected === null ? [] : UmulGonu.getDestinations(state, selected);
    turnDot.className = `dot ${state.turn}`;
    message.textContent = notice || (winner ? `${names[winner]}의 승리입니다!` : status === 'stuck' ? `${names[state.turn]}은(는) 움직일 곳이 없습니다.` : `${names[state.turn]} 차례 · 움직일 말을 고르세요`);
    board.innerHTML = '';
    state.board.forEach((piece, index) => {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = `cell${selected === index ? ' selected' : ''}${targets.includes(index) ? ' target' : ''}`;
      cell.disabled = status !== 'playing';
      cell.setAttribute('aria-label', piece ? names[piece] : '빈 칸');
      if (piece) cell.innerHTML = `<i class="piece ${piece}"></i>`;
      cell.addEventListener('click', () => choose(index));
      board.appendChild(cell);
    });
  }

  function choose(index) {
    let notice = '';
    try {
      if (selected === null) {
        if (state.board[index] !== state.turn) notice = '움직일 내 말을 고르세요.';
        else selected = index;
      } else if (selected === index) selected = null;
      else {
        state = UmulGonu.move(state, selected, index);
        selected = null;
      }
    } catch (error) { selected = null; notice = error.message; }
    render(notice);
  }

  reset.addEventListener('click', () => { state = UmulGonu.createState(); selected = null; render(); });
  render();
})();
