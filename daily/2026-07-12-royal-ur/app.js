(function startRoyalUrApp() {
  const boardEl = document.getElementById('board');
  const messageEl = document.getElementById('messageText');
  const turnEl = document.getElementById('turnText');
  const diceEl = document.getElementById('diceText');
  const scoreEl = document.getElementById('scoreText');
  const diceFacesEl = document.getElementById('diceFaces');
  const playerHomeEl = document.getElementById('playerHome');
  const computerHomeEl = document.getElementById('computerHome');
  const rollButton = document.getElementById('rollButton');
  const resetButton = document.getElementById('resetButton');

  let game = RoyalUr.createGame();

  function pieceName(piece) {
    return piece === RoyalUr.PLAYER ? '나' : '컴퓨터';
  }

  function getFinishedCount(piece) {
    return game.pieces[piece].filter((position) => position === RoyalUr.FINISH).length;
  }

  function getHomeCount(piece) {
    return game.pieces[piece].filter((position) => position === RoyalUr.HOME).length;
  }

  function createToken(piece, index, clickable) {
    const element = document.createElement(clickable ? 'button' : 'span');
    element.className = `token ${piece === RoyalUr.PLAYER ? 'player' : 'computer'}${clickable ? ' clickable' : ''}`;
    element.textContent = pieceName(piece).slice(0, 1);
    element.title = `${pieceName(piece)} ${index + 1}번 말`;

    if (clickable) {
      element.type = 'button';
      element.addEventListener('click', () => {
        game = RoyalUr.movePiece(game, index);
        render();
        scheduleComputer();
      });
    }

    return element;
  }

  function renderDiceFaces() {
    diceFacesEl.replaceChildren();
    const rolls = game.rolls.length ? game.rolls : [0, 0, 0, 0];
    rolls.forEach((value) => {
      const die = document.createElement('span');
      die.className = `die${value ? ' on' : ''}`;
      diceFacesEl.appendChild(die);
    });
  }

  function renderHome() {
    playerHomeEl.replaceChildren();
    computerHomeEl.replaceChildren();

    game.pieces.X.forEach((position, index) => {
      if (position === RoyalUr.HOME) {
        const clickable = game.turn === RoyalUr.PLAYER
          && RoyalUr.getLegalMoves(game).some((move) => move.piece === index);
        playerHomeEl.appendChild(createToken(RoyalUr.PLAYER, index, clickable));
      }
    });

    game.pieces.O.forEach((position, index) => {
      if (position === RoyalUr.HOME) {
        computerHomeEl.appendChild(createToken(RoyalUr.COMPUTER, index, false));
      }
    });
  }

  function renderBoard() {
    boardEl.replaceChildren();
    const legalMoves = RoyalUr.getLegalMoves(game);

    for (let position = 0; position < RoyalUr.FINISH; position += 1) {
      const cell = document.createElement('div');
      cell.className = [
        'cell',
        RoyalUr.isShared(position) ? 'shared' : '',
        RoyalUr.isRosette(position) ? 'rosette' : '',
      ].filter(Boolean).join(' ');

      const number = document.createElement('span');
      number.className = 'cell-number';
      number.textContent = `${position + 1}`;
      cell.appendChild(number);

      if (RoyalUr.isRosette(position)) {
        const mark = document.createElement('span');
        mark.className = 'rosette-mark';
        mark.textContent = '꽃';
        cell.appendChild(mark);
      }

      const tokens = document.createElement('div');
      tokens.className = 'cell-tokens';

      [RoyalUr.PLAYER, RoyalUr.COMPUTER].forEach((piece) => {
        game.pieces[piece].forEach((piecePosition, index) => {
          if (piecePosition !== position) {
            return;
          }
          const clickable = piece === RoyalUr.PLAYER
            && legalMoves.some((move) => move.piece === index);
          tokens.appendChild(createToken(piece, index, clickable));
        });
      });

      cell.appendChild(tokens);
      boardEl.appendChild(cell);
    }
  }

  function render() {
    messageEl.textContent = game.message;
    turnEl.textContent = game.turn === RoyalUr.PLAYER ? '내 차례' : '컴퓨터 차례';
    diceEl.textContent = game.dice === null ? '대기' : `${game.dice}칸`;
    scoreEl.textContent = `나 ${getFinishedCount(RoyalUr.PLAYER)} · 컴퓨터 ${getFinishedCount(RoyalUr.COMPUTER)}`;
    rollButton.disabled = game.status !== '진행 중' || game.turn !== RoyalUr.PLAYER || game.dice !== null;
    rollButton.textContent = getHomeCount(RoyalUr.PLAYER) === 5 && game.dice === null ? '첫 주사위' : '주사위 굴리기';

    renderDiceFaces();
    renderBoard();
    renderHome();
  }

  function scheduleComputer() {
    if (game.status !== '진행 중' || game.turn !== RoyalUr.COMPUTER) {
      return;
    }

    window.setTimeout(() => {
      game = RoyalUr.playComputerTurn(game);
      render();
      scheduleComputer();
    }, 650);
  }

  rollButton.addEventListener('click', () => {
    game = RoyalUr.rollTurn(game);
    render();
    scheduleComputer();
  });

  resetButton.addEventListener('click', () => {
    game = RoyalUr.createGame();
    render();
  });

  render();
}());
