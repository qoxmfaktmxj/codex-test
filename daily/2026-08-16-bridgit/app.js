(() => {
  const SIZE = 7;
  const boardElement = document.querySelector('#board');
  const messageElement = document.querySelector('#message');
  let board = Bridgit.createBoard(SIZE);
  let finished = false;
  let computerThinking = false;
  let computerTimer = null;

  function computerMove() {
    const candidates = [];
    board.forEach((row, rowIndex) => row.forEach((cell, columnIndex) => {
      if (cell === null) candidates.push([rowIndex, columnIndex]);
    }));
    if (!candidates.length) {
      computerThinking = false;
      return;
    }
    candidates.sort(([firstRow, firstColumn], [secondRow, secondColumn]) => {
      const firstDistance = Math.abs(firstRow - (SIZE - 1) / 2) + Math.abs(firstColumn - (SIZE - 1) / 2) / 4;
      const secondDistance = Math.abs(secondRow - (SIZE - 1) / 2) + Math.abs(secondColumn - (SIZE - 1) / 2) / 4;
      return firstDistance - secondDistance;
    });
    const [row, column] = candidates[0];
    board = Bridgit.placeStone(board, row, column, 'blue');
    if (Bridgit.hasConnection(board, 'blue')) {
      finished = true;
      messageElement.textContent = '컴퓨터가 왼쪽과 오른쪽을 이었습니다. 새 게임으로 다시 도전해 보세요.';
    } else {
      messageElement.textContent = '빨간 돌을 둘 차례입니다.';
    }
    computerThinking = false;
  }

  function play(row, column) {
    if (finished || computerThinking || !Bridgit.isValidMove(board, row, column)) return;
    board = Bridgit.placeStone(board, row, column, 'red');
    if (Bridgit.hasConnection(board, 'red')) {
      finished = true;
      messageElement.textContent = '축하합니다! 빨간 돌로 위아래를 이었습니다.';
    } else {
      computerThinking = true;
      messageElement.textContent = '컴퓨터가 생각하고 있습니다…';
      render();
      computerTimer = window.setTimeout(() => {
        computerTimer = null;
        computerMove();
        render();
      }, 250);
      return;
    }
    render();
  }

  function render() {
    boardElement.replaceChildren();
    board.forEach((row, rowIndex) => row.forEach((cell, columnIndex) => {
      const point = document.createElement('button');
      point.type = 'button';
      point.className = `point${cell ? ` ${cell}` : ''}`;
      point.disabled = finished || cell !== null;
      point.setAttribute('aria-label', `${rowIndex + 1}행 ${columnIndex + 1}열 ${cell === 'red' ? '빨간 돌' : cell === 'blue' ? '파란 돌' : '빈 자리'}`);
      point.addEventListener('click', () => play(rowIndex, columnIndex));
      boardElement.append(point);
    }));
  }

  document.querySelector('#reset').addEventListener('click', () => {
    if (computerTimer) window.clearTimeout(computerTimer);
    computerTimer = null;
    board = Bridgit.createBoard(SIZE);
    finished = false;
    computerThinking = false;
    messageElement.textContent = '빨간 돌을 둘 차례입니다.';
    render();
  });
  render();
})();
