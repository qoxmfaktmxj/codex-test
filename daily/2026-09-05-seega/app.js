(() => {
  const board = document.querySelector('#board');
  const message = document.querySelector('#message');
  const turnDot = document.querySelector('#turn-dot');
  const reset = document.querySelector('#reset');
  const names = { sand: '모래', ink: '먹빛' };
  let state = Seega.createState();
  let selected = null;

  function render(notice = '') {
    const status = Seega.getStatus(state);
    const winner = Seega.getWinner(state);
    const targets = selected === null ? [] : Seega.getDestinations(state, selected);
    turnDot.className = `dot ${state.turn}`;
    message.textContent = notice || (winner ? `${names[winner]}이(가) 승리했습니다!` : status === 'stuck' ? `${names[state.turn]}은(는) 움직일 수 없습니다. 상대가 이겼습니다.` : status === 'placing' ? `${names[state.turn]} 차례 · 말 두 개씩 놓으세요 (${state.placed[state.turn] + 1}/12)` : state.forceCenter ? `${names[state.turn]} 차례 · 첫 말은 가운데로 움직이세요` : `${names[state.turn]} 차례 · 말을 움직이세요`);
    board.innerHTML = '';
    state.board.forEach((piece, index) => {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = `cell${index === Seega.CENTER ? ' center' : ''}${selected === index ? ' selected' : ''}${targets.includes(index) ? ' target' : ''}`;
      cell.disabled = Boolean(winner) || status === 'stuck';
      cell.setAttribute('aria-label', piece ? `${names[piece]} 말` : index === Seega.CENTER ? '가운데 안전 칸' : '빈 칸');
      if (piece) cell.innerHTML = `<i class="piece ${piece}"></i>`;
      else if (index === Seega.CENTER) cell.innerHTML = '<i class="center-mark">◎</i>';
      cell.addEventListener('click', () => choose(index));
      board.appendChild(cell);
    });
  }

  function choose(index) {
    let notice = '';
    try {
      if (state.phase === 'placing') state = Seega.place(state, index);
      else if (selected === null) {
        if (state.board[index] !== state.turn) notice = '움직일 내 말을 고르세요.';
        else selected = index;
      } else if (selected === index) selected = null;
      else { state = Seega.move(state, selected, index); selected = null; }
    } catch (error) { selected = null; notice = error.message; }
    render(notice);
  }

  reset.addEventListener('click', () => { state = Seega.createState(); selected = null; render(); });
  render();
})();
