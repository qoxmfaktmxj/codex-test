const turnElement = document.querySelector('#turn');
const remainingElement = document.querySelector('#remaining');
const statusElement = document.querySelector('#status');
const guessRowElement = document.querySelector('#guess-row');
const paletteElement = document.querySelector('#palette');
const messageElement = document.querySelector('#message');
const submitButton = document.querySelector('#submit-button');
const clearButton = document.querySelector('#clear-button');
const resetButton = document.querySelector('#reset-button');
const historyElement = document.querySelector('#history');

let game = Mastermind.createGame();
let currentGuess = [];

function createColorNode(color, className) {
  const node = document.createElement('span');
  node.className = className;
  node.dataset.color = color;
  return node;
}

function renderGuess() {
  guessRowElement.innerHTML = '';
  for (let index = 0; index < Mastermind.CODE_LENGTH; index += 1) {
    const slot = document.createElement('button');
    slot.type = 'button';
    slot.className = 'slot';
    slot.setAttribute('aria-label', `${index + 1}번째 칸`);
    const color = currentGuess[index];
    if (color) {
      slot.textContent = color;
      slot.dataset.color = color;
      slot.classList.add('is-filled');
    } else {
      slot.textContent = `${index + 1}`;
    }
    slot.addEventListener('click', () => {
      currentGuess.splice(index, 1);
      render();
    });
    guessRowElement.appendChild(slot);
  }
}

function renderPalette() {
  paletteElement.innerHTML = '';
  Mastermind.COLORS.forEach((color) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'peg';
    button.dataset.color = color;
    button.textContent = color;
    button.disabled = game.status !== '진행 중';
    button.addEventListener('click', () => {
      if (currentGuess.length < Mastermind.CODE_LENGTH) {
        currentGuess.push(color);
        render();
      }
    });
    paletteElement.appendChild(button);
  });
}

function renderHistory() {
  historyElement.innerHTML = '';
  game.history.slice().reverse().forEach((entry) => {
    const item = document.createElement('li');
    const pegs = document.createElement('span');
    pegs.className = 'mini-pegs';
    entry.guess.forEach((color) => {
      pegs.appendChild(createColorNode(color, 'mini-peg'));
    });
    item.appendChild(pegs);
    item.append(
      `${entry.turn}차 추리: 정확한 위치 ${entry.score.exact}개, 색만 맞음 ${entry.score.colorOnly}개`,
    );
    historyElement.appendChild(item);
  });
}

function render() {
  turnElement.textContent = String(game.turn);
  remainingElement.textContent = String(Math.max(0, game.maxTurns - game.history.length));
  statusElement.textContent = game.status;
  messageElement.textContent = game.message;
  submitButton.disabled = game.status !== '진행 중' || currentGuess.length !== Mastermind.CODE_LENGTH;
  clearButton.disabled = game.status !== '진행 중' || currentGuess.length === 0;
  renderGuess();
  renderPalette();
  renderHistory();
}

submitButton.addEventListener('click', () => {
  try {
    game = Mastermind.submitGuess(game, currentGuess);
    currentGuess = [];
  } catch (error) {
    game = { ...game, message: error.message };
  }
  render();
});

clearButton.addEventListener('click', () => {
  currentGuess = [];
  render();
});

resetButton.addEventListener('click', () => {
  game = Mastermind.createGame();
  currentGuess = [];
  render();
});

render();
