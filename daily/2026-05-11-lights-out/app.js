const boardElement = document.querySelector('[data-board]');
const statusElement = document.querySelector('[data-status]');
const resetButton = document.querySelector('[data-reset]');

let game = window.gameLogic.createGame();
const cells = Array.from({ length: 9 }, (_, index) => {
  const button = document.createElement('button');
  button.className = 'cell';
  button.type = 'button';
  button.addEventListener('click', () => {
    game = window.gameLogic.toggleCell(game, index);
    render();
  });
  boardElement.appendChild(button);
  return button;
});

function statusText() {
  if (game.status === 'won') {
    return `${game.moves}번 만에 모두 껐습니다`;
  }

  return `켜진 불 ${window.gameLogic.countLights(game.lights)}개`;
}

function render() {
  statusElement.textContent = statusText();

  game.lights.forEach((isOn, index) => {
    const button = cells[index];
    button.textContent = isOn ? '켜짐' : '꺼짐';
    button.classList.toggle('is-on', isOn);
    button.setAttribute('aria-pressed', String(isOn));
    button.setAttribute('aria-label', `${index + 1}번 불 ${isOn ? '켜짐' : '꺼짐'}`);
    button.disabled = game.status !== 'playing';
  });
}

resetButton.addEventListener('click', () => {
  game = window.gameLogic.createGame();
  render();
});

render();
