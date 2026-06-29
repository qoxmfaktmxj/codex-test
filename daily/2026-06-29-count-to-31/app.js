const totalElement = document.querySelector('#total');
const statusElement = document.querySelector('#status');
const winnerElement = document.querySelector('#winner');
const messageElement = document.querySelector('#message');
const numberTrackElement = document.querySelector('#number-track');
const historyElement = document.querySelector('#history');
const resetButton = document.querySelector('#reset-button');
const pickButtons = Array.from(document.querySelectorAll('[data-count]'));

let game = CountTo31.createGame();

function ownerForNumber(number) {
  const entry = game.history.find((item) => number >= item.from && number <= item.to);
  return entry ? entry.player : null;
}

function renderTrack() {
  numberTrackElement.innerHTML = '';

  for (let number = 1; number <= 31; number += 1) {
    const cell = document.createElement('span');
    const owner = ownerForNumber(number);

    cell.className = 'number-cell';
    cell.textContent = String(number);

    if (owner === '사람') {
      cell.classList.add('human');
    }

    if (owner === '컴퓨터') {
      cell.classList.add('computer');
    }

    if (number === 31) {
      cell.classList.add('danger');
    }

    numberTrackElement.appendChild(cell);
  }
}

function renderHistory() {
  historyElement.innerHTML = '';

  game.history.forEach((entry) => {
    const item = document.createElement('li');
    const name = document.createElement('strong');

    name.textContent = entry.player;
    item.appendChild(name);
    item.append(`: ${CountTo31.formatRange(entry)}`);
    historyElement.appendChild(item);
  });
}

function renderControls() {
  pickButtons.forEach((button) => {
    const count = Number(button.dataset.count);
    button.disabled = game.status === '완료' || game.total + count > 31;
  });
}

function render() {
  totalElement.textContent = String(game.total);
  statusElement.textContent = game.status;
  winnerElement.textContent = game.winner || '-';
  messageElement.textContent = game.message;
  renderTrack();
  renderHistory();
  renderControls();
}

pickButtons.forEach((button) => {
  button.addEventListener('click', () => {
    game = CountTo31.takePlayerMove(game, Number(button.dataset.count));
    render();
  });
});

resetButton.addEventListener('click', () => {
  game = CountTo31.createGame();
  render();
});

render();
