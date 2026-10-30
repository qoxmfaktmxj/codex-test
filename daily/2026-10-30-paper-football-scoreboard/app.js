(() => {
  const { createGame, legalMoves, playMove, isGoal, goals } = window.PaperFootballLogic;
  const board = document.querySelector('#board'), moves = document.querySelector('#moves'), status = document.querySelector('#status');
  let game = createGame(), finished = false;
  const render = () => {
    board.innerHTML = '';
    const allowed = new Set(legalMoves(game).map(move => move.to));
    for (let index = 1; index <= 25; index += 1) {
      const dot = document.createElement('button');
      dot.type = 'button'; dot.className = 'dot'; dot.dataset.index = index;
      dot.setAttribute('aria-label', goals.includes(index) ? '골대' : `${index}번 지점`);
      if (goals.includes(index)) dot.classList.add('goal');
      if (game.position === index) dot.classList.add('ball');
      if (!finished && allowed.has(index)) { dot.classList.add('legal'); dot.addEventListener('click', () => moveTo(index)); }
      board.append(dot);
    }
    game.edges.forEach(edge => {
      const line = document.createElement('i');
      const a = edge.from - 1, b = edge.to - 1;
      const ax = (a % 5) * 25 + 12.5, ay = Math.floor(a / 5) * 25 + 12.5;
      const bx = (b % 5) * 25 + 12.5, by = Math.floor(b / 5) * 25 + 12.5;
      const length = Math.hypot(bx - ax, by - ay), angle = Math.atan2(by - ay, bx - ax) * 180 / Math.PI;
      line.className = 'trail'; line.style.cssText = `left:${ax}%;top:${ay}%;width:${length}%;transform:rotate(${angle}deg)`;
      board.append(line);
    });
    moves.textContent = game.moves;
  };
  const moveTo = to => { game = playMove(game, { from: game.position, to }); if (isGoal(game)) { finished = true; status.textContent = '골! 새 경기를 시작해 보세요.'; board.classList.add('scored'); } else status.textContent = '공이 이동했습니다. 다음 선을 고르세요.'; render(); };
  document.querySelector('#reset').addEventListener('click', () => { game = createGame(); finished = false; board.classList.remove('scored'); status.textContent = '가운데에서 킥오프!'; render(); });
  render();
})();
