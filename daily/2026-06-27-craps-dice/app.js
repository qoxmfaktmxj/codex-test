const diceElements = Array.from(document.querySelectorAll('.die'));
const statusElement = document.querySelector('#status');
const pointElement = document.querySelector('#point');
const messageElement = document.querySelector('#message');
const historyElement = document.querySelector('#history');
const rollButton = document.querySelector('#roll-button');
const resetButton = document.querySelector('#reset-button');

let game = CrapsDice.createGame();

function renderDice() {
  const latest = game.rolls[game.rolls.length - 1];
  const dice = latest ? latest.dice : [1, 1];

  diceElements.forEach((element, index) => {
    element.textContent = dice[index];
    element.setAttribute('aria-label', `${index + 1}번 주사위 ${dice[index]}`);
  });
}

function renderHistory() {
  historyElement.innerHTML = '';

  game.rolls.slice().reverse().forEach((roll) => {
    const item = document.createElement('li');
    item.textContent = `${roll.label}: ${roll.dice[0]} + ${roll.dice[1]} = ${roll.total}`;
    historyElement.appendChild(item);
  });
}

function render() {
  statusElement.textContent = game.status;
  pointElement.textContent = game.point === null ? '-' : String(game.point);
  messageElement.textContent = game.message;
  rollButton.disabled = game.phase === CrapsDice.FINISHED;
  renderDice();
  renderHistory();
}

rollButton.addEventListener('click', () => {
  game = CrapsDice.rollDice(game);
  render();
});

resetButton.addEventListener('click', () => {
  game = CrapsDice.createGame();
  render();
});

render();
