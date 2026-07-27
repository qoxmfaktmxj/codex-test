const { createGame, placeStone } = window.gameLogic;

const boardEl = document.getElementById('board');
const stoneEl = document.getElementById('stone');
const statusEl = document.getElementById('status');
const winnerEl = document.getElementById('winner');
const messageEl = document.getElementById('message');
const resetButton = document.getElementById('reset-button');

let game = createGame();

function renderBoard() {
  boardEl.innerHTML = '';
  game.board.forEach((row, rowIndex) => {
    row.forEach((stone, colIndex) => {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = `cell ${stone === '흑' ? 'black' : ''} ${stone === '백' ? 'white' : ''}`;
      cell.setAttribute('aria-label', `${rowIndex + 1}행 ${colIndex + 1}열`);
      cell.disabled = game.status !== '진행 중' || Boolean(stone);
      cell.textContent = stone || '';
      cell.addEventListener('click', () => {
        game = placeStone(game, rowIndex, colIndex);
        render();
      });
      boardEl.appendChild(cell);
    });
  });
}

function render() {
  stoneEl.textContent = game.currentStone;
  statusEl.textContent = game.status;
  winnerEl.textContent = game.winner || '-';
  messageEl.textContent = game.message;
  renderBoard();
}

resetButton.addEventListener('click', () => {
  game = createGame();
  render();
});

render();
