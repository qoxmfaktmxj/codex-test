(() => {
  const COLORS = ['red', 'blue'];
  const NAMES = { red: '빨간 말', blue: '파란 말' };
  const boardElement = document.querySelector('#board');
  const messageElement = document.querySelector('#message');
  let board;
  let turn;
  let selected;
  let finished;

  function pieceCount(color) {
    return board.flat().filter((piece) => piece === color).length;
  }

  function placementPhase() {
    return COLORS.some((color) => pieceCount(color) < 4);
  }

  function showTurn() {
    if (placementPhase()) messageElement.textContent = `${NAMES[turn]} 네 개를 놓을 차례입니다.`;
    else messageElement.textContent = `${NAMES[turn]}을 눌러 인접한 빈칸으로 옮기세요.`;
  }

  function finishIfWon() {
    if (!Teeko.hasWon(board, turn)) return false;
    finished = true;
    messageElement.textContent = `${NAMES[turn]}의 승리입니다! 새 게임으로 다시 겨뤄 보세요.`;
    return true;
  }

  function changeTurn() {
    turn = turn === 'red' ? 'blue' : 'red';
    showTurn();
  }

  function play(row, column) {
    if (finished) return;
    if (placementPhase()) {
      if (!Teeko.isValidPlacement(board, row, column) || pieceCount(turn) >= 4) return;
      board = Teeko.placePiece(board, row, column, turn);
      if (!finishIfWon()) changeTurn();
      render();
      return;
    }
    if (!selected) {
      if (board[row][column] !== turn) return;
      selected = [row, column];
    } else if (selected[0] === row && selected[1] === column) {
      selected = null;
    } else if (Teeko.isValidMove(board, selected[0], selected[1], row, column, turn)) {
      board = Teeko.movePiece(board, selected[0], selected[1], row, column, turn);
      selected = null;
      if (!finishIfWon()) changeTurn();
    } else if (board[row][column] === turn) {
      selected = [row, column];
    }
    render();
  }

  function render() {
    boardElement.replaceChildren();
    board.forEach((line, row) => line.forEach((piece, column) => {
      const cell = document.createElement('button');
      const isSelected = selected && selected[0] === row && selected[1] === column;
      cell.type = 'button';
      cell.className = `cell${piece ? ` ${piece}` : ''}${isSelected ? ' selected' : ''}`;
      cell.disabled = finished;
      cell.setAttribute('aria-label', `${row + 1}행 ${column + 1}열 ${piece === 'red' ? '빨간 말' : piece === 'blue' ? '파란 말' : '빈칸'}${isSelected ? ', 선택됨' : ''}`);
      cell.addEventListener('click', () => play(row, column));
      boardElement.append(cell);
    }));
  }

  function reset() {
    board = Teeko.createBoard();
    turn = 'red';
    selected = null;
    finished = false;
    showTurn();
    render();
  }

  document.querySelector('#reset').addEventListener('click', reset);
  reset();
})();
