(() => {
  const board = document.querySelector('#board');
  const message = document.querySelector('#message');
  const turnDot = document.querySelector('#turn-dot');
  const reset = document.querySelector('#reset');
  const names = { white: '흰말', black: '검은말' };
  let state = Shisima.createState();
  let selected = null;

  function render(notice = '') {
    const winner = Shisima.getWinner(state);
    const status = Shisima.getStatus(state);
    const targets = selected === null ? [] : Shisima.getDestinations(state, selected);
    turnDot.className = `dot ${state.turn}`;
    message.textContent = notice || (winner ? `${names[winner]}의 승리입니다!` : status === 'drawn' ? '같은 판이 세 번 나와 무승부입니다.' : `${names[state.turn]} 차례 · 움직일 말을 고르세요`);
    board.innerHTML = '';
    state.board.forEach((piece, index) => {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = `cell${selected === index ? ' selected' : ''}${targets.includes(index) ? ' target' : ''}`;
      cell.disabled = status !== 'playing';
      cell.setAttribute('aria-label', piece ? names[piece] : '빈 점');
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
      else { state = Shisima.move(state, selected, index); selected = null; }
    } catch (error) { selected = null; notice = error.message; }
    render(notice);
  }

  reset.addEventListener('click', () => { state = Shisima.createState(); selected = null; render(); });
  render();
})();
