(() => {
  const board = document.querySelector('#board');
  const message = document.querySelector('#message');
  const reset = document.querySelector('#reset');
  let state = Yote.createState();
  let selected = null;
  const name = (player) => player === 'blue' ? '파랑' : '주황';

  function render(notice = '') {
    const status = Yote.getStatus(state);
    const phase = Yote.getPhase(state);
    const winner = status.endsWith('-won') ? status.replace('-won', '') : null;
    message.textContent = notice || (winner ? `${name(winner)} 플레이어가 이겼습니다!` : status.endsWith('-remove') ? `${name(state.turn)}: 상대 말 하나를 더 골라 치우세요.` : `${name(state.turn)} 차례: ${phase === 'placing' ? '빈 칸에 말을 놓으세요.' : '내 말을 골라 움직이거나 뛰어넘으세요.'}`);
    board.innerHTML = '';
    state.board.forEach((piece, index) => {
      const spot = document.createElement('button');
      spot.type = 'button';
      spot.className = `spot ${piece || 'empty'}${selected === index ? ' selected' : ''}`;
      spot.disabled = Boolean(winner);
      spot.setAttribute('aria-label', piece ? `${name(piece)} 말` : '빈 칸');
      if (piece) spot.innerHTML = `<span class="piece ${piece}"></span>`;
      spot.addEventListener('click', () => select(index));
      board.appendChild(spot);
    });
  }

  function select(index) {
    let notice = '';
    try {
      const status = Yote.getStatus(state);
      if (status.endsWith('-remove')) { state = Yote.remove(state, index); selected = null; }
      else if (Yote.getPhase(state) === 'placing') state = Yote.place(state, index);
      else if (selected === null) {
        if (state.board[index] !== state.turn) notice = '움직일 내 말을 고르세요.';
        else selected = index;
      } else if (index === selected) selected = null;
      else {
        const distance = Math.abs(Math.floor(selected / Yote.WIDTH) - Math.floor(index / Yote.WIDTH)) + Math.abs((selected % Yote.WIDTH) - (index % Yote.WIDTH));
        state = distance === 2 ? Yote.capture(state, selected, index) : Yote.move(state, selected, index);
        selected = null;
      }
    } catch (error) { notice = error.message; }
    render(notice);
  }

  reset.addEventListener('click', () => { state = Yote.createState(); selected = null; render(); });
  render();
})();
