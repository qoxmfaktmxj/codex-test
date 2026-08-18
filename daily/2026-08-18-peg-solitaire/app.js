(() => {
  const boardElement = document.querySelector('#board');
  const messageElement = document.querySelector('#message');
  const countElement = document.querySelector('#count');
  const resetButton = document.querySelector('#reset');
  let board = PegSolitaire.createBoard();
  let selected = null;
  let finished = false;

  function setMessage(message) {
    messageElement.textContent = message;
  }

  function render() {
    boardElement.innerHTML = '';
    board.forEach((row, rowIndex) => row.forEach((cell, columnIndex) => {
      const cellElement = document.createElement('button');
      cellElement.type = 'button';
      cellElement.className = `cell ${cell}`;
      cellElement.disabled = cell === 'blocked' || finished;
      cellElement.setAttribute('aria-label', cell === 'peg' ? `${rowIndex + 1}행 ${columnIndex + 1}열 말` : `${rowIndex + 1}행 ${columnIndex + 1}열 빈칸`);
      if (selected && selected.row === rowIndex && selected.column === columnIndex) cellElement.classList.add('selected');
      cellElement.addEventListener('click', () => selectCell(rowIndex, columnIndex));
      boardElement.append(cellElement);
    }));
    countElement.textContent = `남은 말 ${PegSolitaire.countPegs(board)}개`;
  }

  function selectCell(row, column) {
    if (finished) return;
    if (!selected) {
      if (board[row][column] === 'peg') {
        selected = { row, column };
        setMessage('도착할 빈칸을 선택하세요.');
      } else setMessage('움직일 말을 먼저 선택하세요.');
      render();
      return;
    }
    if (board[row][column] === 'peg') {
      selected = { row, column };
      setMessage('도착할 빈칸을 선택하세요.');
      render();
      return;
    }
    if (PegSolitaire.isValidJump(board, selected.row, selected.column, row, column)) {
      board = PegSolitaire.jump(board, selected.row, selected.column, row, column);
      selected = null;
      if (PegSolitaire.isComplete(board)) {
        finished = true;
        setMessage('성공! 말 하나만 남겼습니다.');
      } else if (!PegSolitaire.hasLegalMove(board)) {
        finished = true;
        setMessage(`움직일 수 있는 곳이 없습니다. 말 ${PegSolitaire.countPegs(board)}개가 남았습니다.`);
      } else setMessage('좋아요! 다음 말을 움직이세요.');
    } else {
      selected = null;
      setMessage('그곳으로는 뛸 수 없습니다. 다시 골라 보세요.');
    }
    render();
  }

  resetButton.addEventListener('click', () => {
    board = PegSolitaire.createBoard();
    selected = null;
    finished = false;
    setMessage('움직일 말을 먼저 고르세요.');
    render();
  });

  render();
})();
