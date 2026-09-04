(() => {
  const board = document.querySelector('#board');
  const message = document.querySelector('#message');
  const moves = document.querySelector('#moves');
  const reset = document.querySelector('#reset');
  let state = MiniHalma.createState();
  let selected = null;

  const playerName = { blue: '파랑', coral: '산호' };

  function render(notice = '') {
    const winner = MiniHalma.getWinner(state);
    const status = MiniHalma.getStatus(state);
    const targets = selected === null ? [] : MiniHalma.getDestinations(state, selected).map((move) => move.to);
    message.textContent = notice || (winner ? `${playerName[winner]}이(가) 건너편 캠프를 완성했습니다!` : status === 'stuck' ? '움직일 수 있는 말이 없습니다. 새로 시작해 보세요.' : `${playerName[state.turn]} 차례입니다. 움직일 말을 고르세요.`);
    moves.textContent = state.moves;
    board.innerHTML = '';
    state.board.forEach((piece, index) => {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = `cell ${piece || 'empty'}${selected === index ? ' selected' : ''}${targets.includes(index) ? ' target' : ''}`;
      cell.disabled = status !== 'playing';
      cell.setAttribute('aria-label', piece ? `${playerName[piece]} 말` : '빈 칸');
      if (piece) cell.innerHTML = `<i class="piece ${piece}"></i>`;
      cell.addEventListener('click', () => choose(index));
      board.appendChild(cell);
    });
  }

  function choose(index) {
    let notice = '';
    try {
      if (selected === null) {
        if (state.board[index] !== state.turn) notice = '내 말을 고르세요.';
        else selected = index;
      } else if (selected === index) selected = null;
      else {
        state = MiniHalma.move(state, selected, index);
        selected = null;
      }
    } catch (error) { notice = error.message; selected = null; }
    render(notice);
  }

  reset.addEventListener('click', () => { state = MiniHalma.createState(); selected = null; render(); });
  render();
})();
