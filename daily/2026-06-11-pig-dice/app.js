(() => {
  const {
    PLAYER_NAMES,
    createGame,
    rollDie,
    holdTurn,
    shouldComputerHold,
    resetGame,
  } = window.PigDiceLogic;

  const playerScoreEl = document.getElementById('player-score');
  const computerScoreEl = document.getElementById('computer-score');
  const turnLabelEl = document.getElementById('turn-label');
  const turnTotalEl = document.getElementById('turn-total');
  const messageEl = document.getElementById('message');
  const dieEl = document.getElementById('die');
  const rollButton = document.getElementById('roll');
  const holdButton = document.getElementById('hold');
  const resetButton = document.getElementById('reset');

  let game = createGame();
  let computerTimer = null;

  function isPlayerTurn() {
    return game.turn === 'player' && game.status === '진행 중';
  }

  function render() {
    playerScoreEl.textContent = game.scores.player;
    computerScoreEl.textContent = game.scores.computer;
    turnLabelEl.textContent = game.status === '종료' ? '게임 종료' : `${PLAYER_NAMES[game.turn]} 차례`;
    turnTotalEl.textContent = `이번 차례 ${game.turnTotal}점`;
    messageEl.textContent = game.message;
    dieEl.textContent = game.lastRoll || '?';
    dieEl.classList.toggle('danger', game.lastRoll === 1);
    rollButton.disabled = !isPlayerTurn();
    holdButton.disabled = !isPlayerTurn() || game.turnTotal === 0;
  }

  function scheduleComputer() {
    if (computerTimer || game.status !== '진행 중' || game.turn !== 'computer') {
      return;
    }

    computerTimer = window.setTimeout(() => {
      computerTimer = null;
      if (shouldComputerHold(game)) {
        game = holdTurn(game);
      } else {
        game = rollDie(game);
      }
      render();
      scheduleComputer();
    }, 650);
  }

  function update(nextGame) {
    game = nextGame;
    render();
    scheduleComputer();
  }

  rollButton.addEventListener('click', () => {
    update(rollDie(game));
  });

  holdButton.addEventListener('click', () => {
    update(holdTurn(game));
  });

  resetButton.addEventListener('click', () => {
    if (computerTimer) {
      window.clearTimeout(computerTimer);
      computerTimer = null;
    }
    update(resetGame());
  });

  render();
})();
