const boardNode = document.querySelector('[data-board]');
const turnNode = document.querySelector('[data-turn]');
const messageNode = document.querySelector('[data-message]');
let game = Hex.createGame();

function render() {
  boardNode.innerHTML = '';
  game.board.forEach((piece, index) => {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = `cell${piece === Hex.PLAYER ? ' player' : ''}${piece === Hex.COMPUTER ? ' computer' : ''}`;
    cell.disabled = game.status !== '진행 중' || game.turn !== Hex.PLAYER || piece !== Hex.EMPTY;
    cell.setAttribute('aria-label', `${Math.floor(index / Hex.SIZE) + 1}행 ${index % Hex.SIZE + 1}열 ${piece || '빈 칸'}`);
    cell.addEventListener('click', () => play(index));
    boardNode.appendChild(cell);
  });
  turnNode.textContent = game.status === '진행 중' ? `${game.turn} 차례` : game.status;
  messageNode.textContent = game.message;
}

function computerTurn() {
  if (game.status === '진행 중' && game.turn === Hex.COMPUTER) {
    const index = Hex.chooseComputerMove(game);
    if (index !== null) game = Hex.applyMove(game, index);
    render();
  }
}

function play(index) {
  if (game.status !== '진행 중' || game.turn !== Hex.PLAYER) return;
  try {
    game = Hex.applyMove(game, index);
    render();
    if (game.status === '진행 중') window.setTimeout(computerTurn, 350);
  } catch (error) { messageNode.textContent = error.message; }
}

document.querySelector('[data-reset]').addEventListener('click', () => { game = Hex.createGame(); render(); });
render();
