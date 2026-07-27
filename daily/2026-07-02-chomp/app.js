const boardElement = document.querySelector('#board');
const safeCountElement = document.querySelector('#safe-count');
const turnElement = document.querySelector('#turn');
const statusElement = document.querySelector('#status');
const messageElement = document.querySelector('#message');
const resetButton = document.querySelector('#reset-button');

let game = Chomp.createGame();
let computerTimer = null;

function scheduleComputerMove() {
  if (computerTimer || game.status !== '진행 중' || game.currentPlayer !== '컴퓨터') {
    return;
  }

  computerTimer = window.setTimeout(() => {
    game = Chomp.computerMove(game);
    computerTimer = null;
    render();
  }, 520);
}

function renderBoard() {
  boardElement.innerHTML = '';

  game.board.forEach((row, rowIndex) => {
    row.forEach((hasChocolate, colIndex) => {
      const button = document.createElement('button');
      const isPoison = rowIndex === 0 && colIndex === 0;
      button.type = 'button';
      button.className = [
        'cell',
        hasChocolate ? 'has-chocolate' : 'is-eaten',
        isPoison ? 'is-poison' : '',
      ].filter(Boolean).join(' ');
      button.textContent = hasChocolate ? (isPoison ? '독' : '초콜릿') : '빈칸';
      button.setAttribute('aria-label', `${rowIndex + 1}행 ${colIndex + 1}열 ${button.textContent}`);
      button.disabled = !hasChocolate || game.status !== '진행 중' || game.currentPlayer !== '사람';
      button.addEventListener('click', () => {
        game = Chomp.chooseCell(game, rowIndex, colIndex);
        render();
      });
      boardElement.appendChild(button);
    });
  });
}

function render() {
  safeCountElement.textContent = String(game.remainingSafeCells);
  turnElement.textContent = game.currentPlayer;
  statusElement.textContent = game.status;
  messageElement.textContent = game.message;
  renderBoard();
  scheduleComputerMove();
}

resetButton.addEventListener('click', () => {
  if (computerTimer) {
    window.clearTimeout(computerTimer);
    computerTimer = null;
  }
  game = Chomp.createGame();
  render();
});

render();
