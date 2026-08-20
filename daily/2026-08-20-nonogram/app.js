(() => {
  const solution = [
    [false, true, true, true, false],
    [true, false, true, false, true],
    [true, true, true, true, true],
    [true, false, true, false, true],
    [false, true, false, true, false],
  ];
  const puzzle = Nonogram.createPuzzle(solution);
  const hints = Nonogram.getHints(puzzle.solution);
  const boardElement = document.querySelector('#board');
  const messageElement = document.querySelector('#message');
  let cells = puzzle.cells;

  function renderHints() {
    const columns = document.querySelector('#column-hints');
    const rows = document.querySelector('#row-hints');
    columns.replaceChildren();
    rows.replaceChildren();
    hints.columns.forEach((hint) => {
      const item = document.createElement('div');
      item.className = 'column-hint';
      item.textContent = hint.join(' ');
      columns.append(item);
    });
    hints.rows.forEach((hint) => {
      const item = document.createElement('div');
      item.className = 'row-hint';
      item.textContent = hint.join('  ');
      rows.append(item);
    });
  }

  function renderBoard(focusPosition) {
    boardElement.replaceChildren();
    const status = Nonogram.getStatus(puzzle.solution, cells);
    cells.forEach((row, rowIndex) => row.forEach((filled, columnIndex) => {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = `cell${filled ? ' filled' : ''}`;
      cell.setAttribute('aria-label', `${rowIndex + 1}행 ${columnIndex + 1}열 ${filled ? '채워짐' : '비어 있음'}`);
      cell.disabled = status === 'won';
      cell.addEventListener('click', () => {
        cells = Nonogram.toggleCell(cells, rowIndex, columnIndex);
        const nextStatus = Nonogram.getStatus(puzzle.solution, cells);
        messageElement.textContent = nextStatus === 'won'
          ? '그림 완성! 여우를 찾았습니다. 처음부터를 눌러 다시 풀어 보세요.'
          : '좋아요. 힌트와 맞는지 계속 확인해 보세요.';
        renderBoard({ row: rowIndex, column: columnIndex });
      });
      boardElement.append(cell);
    }));
    boardElement.classList.toggle('complete', status === 'won');
    if (focusPosition) {
      const index = focusPosition.row * cells[0].length + focusPosition.column;
      boardElement.children[index].focus();
    }
  }

  document.querySelector('#reset').addEventListener('click', () => {
    cells = puzzle.solution.map((row) => row.map(() => false));
    messageElement.textContent = '말판을 비웠습니다. 숫자 힌트를 보고 다시 시작하세요.';
    renderBoard();
  });

  renderHints();
  renderBoard();
})();
