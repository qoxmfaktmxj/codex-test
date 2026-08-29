(() => {
  const boardElement = document.querySelector('#board');
  const message = document.querySelector('#message');
  const reset = document.querySelector('#reset');
  const positions = [[8,8],[50,8],[92,8],[92,50],[92,92],[50,92],[8,92],[8,50],[28,28],[50,28],[72,28],[72,50],[72,72],[50,72],[28,72],[28,50]];
  let state = SixMensMorris.createState();
  let selected = null;

  function name(player) { return player === 'black' ? '검은 말' : '흰 말'; }
  function currentPhase() { return state.toPlace[state.turn] > 0 ? 'place' : 'move'; }
  function render() {
    const status = SixMensMorris.getStatus(state);
    if (status !== 'playing') message.textContent = `${name(status === 'black-won' ? 'black' : 'white')}이 이겼습니다!`;
    else if (state.pendingRemoval) message.textContent = `${name(state.turn)}이 줄을 만들었습니다. 없앨 상대 말을 고르세요.`;
    else if (currentPhase() === 'place') message.textContent = `${name(state.turn)} 차례: 남은 말 ${state.toPlace[state.turn]}개를 빈 점에 놓으세요.`;
    else message.textContent = `${name(state.turn)} 차례: 말을 고른 뒤 연결된 빈 점을 고르세요.`;
    boardElement.innerHTML = '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M8 8H92V92H8ZM28 28H72V72H28ZM50 8V28M92 50H72M50 92V72M8 50H28" /></svg>';
    state.board.forEach((piece, index) => {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = `spot${selected === index ? ' selected' : ''}`;
      cell.style.left = `${positions[index][0]}%`;
      cell.style.top = `${positions[index][1]}%`;
      cell.setAttribute('aria-label', `${index + 1}번 점${piece ? ` ${name(piece)}` : ' 빈 점'}`);
      if (piece) cell.innerHTML = `<span class="piece ${piece}"></span>`;
      cell.disabled = status !== 'playing';
      cell.addEventListener('click', () => choose(index));
      boardElement.appendChild(cell);
    });
  }

  function choose(index) {
    if (state.pendingRemoval || currentPhase() === 'place') {
      try { state = SixMensMorris.play(state, index); selected = null; } catch (error) { message.textContent = error.message; }
      render(); return;
    }
    if (selected === null) {
      if (state.board[index] !== state.turn) { message.textContent = '움직일 내 말을 선택하세요.'; return; }
      selected = index;
    } else if (selected === index) selected = null;
    else if (state.board[index] === state.turn) selected = index;
    else {
      try { state = SixMensMorris.play(state, selected, index); selected = null; } catch (error) { message.textContent = error.message; return; }
    }
    render();
  }
  reset.addEventListener('click', () => { state = SixMensMorris.createState(); selected = null; render(); });
  render();
})();
