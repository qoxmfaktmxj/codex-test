const boardElement = document.querySelector('#board');
const messageElement = document.querySelector('#message');
const visitedCountElement = document.querySelector('#visited-count');
const moveCountElement = document.querySelector('#move-count');
const restartButton = document.querySelector('#restart-button');

let game = KnightsTour.createGame({ size: 5, startX: 0, startY: 0 });

function getVisitNumber(x, y) {
  return KnightsTour.getVisitNumber(game, x, y);
}

function renderBoard() {
  const legalKeys = new Set(KnightsTour.getLegalMoves(game).map((move) => `${move.x},${move.y}`));
  boardElement.innerHTML = '';

  for (let y = 0; y < game.size; y += 1) {
    for (let x = 0; x < game.size; x += 1) {
      const cell = document.createElement('button');
      const isCurrent = game.knight.x === x && game.knight.y === y;
      const isVisited = game.visited[y][x];
      const isLegal = legalKeys.has(`${x},${y}`);

      cell.type = 'button';
      cell.className = [
        'cell',
        isVisited ? 'visited' : '',
        isLegal ? 'legal' : '',
        isCurrent ? 'current' : '',
      ].filter(Boolean).join(' ');
      cell.disabled = game.status !== '진행 중' || isVisited || !isLegal;
      cell.setAttribute('aria-label', `${y + 1}행 ${x + 1}열`);

      const number = document.createElement('span');
      number.className = 'cell-number';
      number.textContent = getVisitNumber(x, y);
      cell.append(number);

      if (isCurrent) {
        const knight = document.createElement('span');
        knight.className = 'knight';
        knight.textContent = '♞';
        cell.append(knight);
      } else if (isLegal) {
        const dot = document.createElement('span');
        dot.className = 'dot';
        cell.append(dot);
      }

      cell.addEventListener('click', () => {
        game = KnightsTour.moveKnight(game, x, y);
        render();
      });

      boardElement.append(cell);
    }
  }
}

function render() {
  const visitedCount = KnightsTour.countVisited(game);
  messageElement.textContent = game.message;
  visitedCountElement.textContent = `${visitedCount} / ${game.size * game.size}`;
  moveCountElement.textContent = String(game.moves);
  renderBoard();
}

restartButton.addEventListener('click', () => {
  game = KnightsTour.createGame({ size: 5, startX: 0, startY: 0 });
  render();
});

render();
