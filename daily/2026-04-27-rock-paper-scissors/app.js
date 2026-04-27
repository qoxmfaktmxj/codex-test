const choicesElement = document.querySelector('[data-choices]');
const scoreElement = document.querySelector('[data-score]');
const statusElement = document.querySelector('[data-status]');
const resetButton = document.querySelector('[data-reset]');

let game = window.gameLogic.createGame();

function chooseComputer() {
  const choices = window.gameLogic.CHOICES;
  return choices[Math.floor(Math.random() * choices.length)];
}

function labelChoice(choice) {
  return choice.charAt(0).toUpperCase() + choice.slice(1);
}

function statusText() {
  if (!game.result) {
    return 'Choose a move';
  }

  const resultText = {
    win: 'You win',
    lose: 'Computer wins',
    draw: 'Draw',
  }[game.result];

  return `${resultText}: ${labelChoice(game.playerChoice)} vs ${labelChoice(game.computerChoice)}`;
}

function render() {
  scoreElement.textContent = `Player ${game.score.player} - Computer ${game.score.computer}`;
  statusElement.textContent = statusText();
}

window.gameLogic.CHOICES.forEach((choice) => {
  const button = document.createElement('button');
  button.className = 'choice';
  button.type = 'button';
  button.textContent = labelChoice(choice);
  button.addEventListener('click', () => {
    game = window.gameLogic.playRound(game, choice, chooseComputer);
    render();
  });
  choicesElement.appendChild(button);
});

resetButton.addEventListener('click', () => {
  game = window.gameLogic.createGame();
  render();
});

render();
