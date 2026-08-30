(() => {
  const message = document.querySelector('#message');
  const reset = document.querySelector('#reset');
  const splitButton = document.querySelector('#split');
  const firstSplit = document.querySelector('#first-split');
  const secondSplit = document.querySelector('#second-split');
  let state = Chopsticks.createState();
  let selected = null;

  function name(player) { return player === 'blue' ? '파랑' : '주황'; }
  function renderHands(player) {
    const element = document.querySelector(`#${player}-hands`);
    element.innerHTML = '';
    state.hands[player].forEach((count, index) => {
      const hand = document.createElement('button');
      hand.type = 'button';
      hand.className = `hand ${count === 0 ? 'dead' : ''}${selected === index && player === state.turn ? ' selected' : ''}`;
      hand.disabled = Chopsticks.getStatus(state) !== 'playing';
      hand.setAttribute('aria-label', `${name(player)} ${index === 0 ? '왼손' : '오른손'} 손가락 ${count}개`);
      hand.innerHTML = `<span class="palm">${count}</span><span class="fingers">${'│'.repeat(count) || '—'}</span>`;
      hand.addEventListener('click', () => choose(player, index));
      element.appendChild(hand);
    });
  }
  function render(notice = '') {
    const status = Chopsticks.getStatus(state);
    message.textContent = notice || (status === 'playing' ? `${name(state.turn)} 차례: 내 손 하나를 고른 뒤 상대 손을 누르세요.` : `${name(status === 'blue-won' ? 'blue' : 'orange')} 플레이어가 이겼습니다!`);
    renderHands('orange'); renderHands('blue');
    splitButton.disabled = status !== 'playing';
  }
  function choose(player, index) {
    let notice = '';
    if (player === state.turn) {
      if (state.hands[player][index] === 0) notice = '0이 된 손은 사용할 수 없습니다.';
      else selected = selected === index ? null : index;
    } else if (selected === null) notice = '먼저 내 손 하나를 고르세요.';
    else {
      try { state = Chopsticks.hit(state, selected, index); selected = null; } catch (error) { notice = error.message; }
    }
    render(notice);
  }
  splitButton.addEventListener('click', () => {
    let notice = '';
    try { state = Chopsticks.split(state, Number(firstSplit.value), Number(secondSplit.value)); selected = null; } catch (error) { notice = error.message; }
    render(notice);
  });
  reset.addEventListener('click', () => { state = Chopsticks.createState(); selected = null; render(); });
  render();
})();
