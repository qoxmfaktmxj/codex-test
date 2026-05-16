const boardElement = document.querySelector('[data-board]');
const statusElement = document.querySelector('[data-status]');
const resetButton = document.querySelector('[data-reset]');

let game = window.gameLogic.createGame();
const cells = Array.from({ length: 9 }, (_, index) => {
  const button = document.createElement('button');
  button.className = 'tile';
  button.type = 'button';
  button.addEventListener('click', () => {
    game = window.gameLogic.moveTile(game, game.tiles[index]);
    render();
  });
  boardElement.appendChild(button);
  return button;
});

function statusText() {
  if (game.status === 'won') {
    return `${game.moves}번 만에 완성했습니다`;
  }

  return `이동 횟수 ${game.moves}`;
}

function render() {
  statusElement.textContent = statusText();

  game.tiles.forEach((tile, index) => {
    const button = cells[index];
    const isEmpty = tile === 0;
    const isEnabled = window.gameLogic.isTileEnabled(game, index);
    button.textContent = isEmpty ? '' : String(tile);
    button.classList.toggle('is-empty', isEmpty);
    button.disabled = !isEnabled;
    button.setAttribute('aria-label', isEmpty ? '빈 칸' : `${tile}번 타일`);
    button.setAttribute('aria-disabled', String(!isEnabled));
  });
}

resetButton.addEventListener('click', () => {
  game = window.gameLogic.createGame();
  render();
});

render();
