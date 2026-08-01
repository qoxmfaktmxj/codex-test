const boardNode = document.querySelector('[data-board]');
const playerCountNode = document.querySelector('[data-player-count]');
const computerCountNode = document.querySelector('[data-computer-count]');
const turnNode = document.querySelector('[data-turn]');
const messageNode = document.querySelector('[data-message]');
let game = MuTorere.createGame();
let selected = null;
function render() {
  boardNode.innerHTML = '';
  const moves = game.turn === MuTorere.PLAYER && game.status === '진행 중' ? MuTorere.availableMoves(game) : [];
  const targets = selected === null ? [] : moves.filter((move) => move.from === selected).map((move) => move.to);
  game.board.forEach((piece, index) => {
    const point = document.createElement('button');
    const selectable = game.turn === MuTorere.PLAYER && piece === MuTorere.PLAYER;
    point.type = 'button'; point.className = `point point-${index}${piece === MuTorere.PLAYER ? ' player' : ''}${piece === MuTorere.COMPUTER ? ' computer' : ''}${selected === index ? ' selected' : ''}${targets.includes(index) ? ' available' : ''}`;
    point.disabled = !selectable && !targets.includes(index); point.setAttribute('aria-label', `${index + 1}번 자리 ${piece || '빈 자리'}`);
    point.innerHTML = piece ? `<span class="piece">${piece}</span>` : ''; point.addEventListener('click', () => play(index)); boardNode.appendChild(point);
  });
  playerCountNode.textContent = game.board.filter((piece) => piece === MuTorere.PLAYER).length;
  computerCountNode.textContent = game.board.filter((piece) => piece === MuTorere.COMPUTER).length;
  turnNode.textContent = game.status === '진행 중' ? `${game.turn} 차례` : game.status; messageNode.textContent = game.message;
}
function computerTurn() { if (game.status === '진행 중' && game.turn === MuTorere.COMPUTER) { const move = MuTorere.chooseComputerMove(game); if (move) game = MuTorere.applyMove(game, move); render(); } }
function play(index) {
  if (game.status !== '진행 중' || game.turn !== MuTorere.PLAYER) return;
  if (game.board[index] === MuTorere.PLAYER) { selected = selected === index ? null : index; render(); return; }
  if (selected === null) return;
  try { game = MuTorere.applyMove(game, { from: selected, to: index }); selected = null; render(); if (game.status === '진행 중') window.setTimeout(computerTurn, 420); }
  catch (error) { selected = null; render(); messageNode.textContent = error.message; }
}
document.querySelector('[data-reset]').addEventListener('click', () => { game = MuTorere.createGame(); selected = null; render(); });
render();
