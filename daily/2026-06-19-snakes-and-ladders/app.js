(() => {
  const logic = window.SnakesAndLaddersLogic;
  let game = logic.createGame();

  const boardElement = document.getElementById('board');
  const turnElement = document.getElementById('turn');
  const lastRollElement = document.getElementById('last-roll');
  const statusElement = document.getElementById('status');
  const messageElement = document.getElementById('message');
  const playerPositionElement = document.getElementById('player-position');
  const computerPositionElement = document.getElementById('computer-position');
  const rollButton = document.getElementById('roll-button');
  const resetButton = document.getElementById('reset-button');

  function getVisualCells() {
    const cells = logic.getBoardCells();
    const rows = [];
    for (let index = 0; index < logic.BOARD_END; index += 6) {
      const row = cells.slice(index, index + 6);
      if ((index / 6) % 2 === 1) {
        row.reverse();
      }
      rows.unshift(row);
    }
    return rows.flat();
  }

  function renderBoard() {
    boardElement.innerHTML = '';
    const positions = game.players.reduce((map, player) => {
      if (!map[player.position]) {
        map[player.position] = [];
      }
      map[player.position].push(player.name);
      return map;
    }, {});

    getVisualCells().forEach((cell) => {
      const tile = document.createElement('div');
      tile.className = 'tile';
      if (cell.transport) {
        tile.classList.add(cell.transport === '사다리' ? 'ladder' : 'snake');
      }
      if (cell.number === logic.BOARD_END) {
        tile.classList.add('finish');
      }

      const number = document.createElement('span');
      number.className = 'tile-number';
      number.textContent = cell.number;
      tile.appendChild(number);

      if (cell.transport) {
        const transport = document.createElement('span');
        transport.className = 'transport';
        transport.textContent = `${cell.transport} ${cell.target}`;
        tile.appendChild(transport);
      }

      const markers = document.createElement('span');
      markers.className = 'markers';
      (positions[cell.number] || []).forEach((name) => {
        const marker = document.createElement('span');
        marker.className = name === '나' ? 'marker player' : 'marker computer';
        marker.textContent = name === '나' ? '나' : '컴';
        markers.appendChild(marker);
      });
      tile.appendChild(markers);

      boardElement.appendChild(tile);
    });
  }

  function renderStatus() {
    const currentPlayer = game.players[game.currentPlayer];
    turnElement.textContent = game.status === '진행 중' ? currentPlayer.name : '-';
    lastRollElement.textContent = game.lastRoll || '-';
    statusElement.textContent = game.status;
    messageElement.textContent = game.message;
    playerPositionElement.textContent = game.players[0].position;
    computerPositionElement.textContent = game.players[1].position;
    rollButton.disabled = game.status !== '진행 중';
  }

  function render() {
    renderBoard();
    renderStatus();
  }

  rollButton.addEventListener('click', () => {
    game = logic.takeTurn(game);
    render();
  });

  resetButton.addEventListener('click', () => {
    game = logic.resetGame();
    render();
  });

  render();
})();
