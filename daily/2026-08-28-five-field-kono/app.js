(() => {
  const boardElement = document.querySelector('#board');
  const message = document.querySelector('#message');
  const reset = document.querySelector('#reset');
  let state = FiveFieldKono.createState();
  let selected = null;

  function playerName(player) { return player === 'blue' ? '푸른 말' : '주황 말'; }

  function render() {
    const status = FiveFieldKono.getStatus(state);
    message.textContent = status === 'playing' ? `${playerName(state.turn)} 차례입니다. 말을 선택하세요.` : `${playerName(status === 'blue-won' ? 'blue' : 'orange')}이 이겼습니다!`;
    boardElement.innerHTML = '';
    state.board.forEach((row, rowIndex) => row.forEach((piece, columnIndex) => {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = `cell${selected && selected[0] === rowIndex && selected[1] === columnIndex ? ' selected' : ''}`;
      cell.setAttribute('aria-label', `${rowIndex + 1}행 ${columnIndex + 1}열${piece ? ` ${playerName(piece)}` : ' 빈칸'}`);
      if (piece) cell.innerHTML = `<span class="piece ${piece}"></span>`;
      cell.addEventListener('click', () => choose(rowIndex, columnIndex));
      cell.disabled = status !== 'playing';
      boardElement.appendChild(cell);
    }));
  }

  function choose(row, column) {
    const piece = state.board[row][column];
    if (!selected) {
      if (piece !== state.turn) {
        message.textContent = piece ? '내 말을 선택하세요.' : '움직일 말을 선택하세요.';
        return;
      }
      selected = [row, column];
    } else if (selected[0] === row && selected[1] === column) {
      selected = null;
    } else if (piece === state.turn) {
      selected = [row, column];
    } else {
      try {
        state = FiveFieldKono.movePiece(state, selected[0], selected[1], row, column);
        selected = null;
      } catch (error) {
        message.textContent = error.message;
        return;
      }
    }
    render();
  }

  reset.addEventListener('click', () => { state = FiveFieldKono.createState(); selected = null; render(); });
  render();
})();
