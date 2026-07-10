const boardElement = document.querySelector('#board');
const turnElement = document.querySelector('#turn');
const statusElement = document.querySelector('#status');
const messageElement = document.querySelector('#message');
const resetButton = document.querySelector('#reset-button');

let game = Hexapawn.createGame();
let selected = null;

function getTurnLabel(turn) {
  return turn === Hexapawn.PLAYER ? '나' : '컴퓨터';
}

function isSameSquare(a, b) {
  return a && b && a[0] === b[0] && a[1] === b[1];
}

function getSelectedMoves() {
  if (!selected) {
    return [];
  }
  return Hexapawn.getLegalMoves(game, selected[0], selected[1]);
}

function render() {
  boardElement.innerHTML = '';
  const selectedMoves = getSelectedMoves();

  game.board.forEach((row, rowIndex) => {
    row.forEach((cell, colIndex) => {
      const square = document.createElement('button');
      const move = selectedMoves.find((candidate) => isSameSquare(candidate.to, [rowIndex, colIndex]));
      const isSelected = isSameSquare(selected, [rowIndex, colIndex]);

      square.type = 'button';
      square.className = 'square';
      square.dataset.row = rowIndex;
      square.dataset.col = colIndex;
      square.setAttribute('aria-label', `${rowIndex + 1}행 ${colIndex + 1}열`);

      if ((rowIndex + colIndex) % 2 === 0) {
        square.classList.add('is-light');
      }

      if (isSelected) {
        square.classList.add('is-selected');
      }

      if (move) {
        square.classList.add(move.capture ? 'is-capture' : 'is-move');
      }

      if (cell) {
        const piece = document.createElement('span');
        piece.className = `piece ${cell === Hexapawn.PLAYER ? 'piece-player' : 'piece-computer'}`;
        piece.textContent = cell === Hexapawn.PLAYER ? '나' : '컴';
        square.append(piece);
      }

      boardElement.append(square);
    });
  });

  turnElement.textContent = getTurnLabel(game.turn);
  statusElement.textContent = game.status;
  messageElement.textContent = game.message;
}

function finishComputerTurn() {
  game = Hexapawn.playComputerTurn(game);
  selected = null;
  render();
}

function handleBoardClick(event) {
  const square = event.target.closest('.square');
  if (!square || game.status !== '진행 중' || game.turn !== Hexapawn.PLAYER) {
    return;
  }

  const row = Number(square.dataset.row);
  const col = Number(square.dataset.col);
  const cell = game.board[row][col];

  if (selected) {
    const legalMove = getSelectedMoves().find((move) => isSameSquare(move.to, [row, col]));
    if (legalMove) {
      game = Hexapawn.movePiece(game, selected, [row, col]);
      selected = null;
      render();

      if (game.status === '진행 중') {
        window.setTimeout(finishComputerTurn, 450);
      }
      return;
    }
  }

  if (cell === Hexapawn.PLAYER) {
    selected = [row, col];
    game = {
      ...game,
      message: '갈 수 있는 칸이 표시됩니다.',
    };
  } else {
    selected = null;
    game = {
      ...game,
      message: '내 말을 먼저 선택하세요.',
    };
  }

  render();
}

function resetGame() {
  game = Hexapawn.createGame();
  selected = null;
  render();
}

boardElement.addEventListener('click', handleBoardClick);
resetButton.addEventListener('click', resetGame);

render();
