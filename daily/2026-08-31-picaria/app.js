(() => {
  const board = document.querySelector('#board');
  const message = document.querySelector('#message');
  const reset = document.querySelector('#reset');
  let state = Picaria.createState();
  let chosen = null;
  const name = (player) => player === 'blue' ? '파랑' : '주황';

  function render(notice = '') {
    const status = Picaria.getStatus(state);
    const phase = Picaria.getPhase(state);
    message.textContent = notice || (status === 'playing' ? `${name(state.turn)} 차례: ${phase === 'placing' ? '빈 점에 말을 놓으세요.' : '내 말을 골라 옆 빈 점으로 움직이세요.'}` : `${name(status === 'blue-won' ? 'blue' : 'orange')} 플레이어가 이겼습니다!`);
    board.innerHTML = '<div class="lines" aria-hidden="true"></div>';
    state.board.forEach((piece, index) => {
      const spot = document.createElement('button');
      spot.type = 'button';
      spot.className = `spot ${piece || 'empty'}${chosen === index ? ' chosen' : ''}`;
      spot.disabled = status !== 'playing';
      spot.setAttribute('aria-label', piece ? `${name(piece)} 말` : '빈 점');
      if (piece) spot.innerHTML = `<span class="piece ${piece}"></span>`;
      spot.addEventListener('click', () => select(index));
      board.appendChild(spot);
    });
  }
  function select(index) {
    let notice = '';
    try {
      if (Picaria.getPhase(state) === 'placing') state = Picaria.place(state, index);
      else if (chosen === null) {
        if (state.board[index] !== state.turn) notice = '움직일 내 말을 고르세요.';
        else chosen = index;
      } else if (index === chosen) chosen = null;
      else { state = Picaria.move(state, chosen, index); chosen = null; }
    } catch (error) { notice = error.message; }
    render(notice);
  }
  reset.addEventListener('click', () => { state = Picaria.createState(); chosen = null; render(); });
  render();
})();
