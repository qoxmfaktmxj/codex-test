const boardElement = document.getElementById('board');
const turnElement = document.getElementById('turn');
const statusElement = document.getElementById('status');
const messageElement = document.getElementById('message');
const resetButton = document.getElementById('reset');

let game = FoxAndHounds.createGame();

function samePoint(a, b) {
  return a.row === b.row && a.col === b.col;
}

function pointLabel(point) {
  return `${point.row + 1}행 ${point.col + 1}열`;
}

function getHoundIndexAt(point) {
  return game.hounds.findIndex((hound) => samePoint(hound, point));
}

function getFoxTargets() {
  return game.turn === FoxAndHounds.FOX ? FoxAndHounds.getFoxMoves(game) : [];
}

function isLastMoveTo(point) {
  return game.lastMove && samePoint(game.lastMove.to, point);
}

function render() {
  turnElement.textContent = game.turn === FoxAndHounds.FOX ? '여우' : '사냥개';
  statusElement.textContent = game.status;
  messageElement.textContent = game.message;
  boardElement.innerHTML = '';

  const foxTargets = getFoxTargets();
  for (let row = 0; row < FoxAndHounds.BOARD_SIZE; row += 1) {
    for (let col = 0; col < FoxAndHounds.BOARD_SIZE; col += 1) {
      const point = { row, col };
      const square = document.createElement('button');
      const houndIndex = getHoundIndexAt(point);
      const hasFox = samePoint(game.fox, point);
      const isDark = (row + col) % 2 === 1;

      square.type = 'button';
      square.className = `square ${isDark ? 'dark' : 'light'}`;
      square.setAttribute('aria-label', pointLabel(point));
      square.disabled = game.turn !== FoxAndHounds.FOX || game.status !== '진행 중' || !foxTargets.some((target) => samePoint(target, point));

      if (hasFox) {
        square.classList.add('fox');
        square.textContent = '여';
        square.setAttribute('aria-label', `${pointLabel(point)} 여우`);
      } else if (houndIndex >= 0) {
        square.classList.add('hound');
        square.textContent = '개';
        square.setAttribute('aria-label', `${pointLabel(point)} 사냥개 ${houndIndex + 1}`);
      } else if (foxTargets.some((target) => samePoint(target, point))) {
        square.classList.add('target');
        square.textContent = '•';
        square.setAttribute('aria-label', `${pointLabel(point)} 이동 가능`);
      } else {
        square.textContent = '';
      }

      if (isLastMoveTo(point)) {
        square.classList.add('last');
      }

      square.addEventListener('click', () => handleSquare(point));
      boardElement.appendChild(square);
    }
  }
}

function scheduleComputerTurn() {
  if (game.turn !== FoxAndHounds.HOUNDS || game.status !== '진행 중') {
    return;
  }

  window.setTimeout(() => {
    game = FoxAndHounds.playComputerTurn(game);
    render();
  }, 460);
}

function handleSquare(point) {
  if (game.turn !== FoxAndHounds.FOX || game.status !== '진행 중') {
    return;
  }

  try {
    game = FoxAndHounds.moveFox(game, point);
  } catch (error) {
    game = { ...game, message: error.message };
  }

  render();
  scheduleComputerTurn();
}

resetButton.addEventListener('click', () => {
  game = FoxAndHounds.createGame();
  render();
});

render();
