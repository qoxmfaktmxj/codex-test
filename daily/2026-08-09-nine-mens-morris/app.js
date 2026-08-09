const boardNode = document.querySelector('[data-board]');
const messageNode = document.querySelector('[data-message]');
const playerCountNode = document.querySelector('[data-player-count]');
const computerCountNode = document.querySelector('[data-computer-count]');
const spots = [[4,4],[50,4],[96,4],[17,17],[50,17],[83,17],[31,31],[50,31],[69,31],[4,50],[17,50],[31,50],[69,50],[83,50],[96,50],[31,69],[50,69],[69,69],[17,83],[50,83],[83,83],[4,96],[50,96],[96,96]];
let game = Morris.createGame();
let selected = null;
let computerTimer = null;

function pieces(player) { return game.board.filter((piece) => piece === player).length + game.reserve[player]; }
function canPlayerAct(position) {
  if (game.status !== '진행 중' || game.turn !== Morris.PLAYER) return false;
  if (game.phase === '잡기') return Morris.getLegalMoves(game).includes(position);
  if (game.reserve[Morris.PLAYER] > 0) return game.board[position] === null;
  if (selected !== null) return Morris.getMoveDestinations(game, selected).includes(position) || game.board[position] === Morris.PLAYER;
  return game.board[position] === Morris.PLAYER && Morris.getMoveDestinations(game, position).length > 0;
}

function render() {
  boardNode.querySelectorAll('button').forEach((node) => node.remove());
  spots.forEach(([left, top], position) => {
    const piece = game.board[position];
    const button = document.createElement('button');
    button.type = 'button'; button.className = `spot ${piece === Morris.PLAYER ? 'player' : piece === Morris.COMPUTER ? 'computer' : 'empty'} ${selected === position ? 'selected' : ''}`;
    button.style.left = `${left}%`; button.style.top = `${top}%`; button.disabled = !canPlayerAct(position);
    button.setAttribute('aria-label', piece ? `${position + 1}번 자리, ${piece} 말` : `${position + 1}번 빈자리`);
    button.addEventListener('click', () => playPlayer(position)); boardNode.appendChild(button);
  });
  playerCountNode.textContent = `당신 말 ${pieces(Morris.PLAYER)}개`;
  computerCountNode.textContent = `컴퓨터 말 ${pieces(Morris.COMPUTER)}개`;
  messageNode.textContent = game.message;
}

function playPlayer(position) {
  if (game.phase === '잡기') game = Morris.removePiece(game, position);
  else if (game.reserve[Morris.PLAYER] > 0) game = Morris.placePiece(game, position);
  else if (selected === null || game.board[position] === Morris.PLAYER) selected = position;
  else { game = Morris.movePiece(game, selected, position); selected = null; }
  render(); scheduleComputer();
}

function computerPlay() {
  if (game.status !== '진행 중' || game.turn !== Morris.COMPUTER) return;
  if (game.phase === '잡기') game = Morris.removePiece(game, Morris.getLegalMoves(game)[0]);
  else if (game.reserve[Morris.COMPUTER] > 0) game = Morris.placePiece(game, Morris.getLegalMoves(game)[0]);
  else { const from = Morris.getLegalMoves(game)[0]; game = Morris.movePiece(game, from, Morris.getMoveDestinations(game, from)[0]); }
  render();
  if (game.turn === Morris.COMPUTER && game.status === '진행 중') scheduleComputer();
}
function scheduleComputer() { if (computerTimer) clearTimeout(computerTimer); if (game.turn === Morris.COMPUTER && game.status === '진행 중') computerTimer = setTimeout(computerPlay, 460); }
document.querySelector('[data-reset]').addEventListener('click', () => { if (computerTimer) clearTimeout(computerTimer); game = Morris.createGame(); selected = null; render(); });
render();
