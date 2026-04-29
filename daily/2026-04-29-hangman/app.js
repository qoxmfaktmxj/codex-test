const wordElement = document.querySelector('[data-word]');
const statusElement = document.querySelector('[data-status]');
const gallowsElement = document.querySelector('[data-gallows]');
const keyboardElement = document.querySelector('[data-keyboard]');
const resetButton = document.querySelector('[data-reset]');

const letters = Array.from(new Set(window.gameLogic.DEFAULT_WORDS.join('')));
let game = window.gameLogic.createGame(window.gameLogic.pickWord());

function statusText() {
  if (game.status === 'won') {
    return '단어를 맞혔습니다';
  }

  if (game.status === 'lost') {
    return `실패: 정답은 ${game.answer.join('')}`;
  }

  return `남은 기회: ${window.gameLogic.MAX_MISSES - game.misses}`;
}

function render() {
  wordElement.textContent = game.revealed.join(' ');
  statusElement.textContent = statusText();
  gallowsElement.textContent = '틀림 '.repeat(game.misses).trim();

  for (const letter of letters) {
    const button = keyboardElement.querySelector(`[data-key="${letter}"]`);
    button.disabled = game.status !== 'playing' || game.guesses.includes(letter);
  }
}

function createKeyboard() {
  for (const letter of letters) {
    const button = document.createElement('button');
    button.className = 'key';
    button.type = 'button';
    button.dataset.key = letter;
    button.textContent = letter;
    button.addEventListener('click', () => {
      game = window.gameLogic.guessLetter(game, letter);
      render();
    });
    keyboardElement.append(button);
  }
}

resetButton.addEventListener('click', () => {
  game = window.gameLogic.createGame(window.gameLogic.pickWord());
  render();
});

createKeyboard();
render();
