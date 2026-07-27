const cupsElement = document.getElementById('cups');
const messageElement = document.getElementById('status-message');
const shuffleButton = document.getElementById('shuffle-button');
const restartButton = document.getElementById('restart-button');

let game = ShellGame.resetGame();
let isAnimating = false;
let shuffleRun = 0;

function render() {
  messageElement.textContent = game.message;
  cupsElement.innerHTML = '';

  game.cupOrder.forEach((cupId, position) => {
    const button = document.createElement('button');
    button.className = 'cup-button';
    button.type = 'button';
    button.disabled = game.status !== '추리 중' || isAnimating;
    button.setAttribute('aria-label', `${position + 1}번 위치`);

    const revealPosition = game.status === '준비' ? ShellGame.getBallPosition(game) : game.correctCup;
    const shouldReveal = game.status === '준비' || game.status === '정답' || game.status === '오답';
    if (shouldReveal && position === revealPosition) {
      button.classList.add('revealed', 'correct');
    }
    if (shouldReveal && position === game.selectedCup && position !== game.correctCup) {
      button.classList.add('wrong');
    }

    const cup = document.createElement('div');
    cup.className = 'cup';
    cup.textContent = String(cupId + 1);

    const ball = document.createElement('div');
    ball.className = 'ball';

    button.append(cup, ball);
    button.addEventListener('click', () => {
      game = ShellGame.guessCup(game, position);
      render();
    });
    cupsElement.append(button);
  });

  shuffleButton.disabled = isAnimating;
  shuffleButton.textContent = game.status === '정답' || game.status === '오답' ? '다시 섞기' : '섞기';
}

function wait(milliseconds) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

async function shuffleCups() {
  if (isAnimating) {
    return;
  }

  if (game.status === '정답' || game.status === '오답') {
    game = ShellGame.resetGame();
  }

  isAnimating = true;
  const runId = shuffleRun + 1;
  shuffleRun = runId;
  render();

  while (['준비', '섞는 중'].includes(game.status) && runId === shuffleRun) {
    await wait(360);
    if (runId !== shuffleRun) {
      return;
    }
    game = ShellGame.applyNextSwap(game);
    render();
  }

  if (runId !== shuffleRun) {
    return;
  }

  isAnimating = false;
  render();
}

shuffleButton.addEventListener('click', shuffleCups);
restartButton.addEventListener('click', () => {
  shuffleRun += 1;
  game = ShellGame.resetGame();
  isAnimating = false;
  render();
});

render();
