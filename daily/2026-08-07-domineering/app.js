const boardNode = document.querySelector('[data-board]');
const messageNode = document.querySelector('[data-message]');
let game = Domineering.createGame();
let computerTimer = null;

function render() {
  boardNode.innerHTML = '';
  const legalMoves = Domineering.getLegalMoves(game.board, Domineering.HORIZONTAL);
  game.board.forEach((line, row) => line.forEach((piece, column) => {
    const cell = document.createElement('button');
    cell.type = 'button'; cell.className = `cell ${piece || ''}`;
    cell.disabled = game.status !== '진행 중' || game.turn !== Domineering.HORIZONTAL || !legalMoves.some((move) => move.row === row && move.column === column);
    cell.setAttribute('aria-label', piece ? `${piece} 도미노` : `${row + 1}행 ${column + 1}열`);
    cell.addEventListener('click', () => {
      game = Domineering.placeDomino(game, row, column); render(); scheduleComputer();
    });
    boardNode.appendChild(cell);
  }));
  messageNode.textContent = game.message;
}

function scheduleComputer() {
  if (computerTimer) clearTimeout(computerTimer);
  if (game.status !== '진행 중' || game.turn !== Domineering.VERTICAL) return;
  computerTimer = setTimeout(() => {
    const moves = Domineering.getLegalMoves(game.board, Domineering.VERTICAL);
    const move = moves[Math.floor(Math.random() * moves.length)];
    game = Domineering.placeDomino(game, move.row, move.column);
    render();
  }, 420);
}

document.querySelector('[data-reset]').addEventListener('click', () => {
  if (computerTimer) clearTimeout(computerTimer);
  game = Domineering.createGame(); render();
});
render();
