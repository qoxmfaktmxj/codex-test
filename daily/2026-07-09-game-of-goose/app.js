(function startGame() {
  const board = document.querySelector('#board');
  const humanPosition = document.querySelector('#human-position');
  const computerPosition = document.querySelector('#computer-position');
  const turnLabel = document.querySelector('#turn-label');
  const dieOne = document.querySelector('#die-one');
  const dieTwo = document.querySelector('#die-two');
  const message = document.querySelector('#message');
  const rollButton = document.querySelector('#roll-button');
  const resetButton = document.querySelector('#reset-button');

  let game = GameOfGoose.createGame();
  let computerTimer = null;

  function getCellLabel(index) {
    if (index === 0) return '출발';
    if (index === GameOfGoose.FINISH) return '도착';
    if (GameOfGoose.GOOSE_SQUARES.includes(index)) return '거위';
    if (index === 6) return '다리';
    if (index === 24) return '미로';
    if (index === 25) return '감옥';
    return String(index);
  }

  function createBoard() {
    board.innerHTML = '';
    for (let index = 0; index <= GameOfGoose.FINISH; index += 1) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.index = String(index);
      cell.innerHTML = `<span class="cell-number">${index}</span><span class="cell-label">${getCellLabel(index)}</span>`;
      board.append(cell);
    }
  }

  function renderPieces() {
    document.querySelectorAll('.piece').forEach((piece) => piece.remove());
    game.players.forEach((player, index) => {
      const cell = board.querySelector(`[data-index="${player.position}"]`);
      const piece = document.createElement('span');
      piece.className = `piece player-${index}`;
      piece.textContent = index === 0 ? '나' : '컴';
      cell.append(piece);
    });
  }

  function render() {
    humanPosition.textContent = String(game.players[0].position);
    computerPosition.textContent = String(game.players[1].position);
    turnLabel.textContent = game.status === '승리' ? '완료' : game.players[game.currentPlayer].name;
    message.textContent = game.message;

    if (game.lastRoll) {
      dieOne.textContent = String(game.lastRoll.dice[0]);
      dieTwo.textContent = String(game.lastRoll.dice[1]);
    } else {
      dieOne.textContent = '-';
      dieTwo.textContent = '-';
    }

    rollButton.disabled = game.status !== '진행 중' || game.currentPlayer !== 0;
    renderPieces();
  }

  function scheduleComputerTurn() {
    if (computerTimer) {
      window.clearTimeout(computerTimer);
    }

    if (game.status === '진행 중' && game.currentPlayer === 1) {
      computerTimer = window.setTimeout(() => {
        game = GameOfGoose.playTurn(game);
        render();
        if (game.status === '진행 중' && game.currentPlayer === 1) {
          scheduleComputerTurn();
        }
      }, 700);
    }
  }

  rollButton.addEventListener('click', () => {
    game = GameOfGoose.playTurn(game);
    render();
    scheduleComputerTurn();
  });

  resetButton.addEventListener('click', () => {
    if (computerTimer) {
      window.clearTimeout(computerTimer);
    }
    game = GameOfGoose.createGame();
    render();
  });

  createBoard();
  render();
}());
