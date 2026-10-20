(() => {
  const { categories, createGame, roll, toggleHold, scoreCategory, valueFor } = YahtzeeLogic;
  const diceEl = document.querySelector('#dice'), scoresEl = document.querySelector('#scores'), rollButton = document.querySelector('#roll'), statusEl = document.querySelector('#status'), totalEl = document.querySelector('#total');
  let game = createGame(Math.random);
  const total = () => Object.values(game.scores).reduce((sum, score) => sum + (score || 0), 0);
  function render() {
    diceEl.innerHTML = '';
    game.dice.forEach((die, index) => {
      const button = document.createElement('button'); button.className = `die ${game.held[index] ? 'held' : ''}`; button.type = 'button'; button.dataset.value = die; button.setAttribute('aria-label', `${die} 눈 주사위 ${game.held[index] ? '고정 해제' : '고정'}`); button.innerHTML = `<i></i><i></i><i></i><i></i><i></i><i></i>`;
      button.addEventListener('click', () => { game = toggleHold(game, index); render(); }); diceEl.append(button);
    });
    statusEl.textContent = game.status === '끝' ? `인쇄 완료 · 최종 ${total()}점` : `${game.round}번째 행 · 남은 굴림 ${game.rollsLeft}회`;
    rollButton.disabled = game.rollsLeft === 0 || game.status === '끝'; rollButton.querySelector('span').textContent = game.rollsLeft;
    scoresEl.innerHTML = '';
    categories.forEach(category => {
      const button = document.createElement('button'); const score = game.scores[category]; button.type = 'button'; button.className = 'score'; button.disabled = score !== null || game.status === '끝'; button.innerHTML = `<span>${category}</span><b>${score === null ? `${valueFor(game.dice, category)}점 찍기` : `${score}점`}</b>`;
      button.addEventListener('click', () => { game = scoreCategory(game, category); render(); }); scoresEl.append(button);
    });
    totalEl.textContent = `합계 ${total()}점`;
  }
  rollButton.addEventListener('click', () => { game = roll(game, Math.random); render(); });
  document.querySelector('#restart').addEventListener('click', () => { game = createGame(Math.random); render(); });
  addEventListener('keydown', event => { if (event.code === 'Space' && !event.repeat) { event.preventDefault(); game = roll(game, Math.random); render(); } });
  render();
})();
