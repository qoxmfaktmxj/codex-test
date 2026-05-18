const {
  TOTAL_HOLES,
  MAX_MISSES,
  createGame,
  hitHole,
  nextMole,
  isGameOver,
} = window.gameLogic;

const board = document.querySelector('[data-board]');
const score = document.querySelector('[data-score]');
const misses = document.querySelector('[data-misses]');
const round = document.querySelector('[data-round]');
const message = document.querySelector('[data-message]');
const resetButton = document.querySelector('[data-reset]');

let game = createGame();
let timer = null;

function draw() {
  board.innerHTML = '';

  for (let index = 0; index < TOTAL_HOLES; index += 1) {
    const hole = document.createElement('button');
    const number = index + 1;
    hole.type = 'button';
    hole.className = `hole${index === game.moleIndex && !isGameOver(game) ? ' has-mole' : ''}`;
    hole.setAttribute('aria-label', `${number}번 구멍`);
    hole.dataset.index = String(index);
    board.appendChild(hole);
  }

  score.textContent = `점수: ${game.score}`;
  misses.textContent = `실수: ${game.misses} / ${MAX_MISSES}`;
  round.textContent = `라운드: ${game.round}`;
  message.textContent = game.message;
}

function stopTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function advance() {
  if (isGameOver(game)) {
    stopTimer();
    draw();
    return;
  }

  game = nextMole({
    ...game,
    misses: game.misses + 1,
    message: '놓쳤어요!',
  });

  if (game.misses >= MAX_MISSES) {
    game = {
      ...game,
      status: '게임 종료',
      message: '게임 종료',
    };
    stopTimer();
  }

  draw();
}

function startTimer() {
  stopTimer();
  timer = setInterval(advance, 1200);
}

board.addEventListener('click', (event) => {
  const hole = event.target.closest('[data-index]');
  if (!hole) {
    return;
  }

  game = hitHole(game, Number(hole.dataset.index));
  draw();

  if (isGameOver(game)) {
    stopTimer();
  } else {
    startTimer();
  }
});

resetButton.addEventListener('click', () => {
  game = createGame();
  draw();
  startTimer();
});

draw();
startTimer();
