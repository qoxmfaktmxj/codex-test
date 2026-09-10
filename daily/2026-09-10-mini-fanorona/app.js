(() => {
  const board = document.querySelector('#board');
  const message = document.querySelector('#message');
  const turnDot = document.querySelector('#turn-dot');
  const choices = document.querySelector('#capture-choice');
  const reset = document.querySelector('#reset');
  const names = { white: '흰 말', black: '검은 말' };
  const captureNames = { approach: '다가가며 잡기', withdrawal: '물러나며 잡기' };
  let state = MiniFanorona.createState();
  let selected = null;
  let pending = [];

  function render(notice = '') {
    const winner = MiniFanorona.getWinner(state);
    const status = MiniFanorona.getStatus(state);
    const moves = status === 'playing' ? MiniFanorona.getLegalMoves(state) : [];
    const targets = selected === null || pending.length ? [] : moves.filter((move) => move.from === selected).map((move) => move.to);
    turnDot.className = `dot ${state.turn}`;
    message.textContent = notice || (winner ? `${names[winner]}의 승리입니다!` : pending.length ? '잡는 방법을 고르세요.' : state.chainFrom !== null ? '같은 말로 연속해서 잡으세요.' : `${names[state.turn]} 차례 · ${moves.some((move) => move.mode !== 'quiet') ? '반드시 잡아야 합니다.' : '움직일 말을 고르세요.'}`);
    board.innerHTML = '';
    state.board.forEach((piece, index) => {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = `cell${selected === index ? ' selected' : ''}${targets.includes(index) ? ' target' : ''}`;
      cell.disabled = status !== 'playing' || pending.length > 0;
      cell.setAttribute('aria-label', piece ? names[piece] : '빈 점');
      if (piece) cell.innerHTML = `<i class="piece ${piece}"></i>`;
      cell.addEventListener('click', () => choose(index));
      board.appendChild(cell);
    });
    choices.innerHTML = '';
    pending.forEach((move) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = `${captureNames[move.mode]} · ${move.captured.length}개 잡기`;
      button.addEventListener('click', () => play(move));
      choices.appendChild(button);
    });
  }

  function play(move) {
    try {
      state = MiniFanorona.move(state, move.from, move.to, move.mode);
      selected = state.chainFrom;
      pending = [];
      render();
    } catch (error) { selected = null; pending = []; render(error.message); }
  }

  function choose(index) {
    const moves = MiniFanorona.getLegalMoves(state);
    let notice = '';
    if (selected === null) {
      if (state.board[index] !== state.turn) notice = '움직일 내 말을 고르세요.';
      else selected = index;
    } else if (selected === index) selected = null;
    else {
      const candidates = moves.filter((move) => move.from === selected && move.to === index);
      if (!candidates.length) { selected = null; notice = '갈 수 있는 빈 점을 고르세요.'; }
      else if (candidates.length === 1) return play(candidates[0]);
      else pending = candidates;
    }
    render(notice);
  }

  reset.addEventListener('click', () => { state = MiniFanorona.createState(); selected = null; pending = []; render(); });
  render();
})();
