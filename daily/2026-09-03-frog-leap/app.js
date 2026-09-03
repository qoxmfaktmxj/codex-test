(() => {
  const pond = document.querySelector('#pond');
  const message = document.querySelector('#message');
  const moves = document.querySelector('#moves');
  const reset = document.querySelector('#reset');
  let state = FrogLeap.createState();
  let selected = null;

  function render(notice = '') {
    const status = FrogLeap.getStatus(state);
    const legalMoves = FrogLeap.getMoves(state);
    const destinations = selected === null ? [] : legalMoves.filter((move) => move.from === selected).map((move) => move.to);
    message.textContent = notice || (status === 'won' ? `${state.moves}번 만에 자리를 바꿨습니다!` : status === 'stuck' ? '더는 움직일 수 없습니다. 처음부터 다시 해 보세요.' : selected === null ? '움직일 개구리를 고르세요.' : '빛나는 연잎으로 움직이세요.');
    moves.textContent = state.moves;
    pond.innerHTML = '';
    state.board.forEach((frog, index) => {
      const leaf = document.createElement('button');
      leaf.type = 'button';
      leaf.className = `leaf ${frog || 'empty'}${selected === index ? ' selected' : ''}${destinations.includes(index) ? ' destination' : ''}`;
      leaf.disabled = status !== 'playing';
      leaf.setAttribute('aria-label', frog === 'left' ? '초록 개구리' : frog === 'right' ? '보라 개구리' : '빈 연잎');
      if (frog) leaf.innerHTML = `<span class="frog ${frog}">${frog === 'left' ? '●' : '●'}</span>`;
      leaf.addEventListener('click', () => choose(index));
      pond.appendChild(leaf);
    });
  }

  function choose(index) {
    let notice = '';
    try {
      if (selected === null) {
        if (!state.board[index]) notice = '개구리가 있는 연잎을 고르세요.';
        else selected = index;
      } else if (selected === index) selected = null;
      else {
        state = FrogLeap.move(state, selected, index);
        selected = null;
      }
    } catch (error) { notice = error.message; selected = null; }
    render(notice);
  }

  reset.addEventListener('click', () => { state = FrogLeap.createState(); selected = null; render(); });
  render();
})();
