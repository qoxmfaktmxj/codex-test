const boardNode = document.querySelector('[data-board]');
const messageNode = document.querySelector('[data-message]');
const goatsLeftNode = document.querySelector('[data-goats-left]');
const capturedNode = document.querySelector('[data-captured]');
let game = BaghChal.createGame();
let selected = null;
let computerTimer = null;

function isPlayerAction(spot) {
  if (game.status !== '진행 중' || game.turn !== BaghChal.GOAT) return false;
  if (game.goatsToPlace > 0) return game.board[spot] === null;
  if (selected !== null) return game.board[spot] === BaghChal.GOAT || BaghChal.getDestinations(game, selected).includes(spot);
  return game.board[spot] === BaghChal.GOAT && BaghChal.getDestinations(game, spot).length > 0;
}

function render() {
  boardNode.querySelectorAll('button').forEach((node) => node.remove());
  game.board.forEach((piece, spot) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `spot ${piece === BaghChal.GOAT ? 'goat' : piece === BaghChal.TIGER ? 'tiger' : 'empty'} ${selected === spot ? 'selected' : ''}`;
    button.disabled = !isPlayerAction(spot);
    button.setAttribute('aria-label', `${spot + 1}번 ${piece || '빈'} 자리`);
    button.addEventListener('click', () => playerPlay(spot));
    boardNode.appendChild(button);
  });
  goatsLeftNode.textContent = game.goatsToPlace;
  capturedNode.textContent = game.capturedGoats;
  messageNode.textContent = game.message;
}

function playerPlay(spot) {
  if (game.goatsToPlace > 0) game = BaghChal.placeGoat(game, spot);
  else if (selected === null || game.board[spot] === BaghChal.GOAT) selected = spot;
  else { game = BaghChal.movePiece(game, selected, spot); selected = null; }
  render();
  scheduleComputer();
}

function computerPlay() {
  if (game.status !== '진행 중' || game.turn !== BaghChal.TIGER) return;
  const options = game.board.flatMap((piece, from) => piece === BaghChal.TIGER ? BaghChal.getDestinations(game, from).map((to) => ({ from, to })) : []);
  const jump = options.find(({ from, to }) => Math.abs(Math.floor(from / 5) - Math.floor(to / 5)) === 2 || Math.abs((from % 5) - (to % 5)) === 2);
  const move = jump || options[Math.floor(Math.random() * options.length)];
  if (move) game = BaghChal.movePiece(game, move.from, move.to);
  render();
}

function scheduleComputer() {
  if (computerTimer) clearTimeout(computerTimer);
  if (game.status === '진행 중' && game.turn === BaghChal.TIGER) computerTimer = setTimeout(computerPlay, 520);
}

document.querySelector('[data-reset]').addEventListener('click', () => {
  if (computerTimer) clearTimeout(computerTimer);
  game = BaghChal.createGame();
  selected = null;
  render();
});
render();
