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
  return {
    rock: '바위',
    paper: '보',
    scissors: '가위',
  }[choice];
}

function statusText() {
  if (!game.result) {
    return '수를 고르세요';
  }

  const resultText = {
    win: '승리',
    lose: '컴퓨터 승리',
    draw: '무승부',
  }[game.result];

  return `${resultText}: ${labelChoice(game.playerChoice)} 대 ${labelChoice(game.computerChoice)}`;
}

function render() {
  scoreElement.textContent = `플레이어 ${game.score.player} - 컴퓨터 ${game.score.computer}`;
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
