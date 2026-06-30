const boardElement = document.querySelector('#board');
const lightCountElement = document.querySelector('#light-count');
const movesElement = document.querySelector('#moves');
const statusElement = document.querySelector('#status');
const messageElement = document.querySelector('#message');
const resetButton = document.querySelector('#reset-button');

let game = LightsOut.createGame();

function renderBoard() {
  boardElement.innerHTML = '';

  game.board.forEach((row, rowIndex) => {
    row.forEach((isOn, colIndex) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = isOn ? 'cell is-on' : 'cell';
      button.textContent = isOn ? '켜짐' : '꺼짐';
      button.setAttribute('aria-pressed', String(isOn));
      button.setAttribute('aria-label', `${rowIndex + 1}행 ${colIndex + 1}열 ${isOn ? '켜짐' : '꺼짐'}`);
      button.disabled = game.status === '완료';
      button.addEventListener('click', () => {
        game = LightsOut.toggleAt(game, rowIndex, colIndex);
        render();
      });
      boardElement.appendChild(button);
    });
  });
}

function render() {
  lightCountElement.textContent = String(game.lightCount);
  movesElement.textContent = String(game.moves);
  statusElement.textContent = game.status;
  messageElement.textContent = game.message;
  renderBoard();
}

resetButton.addEventListener('click', () => {
  game = LightsOut.createGame();
  render();
});

render();
