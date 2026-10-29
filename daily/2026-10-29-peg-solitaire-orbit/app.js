(() => {
  const { createGame, legalMoves, playMove, remainingPegs, valid } = window.PegLogic;
  const boardEl = document.querySelector('#board');
  const pegsEl = document.querySelector('#pegs');
  const movesEl = document.querySelector('#moves');
  const statusEl = document.querySelector('#status');
  let game = createGame(); let selected = null;
  const render = () => {
    const moves = selected === null ? [] : legalMoves(game, selected);
    boardEl.innerHTML = '';
    game.board.forEach((piece, index) => {
      if (!valid(index)) return;
      const cell = document.createElement('button'); cell.type = 'button'; cell.className = 'hole';
      cell.style.gridArea = `${Math.floor(index / 7) + 1} / ${index % 7 + 1}`;
      const landing = moves.find(move => move.to === index);
      if (piece === 1) { cell.classList.add('peg'); cell.setAttribute('aria-label', `구슬 ${index + 1}`); }
      if (index === selected) cell.classList.add('selected');
      if (landing) { cell.classList.add('target'); cell.setAttribute('aria-label', '착지 가능한 빈 칸'); }
      cell.addEventListener('click', () => choose(index, landing)); boardEl.append(cell);
    });
    pegsEl.textContent = remainingPegs(game); movesEl.textContent = game.moves;
  };
  const choose = (index, landing) => {
    if (landing) { game = playMove(game, landing); selected = null; statusEl.textContent = remainingPegs(game) === 1 ? '관측 성공! 마지막 구슬 하나가 남았습니다.' : '점프 완료. 다음 궤도를 선택하세요.'; render(); return; }
    if (game.board[index] === 1 && legalMoves(game, index).length) { selected = index; statusEl.textContent = '빛나는 빈 칸으로 점프하세요.'; }
    else { selected = null; statusEl.textContent = '이 구슬은 지금 이동할 수 없습니다.'; }
    render();
  };
  document.querySelector('#reset').addEventListener('click', () => { game = createGame(); selected = null; statusEl.textContent = '새 관측을 시작합니다. 가운데는 비어 있습니다.'; render(); });
  render();
})();
