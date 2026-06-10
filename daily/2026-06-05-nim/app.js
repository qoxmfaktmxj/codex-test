(() => {
  const logic = window.NimLogic;
  const stonesElement = document.getElementById('stones');
  const statusElement = document.getElementById('status');
  const turnElement = document.getElementById('turn');
  const messageElement = document.getElementById('message');
  const historyElement = document.getElementById('history');
  const buttons = [...document.querySelectorAll('[data-take]')];
  const resetButton = document.getElementById('reset');

  let game = logic.createGame();

  function actorLabel(actor) {
    return actor === 'player' ? '당신' : '컴퓨터';
  }

  function renderStones() {
    stonesElement.innerHTML = '';
    for (let index = 0; index < game.stones; index += 1) {
      const stone = document.createElement('span');
      stone.className = 'stone';
      stonesElement.appendChild(stone);
    }
  }

  function renderHistory() {
    historyElement.innerHTML = '';
    game.history.slice().reverse().forEach((entry) => {
      const item = document.createElement('li');
      item.textContent = `${actorLabel(entry.actor)}: 돌 ${entry.count}개`;
      historyElement.appendChild(item);
    });
  }

  function renderControls() {
    const takes = logic.availableTakes(game);
    buttons.forEach((button) => {
      const count = Number(button.dataset.take);
      button.disabled = !takes.includes(count) || game.turn !== 'player';
    });
  }

  function render() {
    statusElement.textContent = logic.statusText(game);
    turnElement.textContent = game.status === 'playing' ? '당신 차례' : '게임 종료';
    messageElement.textContent = game.message;
    renderStones();
    renderHistory();
    renderControls();
  }

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const count = Number(button.dataset.take);
      game = logic.playPlayerTurn(game, count);
      render();
    });
  });

  resetButton.addEventListener('click', () => {
    game = logic.createGame();
    render();
  });

  render();
})();
