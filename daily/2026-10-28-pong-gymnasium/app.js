(() => {
  const { createGame, movePaddle, step } = PongLogic;
  let game = createGame(), timer;
  const court = document.querySelector('#court'), status = document.querySelector('#status');
  const render = () => {
    court.innerHTML = '';
    for (let y = 0; y < 7; y++) for (let x = 0; x < 9; x++) {
      const cell = document.createElement('div'); cell.className = 'tile';
      if ((x === 0 && y >= game.paddles.left && y <= game.paddles.left + 2) || (x === 8 && y >= game.paddles.right && y <= game.paddles.right + 2)) cell.classList.add('paddle');
      if (x === game.ball.x && y === game.ball.y) cell.classList.add('ball');
      court.append(cell);
    }
    document.querySelector('#left-score').textContent = game.score.left;
    document.querySelector('#right-score').textContent = game.score.right;
    status.textContent = game.winner ? `${game.winner === 'left' ? '왼쪽' : '오른쪽'} 선수 승리! 새 경기를 시작하세요.` : '왼쪽: W/S · 오른쪽: ↑/↓';
  };
  const play = () => { clearInterval(timer); timer = setInterval(() => { game = step(game); render(); if (game.winner) clearInterval(timer); }, 330); };
  const move = (side, amount) => { game = movePaddle(game, side, amount); render(); };
  [['left-up','left',-1],['left-down','left',1],['right-up','right',-1],['right-down','right',1]].forEach(([id, side, amount]) => document.querySelector(`#${id}`).onclick = () => move(side, amount));
  document.querySelector('#reset').onclick = () => { game = createGame(); render(); play(); };
  window.addEventListener('keydown', event => { const keys = { w:['left',-1], s:['left',1], ArrowUp:['right',-1], ArrowDown:['right',1] }; if (keys[event.key]) { event.preventDefault(); move(...keys[event.key]); } });
  render(); play();
})();
