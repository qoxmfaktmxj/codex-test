const boardNode = document.querySelector('[data-board]');
const numbersNode = document.querySelector('[data-numbers]');
const hintsNode = document.querySelector('[data-line-hints]');
const scoreNode = document.querySelector('[data-score]');
const messageNode = document.querySelector('[data-message]');
const resetButton = document.querySelector('[data-reset]');

let game = MagicSquare.createGame({
  board: [
    [8, null, 6],
    [null, 5, null],
    [4, null, null],
  ],
});

function renderBoard() {
  boardNode.innerHTML = '';
  game.board.forEach((row, rowIndex) => {
    row.forEach((number, colIndex) => {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = number ? 'cell filled' : 'cell';
      cell.disabled = Boolean(number) || game.status !== '진행 중' || !game.selectedNumber;
      cell.textContent = number || '';
      cell.setAttribute('aria-label', number ? `${number}이 놓인 칸` : `${rowIndex + 1}행 ${colIndex + 1}열 빈칸`);
      cell.addEventListener('click', () => {
        game = MagicSquare.placeNumber(game, rowIndex, colIndex);
        render();
      });
      boardNode.appendChild(cell);
    });
  });
}

function renderNumbers() {
  numbersNode.innerHTML = '';
  MagicSquare.NUMBERS.forEach((number) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = game.selectedNumber === number ? 'number selected' : 'number';
    button.disabled = !game.availableNumbers.includes(number) || game.status !== '진행 중';
    button.textContent = number;
    button.setAttribute('aria-label', `${number} 선택`);
    button.addEventListener('click', () => {
      game = MagicSquare.selectNumber(game, number);
      render();
    });
    numbersNode.appendChild(button);
  });
}

function renderHints() {
  hintsNode.innerHTML = '';
  const items = [
    ...game.lineSums.rows.map((sum, index) => ({ label: `${index + 1}행`, sum, done: game.completedLines.rows[index] })),
    ...game.lineSums.columns.map((sum, index) => ({ label: `${index + 1}열`, sum, done: game.completedLines.columns[index] })),
    { label: '대각선 1', sum: game.lineSums.diagonals[0], done: game.completedLines.diagonals[0] },
    { label: '대각선 2', sum: game.lineSums.diagonals[1], done: game.completedLines.diagonals[1] },
  ];

  items.forEach((item) => {
    const node = document.createElement('div');
    node.className = item.done ? 'hint done' : 'hint';
    node.innerHTML = `<span>${item.label}</span><strong>${item.sum}</strong>`;
    hintsNode.appendChild(node);
  });
}

function render() {
  renderBoard();
  renderNumbers();
  renderHints();
  scoreNode.textContent = game.score;
  messageNode.textContent = game.message;
  messageNode.className = `message ${game.status === '성공' ? 'win' : ''}`;
}

resetButton.addEventListener('click', () => {
  game = MagicSquare.createGame({
    board: [
      [8, null, 6],
      [null, 5, null],
      [4, null, null],
    ],
  });
  render();
});

render();
