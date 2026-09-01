(() => {
  const board = document.querySelector('#board');
  const message = document.querySelector('#message');
  const reset = document.querySelector('#reset');
  let state = Dara.createState();
  let chosen = null;
  const name = (player) => player === 'blue' ? '파랑' : '주황';

  function render(notice = '') {
    const status = Dara.getStatus(state);
    const phase = Dara.getPhase(state);
    const winner = status.endsWith('-won') ? status.replace('-won', '') : null;
    message.textContent = notice || (winner ? `${name(winner)} 플레이어가 이겼습니다!` : status.endsWith('-capture') ? `${name(state.turn)}: 상대 말 하나를 골라 잡으세요.` : `${name(state.turn)} 차례: ${phase === 'placing' ? '빈 칸에 말을 놓으세요.' : '내 말을 골라 이웃 빈 칸으로 움직이세요.'}`);
    board.innerHTML = '';
    state.board.forEach((piece, index) => {
      const spot = document.createElement('button');
      spot.type = 'button';
      spot.className = `spot ${piece || 'empty'}${chosen === index ? ' chosen' : ''}`;
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
      const status = Dara.getStatus(state);
      if (status.endsWith('-capture')) { state = Dara.capture(state, index); chosen = null; }
      else if (Dara.getPhase(state) === 'placing') state = Dara.place(state, index);
      else if (chosen === null) {
        if (state.board[index] !== state.turn) notice = '움직일 내 말을 고르세요.';
        else chosen = index;
      } else if (index === chosen) chosen = null;
      else { state = Dara.move(state, chosen, index); chosen = null; }
    } catch (error) { notice = error.message; }
    render(notice);
  }

  reset.addEventListener('click', () => { state = Dara.createState(); chosen = null; render(); });
  render();
})();
