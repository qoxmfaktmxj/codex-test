(() => {
  const board = document.querySelector('#board'), moves = document.querySelector('#moves'), message = document.querySelector('#message');
  let game = window.rainLab.createGame();
  function draw() {
    board.innerHTML = '';
    game.lights.forEach((light, index) => { const cell = document.createElement('button'); cell.type = 'button'; cell.className = `drop ${light ? 'lit' : ''}`; cell.setAttribute('role', 'gridcell'); cell.setAttribute('aria-label', `${Math.floor(index / game.size) + 1}행 ${index % game.size + 1}열 ${light ? '켜짐' : '꺼짐'}`); cell.addEventListener('click', () => { game = window.rainLab.press(game, index); draw(); }); board.append(cell); });
    moves.textContent = game.moves; message.textContent = game.status === 'won' ? `${game.moves}번 만에 창문이 고요해졌습니다.` : '빛나는 물방울을 눌러 모든 빛을 끄세요.';
  }
  document.querySelector('#reset').addEventListener('click', () => { game = window.rainLab.createGame(); draw(); }); draw();
})();
