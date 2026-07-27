const boardElement = document.getElementById('board');
const phaseElement = document.getElementById('phase');
const turnElement = document.getElementById('turn');
const remainingElement = document.getElementById('remaining');
const messageElement = document.getElementById('message');
const resetButton = document.getElementById('reset');

let game = Tapatan.createGame();
let selected = null;

function pointName(index) {
  return `${Math.floor(index / 3) + 1}행 ${index % 3 + 1}열`;
}

function getLegalTargets() {
  if (selected === null) {
    return [];
  }
  return Tapatan.getLegalMoves(game, selected);
}

function render() {
  phaseElement.textContent = game.phase;
  turnElement.textContent = game.turn === Tapatan.PLAYER ? '나' : '컴퓨터';
  remainingElement.textContent = `나 ${game.remaining.X} · 컴퓨터 ${game.remaining.O}`;
  messageElement.textContent = game.message;

  const targets = getLegalTargets();
  boardElement.innerHTML = '';
  game.board.forEach((cell, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'point';
    button.dataset.point = String(index);
    button.setAttribute('aria-label', `${pointName(index)} ${cell === null ? '빈 점' : cell === Tapatan.PLAYER ? '내 말' : '컴퓨터 말'}`);
    button.textContent = cell === Tapatan.PLAYER ? '●' : cell === Tapatan.COMPUTER ? '◆' : '';

    if (cell === Tapatan.PLAYER) {
      button.classList.add('player');
    }
    if (cell === Tapatan.COMPUTER) {
      button.classList.add('computer');
    }
    if (selected === index) {
      button.classList.add('selected');
    }
    if (targets.includes(index)) {
      button.classList.add('target');
    }
    if (game.turn !== Tapatan.PLAYER || game.status !== '진행 중') {
      button.disabled = true;
    }

    button.addEventListener('click', () => handlePoint(index));
    boardElement.appendChild(button);
  });
}

function scheduleComputerTurn() {
  if (game.turn !== Tapatan.COMPUTER || game.status !== '진행 중') {
    return;
  }

  window.setTimeout(() => {
    game = Tapatan.playComputerTurn(game);
    selected = null;
    render();
  }, 420);
}

function handlePoint(index) {
  if (game.turn !== Tapatan.PLAYER || game.status !== '진행 중') {
    return;
  }

  try {
    if (game.phase === Tapatan.PLACE_PHASE) {
      game = Tapatan.placeStone(game, index);
      selected = null;
    } else if (selected === null) {
      if (game.board[index] !== Tapatan.PLAYER) {
        game = { ...game, message: '옮길 내 말을 먼저 고르세요.' };
      } else {
        selected = index;
        game = { ...game, selected, message: '이동할 빈 점을 고르세요.' };
      }
    } else if (selected === index) {
      selected = null;
      game = { ...game, selected: null, message: '내 말을 골라 인접한 빈 점으로 옮기세요.' };
    } else {
      game = Tapatan.moveStone(game, selected, index);
      selected = null;
    }
  } catch (error) {
    game = { ...game, message: error.message };
  }

  render();
  scheduleComputerTurn();
}

resetButton.addEventListener('click', () => {
  game = Tapatan.createGame();
  selected = null;
  render();
});

render();
