const boardElement = document.querySelector('#board');
const statusElement = document.querySelector('#status');
const scoreElement = document.querySelector('#score');
const movesElement = document.querySelector('#moves');
const messageElement = document.querySelector('#message');
const hintButton = document.querySelector('#hint-button');
const resetButton = document.querySelector('#reset-button');

const GEM_TEXT = {
  '빨강': '빨',
  '노랑': '노',
  '초록': '초',
  '파랑': '파',
  '보라': '보',
};

let game = MatchThree.createGame();

function isSamePosition(first, second) {
  return first && second && first.row === second.row && first.col === second.col;
}

function isCleared(row, col) {
  return game.lastCleared.some((cell) => cell.row === row && cell.col === col);
}

function renderBoard() {
  boardElement.innerHTML = '';

  game.board.forEach((row, rowIndex) => {
    row.forEach((gem, colIndex) => {
      const button = document.createElement('button');
      const selected = isSamePosition(game.selected, { row: rowIndex, col: colIndex });

      button.type = 'button';
      button.className = `gem gem-${gem}`;
      button.textContent = GEM_TEXT[gem];
      button.setAttribute('aria-label', `${rowIndex + 1}행 ${colIndex + 1}열 ${gem} 보석`);
      button.setAttribute('aria-pressed', selected ? 'true' : 'false');
      button.dataset.row = String(rowIndex);
      button.dataset.col = String(colIndex);

      if (selected) {
        button.classList.add('selected');
      }

      if (isCleared(rowIndex, colIndex)) {
        button.classList.add('cleared');
      }

      button.addEventListener('click', () => handleGemClick(rowIndex, colIndex));
      boardElement.appendChild(button);
    });
  });
}

function render() {
  statusElement.textContent = game.status;
  scoreElement.textContent = String(game.score);
  movesElement.textContent = String(game.movesLeft);
  messageElement.textContent = game.message;
  renderBoard();
}

function handleGemClick(row, col) {
  const position = { row, col };

  if (game.status === '완료') {
    game = MatchThree.swapTiles(game, position, position);
    render();
    return;
  }

  if (!game.selected) {
    game = {
      ...game,
      selected: position,
      message: '바꿀 이웃 보석을 고르세요.',
      lastCleared: [],
    };
    render();
    return;
  }

  if (isSamePosition(game.selected, position)) {
    game = {
      ...game,
      selected: null,
      message: '선택을 지웠습니다. 보석 하나를 다시 고르세요.',
      lastCleared: [],
    };
    render();
    return;
  }

  game = MatchThree.swapTiles(game, game.selected, position);
  render();
}

hintButton.addEventListener('click', () => {
  game = {
    ...game,
    selected: null,
    message: '선택을 지웠습니다. 보석 하나를 다시 고르세요.',
    lastCleared: [],
  };
  render();
});

resetButton.addEventListener('click', () => {
  game = MatchThree.createGame();
  render();
});

render();
