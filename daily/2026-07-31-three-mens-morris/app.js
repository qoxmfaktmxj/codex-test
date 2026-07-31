const boardNode = document.querySelector('[data-board]');
const playerCountNode = document.querySelector('[data-player-count]');
const computerCountNode = document.querySelector('[data-computer-count]');
const turnNode = document.querySelector('[data-turn]');
const messageNode = document.querySelector('[data-message]');
const resetButton = document.querySelector('[data-reset]');

let game = Morris.createGame();
let selected = null;

function tokenCount(player) {
  return game.board.filter((piece) => piece === player).length;
}

function render() {
  boardNode.innerHTML = '';
  const moves = game.turn === Morris.PLAYER && game.status === '진행 중' ? Morris.availableMoves(game) : [];
  const targets = selected === null ? moves.filter((move) => move.from === undefined).map((move) => move.to) : moves.filter((move) => move.from === selected).map((move) => move.to);
  game.board.forEach((piece, index) => {
    const point = document.createElement('button');
    const selectable = game.turn === Morris.PLAYER && game.phase === '이동' && piece === Morris.PLAYER;
    point.type = 'button';
    point.className = `point${piece === Morris.PLAYER ? ' player' : ''}${piece === Morris.COMPUTER ? ' computer' : ''}${selected === index ? ' selected' : ''}${targets.includes(index) ? ' available' : ''}`;
    point.disabled = !selectable && !targets.includes(index);
    point.setAttribute('aria-label', `${index + 1}번 교차점 ${piece || '빈 자리'}`);
    point.innerHTML = piece ? `<span class="piece">${piece}</span>` : '';
    point.addEventListener('click', () => play(index));
    boardNode.appendChild(point);
  });
  playerCountNode.textContent = tokenCount(Morris.PLAYER);
  computerCountNode.textContent = tokenCount(Morris.COMPUTER);
  turnNode.textContent = game.status === '진행 중' ? `${game.turn} 차례 · ${game.phase}` : game.status;
  messageNode.textContent = game.message;
}

function computerTurn() {
  if (game.status !== '진행 중' || game.turn !== Morris.COMPUTER) return;
  const move = Morris.chooseComputerMove(game);
  if (!move) return;
  game = Morris.applyMove(game, move);
  render();
}

function play(index) {
  if (game.status !== '진행 중' || game.turn !== Morris.PLAYER) return;
  if (game.phase === '놓기') {
    game = Morris.applyMove(game, { to: index });
  } else if (game.board[index] === Morris.PLAYER) {
    selected = selected === index ? null : index;
    render();
    return;
  } else if (selected !== null) {
    game = Morris.applyMove(game, { from: selected, to: index });
  }
  selected = null;
  render();
  if (game.status === '진행 중' && game.turn === Morris.COMPUTER) window.setTimeout(computerTurn, 420);
}

resetButton.addEventListener('click', () => {
  game = Morris.createGame();
  selected = null;
  render();
});

render();
