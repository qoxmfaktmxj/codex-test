const sequenceElement = document.querySelector('[data-sequence]');
const statusElement = document.querySelector('[data-status]');
const tilesElement = document.querySelector('[data-tiles]');
const startButton = document.querySelector('[data-start]');
const resetButton = document.querySelector('[data-reset]');

let game = window.gameLogic.createGame();

const tiles = window.gameLogic.TILE_LABELS.map((label) => {
  const button = document.createElement('button');
  button.className = `tile tile-${label}`;
  button.type = 'button';
  button.textContent = label;
  button.addEventListener('click', () => {
    game = window.gameLogic.chooseTile(game, label);
    render();
  });
  tilesElement.appendChild(button);
  return button;
});

function progressText() {
  if (game.status === 'won') {
    return game.message;
  }

  if (game.status === 'lost') {
    return `${game.message} 다시 도전해 보세요.`;
  }

  if (game.phase === 'memorizing') {
    return `${game.message} 준비되면 입력 시작을 누르세요.`;
  }

  return `${game.message} 남은 입력 ${window.gameLogic.remainingCount(game)}개`;
}

function render() {
  sequenceElement.textContent = window.gameLogic.visibleSequenceText(game);
  statusElement.textContent = progressText();
  startButton.hidden = game.phase !== 'memorizing' || game.status !== 'playing';

  tiles.forEach((button) => {
    button.disabled = game.status !== 'playing' || game.phase !== 'input';
  });
}

startButton.addEventListener('click', () => {
  game = window.gameLogic.startInput(game);
  render();
});

resetButton.addEventListener('click', () => {
  game = window.gameLogic.createGame();
  render();
});

render();
