const boardNode = document.querySelector('[data-board]');
const turnNode = document.querySelector('[data-turn]');
const messageNode = document.querySelector('[data-message]');
const hintNode = document.querySelector('[data-hint]');
let game = Konane.createGame();
let selected = null;

function hint() {
  if (game.status !== '진행 중') return '새 게임을 누르면 다시 시작합니다.';
  if (game.phase === '시작 제거') return '가운데의 검은 돌 하나를 눌러 시작하세요.';
  if (game.phase === '상대 제거') return '상대가 흰 돌 하나를 치우고 있습니다.';
  return selected === null ? '움직일 검은 돌을 고르세요.' : '노란 테두리의 빈칸을 눌러 뛰어넘으세요.';
}

function render() {
  const moves = Konane.legalMoves(game);
  const targets = selected === null ? [] : moves.filter((move) => move.from === selected).map((move) => move.to);
  boardNode.innerHTML = '';
  game.board.forEach((piece, index) => {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = `cell${piece === Konane.PLAYER ? ' player' : ''}${piece === Konane.COMPUTER ? ' computer' : ''}${index === selected ? ' selected' : ''}${targets.includes(index) ? ' target' : ''}`;
    cell.disabled = game.status !== '진행 중' || game.turn !== Konane.PLAYER || (!moves.some((move) => move.from === index) && !targets.includes(index));
    cell.setAttribute('aria-label', `${Math.floor(index / Konane.SIZE) + 1}행 ${index % Konane.SIZE + 1}열 ${piece || '빈 자리'}`);
    cell.addEventListener('click', () => play(index, moves, targets));
    boardNode.appendChild(cell);
  });
  turnNode.textContent = game.status === '진행 중' ? `${game.turn} 차례` : game.status;
  messageNode.textContent = game.message;
  hintNode.textContent = hint();
}

function computerTurn() {
  if (game.status !== '진행 중' || game.turn !== Konane.COMPUTER) return;
  const move = Konane.chooseComputerMove(game);
  if (move) game = Konane.applyMove(game, move);
  render();
}

function play(index, moves, targets) {
  if (game.phase !== '도약') {
    game = Konane.applyMove(game, { from: index });
    render();
    window.setTimeout(computerTurn, 450);
    return;
  }
  if (targets.includes(index)) {
    game = Konane.applyMove(game, { from: selected, to: index });
    selected = null;
    render();
    if (game.status === '진행 중') window.setTimeout(computerTurn, 450);
    return;
  }
  if (moves.some((move) => move.from === index)) selected = index;
  render();
}

document.querySelector('[data-reset]').addEventListener('click', () => { game = Konane.createGame(); selected = null; render(); });
render();
