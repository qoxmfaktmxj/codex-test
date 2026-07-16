const turnEl = document.getElementById('turn');
const rollEl = document.getElementById('roll');
const statusEl = document.getElementById('status');
const boardEl = document.getElementById('board');
const messageEl = document.getElementById('message');
const rollButton = document.getElementById('roll-button');
const resetButton = document.getElementById('reset-button');
const pieceContainers = {
  빨강: document.getElementById('red-pieces'),
  파랑: document.getElementById('blue-pieces'),
};

let game = MiniLudo.createGame({ piecesPerPlayer: 3 });

function pieceLabel(position) {
  if (position === -1) {
    return '집';
  }
  if (position === MiniLudo.FINISH) {
    return '도착';
  }
  return `${position + 1}칸`;
}

function renderBoard() {
  boardEl.innerHTML = '';
  for (let index = 0; index < MiniLudo.BOARD_SIZE; index += 1) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    if (index === MiniLudo.STARTS.빨강) {
      cell.classList.add('red-start');
    }
    if (index === MiniLudo.STARTS.파랑) {
      cell.classList.add('blue-start');
    }

    const number = document.createElement('span');
    number.className = 'cell-number';
    number.textContent = index + 1;
    cell.append(number);

    MiniLudo.PLAYERS.forEach((player) => {
      game.players[player].pieces.forEach((position, pieceIndex) => {
        if (MiniLudo.getAbsolutePosition(player, position) === index) {
          const piece = document.createElement('span');
          piece.className = `token ${player === '빨강' ? 'red-token' : 'blue-token'}`;
          piece.textContent = pieceIndex + 1;
          cell.append(piece);
        }
      });
    });
    boardEl.append(cell);
  }
}

function renderPieces() {
  const legalMoves = MiniLudo.getLegalMoves(game);
  MiniLudo.PLAYERS.forEach((player) => {
    const container = pieceContainers[player];
    container.innerHTML = '';
    game.players[player].pieces.forEach((position, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'piece-button';
      button.disabled = game.currentPlayer !== player || !legalMoves.includes(index);
      button.innerHTML = `<strong>${index + 1}번 말</strong><span>${pieceLabel(position)}</span>`;
      button.addEventListener('click', () => {
        game = MiniLudo.movePiece(game, index);
        render();
      });
      container.append(button);
    });
  });
}

function render() {
  turnEl.textContent = game.currentPlayer;
  turnEl.className = game.currentPlayer === '빨강' ? 'red-text' : 'blue-text';
  rollEl.textContent = game.roll === null ? '대기' : `${game.roll}`;
  statusEl.textContent = game.status;
  messageEl.textContent = game.message;
  rollButton.disabled = game.status !== '진행 중' || game.roll !== null;
  renderBoard();
  renderPieces();
}

rollButton.addEventListener('click', () => {
  game = MiniLudo.rollDie(game);
  render();
});

resetButton.addEventListener('click', () => {
  game = MiniLudo.createGame({ piecesPerPlayer: 3 });
  render();
});

render();
