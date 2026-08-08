const boardNode = document.querySelector('[data-board]');
const messageNode = document.querySelector('[data-message]');
const points = [
  [50, 10], [84, 30], [84, 70], [50, 90], [16, 70], [16, 30],
];
let game = Sim.createGame();
let computerTimer = null;

function edgePosition(first, second) {
  const [x1, y1] = points[first];
  const [x2, y2] = points[second];
  const length = Math.hypot(x2 - x1, y2 - y1);
  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
  return { left: (x1 + x2) / 2, top: (y1 + y2) / 2, length, angle };
}

function render() {
  boardNode.innerHTML = '';
  for (let first = 0; first < game.points; first += 1) {
    for (let second = first + 1; second < game.points; second += 1) {
      const color = Sim.getEdgeColor(game, first, second);
      const line = document.createElement('button');
      const position = edgePosition(first, second);
      line.type = 'button';
      line.className = `line ${color === Sim.PLAYER ? 'player' : color === Sim.COMPUTER ? 'computer' : ''}`;
      line.style.left = `${position.left}%`;
      line.style.top = `${position.top}%`;
      line.style.width = `${position.length}%`;
      line.style.transform = `translate(-50%, -50%) rotate(${position.angle}deg)`;
      line.disabled = Boolean(color) || game.status !== '진행 중' || game.turn !== Sim.PLAYER;
      line.setAttribute('aria-label', color ? `${color}이(가) 색칠한 선` : `${first + 1}번 점과 ${second + 1}번 점 잇기`);
      line.addEventListener('click', () => {
        game = Sim.playMove(game, first, second);
        render(); scheduleComputer();
      });
      boardNode.appendChild(line);
    }
  }
  points.forEach(([left, top], index) => {
    const point = document.createElement('span');
    point.className = 'point'; point.style.left = `${left}%`; point.style.top = `${top}%`; point.textContent = index + 1;
    boardNode.appendChild(point);
  });
  messageNode.textContent = game.message;
}

function scheduleComputer() {
  if (computerTimer) clearTimeout(computerTimer);
  if (game.status !== '진행 중' || game.turn !== Sim.COMPUTER) return;
  computerTimer = setTimeout(() => {
    const safeMove = Sim.getAvailableMoves(game).find((move) => {
      const result = Sim.playMove(game, move.first, move.second);
      return result.status === '진행 중';
    });
    const move = safeMove || Sim.getAvailableMoves(game)[0];
    game = Sim.playMove(game, move.first, move.second);
    render();
  }, 420);
}

document.querySelector('[data-reset]').addEventListener('click', () => {
  if (computerTimer) clearTimeout(computerTimer);
  game = Sim.createGame(); render();
});
render();
