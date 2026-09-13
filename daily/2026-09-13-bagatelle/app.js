(() => {
  const remaining = document.querySelector('#remaining');
  const score = document.querySelector('#score');
  const message = document.querySelector('#message');
  const ball = document.querySelector('#ball');
  const slots = [...document.querySelectorAll('.slot')];
  const reset = document.querySelector('#reset');
  let state = Bagatelle.createState();

  function render(notice = '') {
    const finished = Bagatelle.getStatus(state) === 'finished';
    remaining.textContent = `${state.remaining}개`;
    score.textContent = `${state.score}점`;
    message.textContent = notice || (finished ? `게임 끝! 모두 ${state.score}점을 얻었습니다.` : '점수 칸을 눌러 공을 굴리세요.');
    slots.forEach((slot) => { slot.disabled = finished; });
  }

  function roll(slot) {
    const points = Number(slot.dataset.points);
    try {
      state = Bagatelle.play(state, points);
      ball.style.left = `${slot.offsetLeft + slot.offsetWidth / 2}px`;
      ball.classList.remove('rolling');
      requestAnimationFrame(() => ball.classList.add('rolling'));
      render(`${points}점! 공이 점수 칸에 들어갔습니다.`);
    } catch (error) { render(error.message); }
  }

  slots.forEach((slot) => slot.addEventListener('click', () => roll(slot)));
  reset.addEventListener('click', () => { state = Bagatelle.createState(); ball.classList.remove('rolling'); ball.style.left = '50%'; render(); });
  render();
})();
