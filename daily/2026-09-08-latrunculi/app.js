(() => {
  const board = document.querySelector('#board');
  const message = document.querySelector('#message');
  const turnDot = document.querySelector('#turn-dot');
  const reset = document.querySelector('#reset');
  const names = { white: '상아 말', black: '흑요석 말' };
  let state = Latrunculi.createState();
  let selected = null;

  function render(notice = '') {
    const winner = Latrunculi.getWinner(state);
    const status = Latrunculi.getStatus(state);
    const targets = selected === null ? [] : Latrunculi.getDestinations(state, selected);
    turnDot.className = `dot ${state.turn}`;
    message.textContent = notice || (winner ? `${names[winner]}의 승리입니다!` : status === 'stuck' ? `${names[state.turn]}은(는) 움직일 수 없습니다.` : `${names[state.turn]} 차례 · 움직일 말을 고르세요`);
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
        state = Latrunculi.move(state, selected, index);
        notice = state.captured.length ? '상대 말을 포위해 잡았습니다!' : '';
        selected = null;
      }
    } catch (error) { selected = null; notice = error.message; }
    render(notice);
  }

  reset.addEventListener('click', () => { state = Latrunculi.createState(); selected = null; render(); });
  render();
})();
