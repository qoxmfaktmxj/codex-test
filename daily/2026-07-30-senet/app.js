const trackNode = document.querySelector('[data-track]');
const playerHomeNode = document.querySelector('[data-player-home]');
const computerHomeNode = document.querySelector('[data-computer-home]');
const turnNode = document.querySelector('[data-turn]');
const rollNode = document.querySelector('[data-roll]');
const messageNode = document.querySelector('[data-message]');
const throwButton = document.querySelector('[data-throw]');
const resetButton = document.querySelector('[data-reset]');

let game = Senet.createGame();
let readyToMove = false;

function render() {
  trackNode.innerHTML = '';
  game.board.forEach((piece, index) => {
    const cell = document.createElement('button');
    const canMove = readyToMove && game.turn === Senet.PLAYER && game.status === '진행 중'
      && Senet.availableMoves(game).some((move) => move.from === index);
    cell.type = 'button';
    cell.className = `cell${piece === Senet.PLAYER ? ' player' : ''}${piece === Senet.COMPUTER ? ' computer' : ''}${[3, 7, 11].includes(index) ? ' marked' : ''}`;
    cell.disabled = !canMove;
    cell.setAttribute('aria-label', `${index + 1}번 칸 ${piece || '빈칸'}`);
    cell.innerHTML = `<span>${index + 1}</span>${piece ? `<b>${piece}</b>` : ''}`;
    cell.addEventListener('click', () => movePlayer(index));
    trackNode.appendChild(cell);
  });
  playerHomeNode.textContent = game.home.player;
  computerHomeNode.textContent = game.home.computer;
  turnNode.textContent = game.status === '진행 중' ? `${game.turn} 차례` : game.status;
  rollNode.textContent = game.roll;
  messageNode.textContent = game.message;
  throwButton.disabled = game.status !== '진행 중' || game.turn !== Senet.PLAYER || readyToMove;
}

function computerTurn() {
  if (game.status !== '진행 중' || game.turn !== Senet.COMPUTER) return;
  const roll = Math.floor(Math.random() * 5) + 1;
  const move = Senet.chooseComputerMove(game, roll);
  if (!move) {
    game = { ...game, turn: Senet.PLAYER, roll, message: `상대가 ${roll}을 던졌지만 움직일 말이 없습니다. 내 차례입니다.` };
  } else {
    game = Senet.moveToken({ ...game, roll }, move.from, roll);
    if (game.status === '진행 중' && game.turn === Senet.COMPUTER) {
      window.setTimeout(computerTurn, 450);
    }
  }
  render();
}

function movePlayer(index) {
  if (!readyToMove) return;
  try {
    game = Senet.moveToken(game, index, game.roll);
    readyToMove = false;
    render();
    if (game.turn === Senet.COMPUTER && game.status === '진행 중') window.setTimeout(computerTurn, 450);
  } catch (error) {
    game = { ...game, message: error.message };
    render();
  }
}

throwButton.addEventListener('click', () => {
  game = { ...game, roll: Math.floor(Math.random() * 5) + 1 };
  const moves = Senet.availableMoves(game);
  readyToMove = moves.length > 0;
  if (!readyToMove) game = { ...game, turn: Senet.COMPUTER, message: `막대 ${game.roll}칸으로 움직일 말이 없습니다. 상대 차례입니다.` };
  render();
  if (!readyToMove && game.status === '진행 중') window.setTimeout(computerTurn, 450);
});

resetButton.addEventListener('click', () => {
  game = Senet.createGame();
  readyToMove = false;
  render();
});

render();
