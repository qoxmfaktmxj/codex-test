const form = document.querySelector('[data-form]');
const input = document.querySelector('[data-guess]');
const statusText = document.querySelector('[data-status]');
const attemptsList = document.querySelector('[data-attempts]');
const resetButton = document.querySelector('[data-reset]');

let game = window.gameLogic.createGame(window.gameLogic.createAnswer());

function render() {
  statusText.textContent = game.message;
  attemptsList.innerHTML = '';

  for (const attempt of game.attempts) {
    const item = document.createElement('li');
    item.textContent = `${attempt.guess}: ${attempt.strikes} 스트라이크, ${attempt.balls} 볼`;
    attemptsList.prepend(item);
  }

  input.disabled = game.status === 'won';
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  game = window.gameLogic.makeGuess(game, input.value.trim());
  input.value = '';
  input.focus();
  render();
});

resetButton.addEventListener('click', () => {
  game = window.gameLogic.createGame(window.gameLogic.createAnswer());
  input.disabled = false;
  input.value = '';
  input.focus();
  render();
});

render();
