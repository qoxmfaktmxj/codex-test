(() => {
  const boardElement = document.querySelector('#board');
  const message = document.querySelector('#message');
  let state;
  let selected;

  function pieceName(piece) { return { attacker: '공격군', defender: '수비군', king: '왕' }[piece]; }
  function turnName() { return state.turn === 'defenders' ? '수비군' : '공격군'; }
  function positionName(row, column) { return `${row + 1}행 ${column + 1}열`; }

  function statusMessage() {
    const status = Tafl.getStatus(state);
    if (status === 'defenders-won') return '왕이 모서리로 탈출했습니다. 수비군의 승리입니다!';
    if (status === 'attackers-won') return '왕이 사방에 포위되었습니다. 공격군의 승리입니다!';
    return `${turnName()} 차례입니다. 움직일 말을 고르세요.`;
  }

  function chooseCell(row, column) {
    if (Tafl.getStatus(state) !== 'playing') return;
    const piece = state.board[row][column];
    if (!selected) {
      if (!piece) { message.textContent = '먼저 움직일 말을 고르세요.'; return; }
      if ((piece === 'attacker' ? 'attackers' : 'defenders') !== state.turn) { message.textContent = `지금은 ${turnName()} 차례입니다.`; return; }
      selected = [row, column];
      message.textContent = `${positionName(row, column)}의 ${pieceName(piece)}을 골랐습니다. 도착할 빈칸을 고르세요.`;
      render();
      return;
    }
    if (selected[0] === row && selected[1] === column) { selected = null; message.textContent = statusMessage(); render(); return; }
    if (piece && (piece === 'attacker' ? 'attackers' : 'defenders') === state.turn) { selected = [row, column]; message.textContent = `${positionName(row, column)}의 ${pieceName(piece)}을 골랐습니다.`; render(); return; }
    try {
      state = Tafl.movePiece(state, selected[0], selected[1], row, column);
      const captured = state.captured ? ` 상대 말 ${state.captured}개를 잡았습니다.` : '';
      selected = null;
      message.textContent = `${captured} ${statusMessage()}`.trim();
      render();
    } catch (error) { message.textContent = error.message; }
  }

  function render() {
    boardElement.replaceChildren(...state.board.flatMap((line, row) => line.map((piece, column) => {
      const cell = document.createElement('button');
      cell.type = 'button';
      const special = Tafl.isCorner(row, column) ? 'corner' : Tafl.isSpecialSquare(row, column) ? 'throne' : '';
      cell.className = `cell ${special} ${selected && selected[0] === row && selected[1] === column ? 'selected' : ''}`;
      cell.setAttribute('aria-label', `${positionName(row, column)} ${piece ? pieceName(piece) : special === 'corner' ? '탈출 모서리' : special === 'throne' ? '왕좌' : '빈칸'}`);
      if (piece) { const stone = document.createElement('span'); stone.className = `stone ${piece}`; stone.textContent = piece === 'king' ? '♛' : ''; cell.append(stone); }
      cell.addEventListener('click', () => chooseCell(row, column));
      return cell;
    })));
  }

  function startGame() { state = Tafl.createState(); selected = null; message.textContent = statusMessage(); render(); }
  document.querySelector('#reset').addEventListener('click', startGame);
  startGame();
})();
