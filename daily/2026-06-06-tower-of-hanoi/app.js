(() => {
  const logic = window.HanoiLogic;
  const board = document.getElementById('board');
  const statusEl = document.getElementById('status');
  const movesEl = document.getElementById('moves');
  const messageEl = document.getElementById('message');
  const diskCountSelect = document.getElementById('disk-count');
  const resetButton = document.getElementById('reset');

  let game = logic.createGame(Number(diskCountSelect.value));

  function pegName(index) {
    return `${index + 1}번 기둥`;
  }

  function render() {
    board.innerHTML = '';
    statusEl.textContent = logic.statusText(game);
    movesEl.textContent = logic.moveCountText(game);
    messageEl.textContent = game.message;

    game.pegs.forEach((peg, pegIndex) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'peg';
      button.dataset.peg = String(pegIndex);
      button.setAttribute('aria-label', `${pegName(pegIndex)} 원반 ${peg.length}개`);
      if (game.selectedPeg === pegIndex) button.classList.add('selected');
      if (game.status === 'won') button.disabled = true;

      const rod = document.createElement('span');
      rod.className = 'rod';
      button.appendChild(rod);

      const diskStack = document.createElement('span');
      diskStack.className = 'disk-stack';
      peg.forEach((disk) => {
        const diskEl = document.createElement('span');
        diskEl.className = 'disk';
        diskEl.style.setProperty('--disk-width', `${38 + disk * 14}%`);
        diskEl.textContent = `${disk}`;
        diskStack.appendChild(diskEl);
      });
      button.appendChild(diskStack);

      const label = document.createElement('span');
      label.className = 'peg-label';
      label.textContent = pegName(pegIndex);
      button.appendChild(label);

      button.addEventListener('click', () => handlePegClick(pegIndex));
      board.appendChild(button);
    });
  }

  function handlePegClick(pegIndex) {
    if (game.status === 'won') return;

    if (game.selectedPeg === null) {
      if (game.pegs[pegIndex].length === 0) {
        game = { ...game, message: '비어 있지 않은 기둥을 먼저 고르세요.' };
      } else {
        game = { ...game, selectedPeg: pegIndex, message: `${pegName(pegIndex)}에서 옮길 곳을 고르세요.` };
      }
      render();
      return;
    }

    if (game.selectedPeg === pegIndex) {
      game = { ...game, selectedPeg: null, message: '선택을 취소했습니다.' };
      render();
      return;
    }

    if (!logic.canMove(game, game.selectedPeg, pegIndex)) {
      game = { ...game, selectedPeg: null, message: '큰 원반은 작은 원반 위에 올릴 수 없습니다.' };
      render();
      return;
    }

    game = logic.moveDisk(game, game.selectedPeg, pegIndex);
    render();
  }

  function resetGame() {
    game = logic.createGame(Number(diskCountSelect.value));
    render();
  }

  resetButton.addEventListener('click', resetGame);
  diskCountSelect.addEventListener('change', resetGame);

  render();
})();
