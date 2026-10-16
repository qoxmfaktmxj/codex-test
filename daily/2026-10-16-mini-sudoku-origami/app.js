(() => {
  const { createGame, setCell, checkGame, reset } = window.origamiSudoku;
  let game = createGame(), selected = null;
  const board = document.querySelector('#board'), message = document.querySelector('#message');
  function draw(restoreFocus = false) {
    board.innerHTML = '';
    game.board.forEach((value, index) => {
      const cell = document.createElement('button');
      const clue = game.clues.includes(index);
      cell.className = `cell ${clue ? 'clue' : ''} ${selected === index ? 'selected' : ''}`;
      cell.textContent = value || '·'; cell.setAttribute('aria-label', `${Math.floor(index / 4) + 1}행 ${index % 4 + 1}열 ${value || '빈 칸'}`);
      cell.disabled = clue || game.status === 'won'; cell.setAttribute('aria-pressed', String(selected === index));
      cell.onclick = () => { selected = index; message.textContent = '아래에서 1부터 4까지 고르세요.'; draw(true); };
      board.append(cell);
    });
    document.querySelectorAll('[data-number]').forEach(button => button.disabled = selected === null || game.status === 'won');
    const result = checkGame(game);
    if (game.status === 'won') message.textContent = '완성! 네 겹의 종이가 정확히 맞물렸어요.';
    else if (!result.valid) message.textContent = '같은 줄 또는 작은 칸에 숫자가 겹쳤어요.';
    if (restoreFocus && selected !== null) board.querySelector('.selected')?.focus();
  }
  document.querySelectorAll('[data-number]').forEach(button => button.onclick = () => { if (selected === null) return; game = setCell(game, selected, Number(button.dataset.number)); draw(true); });
  document.querySelector('#reset').onclick = () => { game = reset(); selected = null; message.textContent = '새 종이를 펼쳤어요. 빈 칸을 눌러 시작하세요.'; draw(); };
  draw();
})();
