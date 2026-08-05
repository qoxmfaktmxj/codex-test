const boardNode = document.querySelector('[data-board]');
const turnsNode = document.querySelector('[data-turns]');
const messageNode = document.querySelector('[data-message]');
const hintNode = document.querySelector('[data-hint]');
const selectionNode = document.querySelector('[data-selection]');
const moveButtons = [...document.querySelectorAll('[data-move]')];
const labels = { red: '빨간 자동차', blue: '파란 자동차', yellow: '노란 자동차', green: '초록 자동차', purple: '보라 자동차', orange: '주황 자동차', pink: '분홍 자동차', gray: '회색 자동차' };
let game = RushHour.createGame();
let selectedId = null;

function selectedVehicle() {
  return game.vehicles.find((vehicle) => vehicle.id === selectedId);
}

function render() {
  boardNode.innerHTML = '';
  game.vehicles.forEach((vehicle) => {
    const car = document.createElement('button');
    car.type = 'button';
    car.className = `car ${vehicle.id}${selectedId === vehicle.id ? ' selected' : ''}`;
    car.style.gridColumn = `${vehicle.column + 1} / span ${vehicle.direction === '가로' ? vehicle.length : 1}`;
    car.style.gridRow = `${vehicle.row + 1} / span ${vehicle.direction === '세로' ? vehicle.length : 1}`;
    car.setAttribute('aria-label', labels[vehicle.id] || '자동차');
    car.setAttribute('aria-pressed', String(selectedId === vehicle.id));
    car.disabled = game.status !== '진행 중';
    car.addEventListener('click', () => { selectedId = vehicle.id; render(); });
    boardNode.appendChild(car);
  });
  const distances = selectedId ? RushHour.legalDistances(game, selectedId) : [];
  turnsNode.textContent = game.turns;
  messageNode.textContent = game.message;
  hintNode.textContent = game.status === '탈출 성공' ? '새 퍼즐을 누르면 처음부터 다시 시작합니다.' : '자동차를 누른 뒤 앞·뒤 버튼으로 빈칸만큼 움직이세요.';
  selectionNode.textContent = selectedVehicle() ? `${labels[selectedId]} 선택됨` : '자동차를 선택하세요.';
  moveButtons.forEach((button) => { button.disabled = !distances.some((distance) => Math.sign(distance) === Number(button.dataset.move)); });
}

moveButtons.forEach((button) => button.addEventListener('click', () => {
  const direction = Number(button.dataset.move);
  const distance = RushHour.legalDistances(game, selectedId).find((item) => item === direction);
  if (distance) game = RushHour.moveVehicle(game, selectedId, distance);
  render();
}));

document.querySelector('[data-reset]').addEventListener('click', () => { game = RushHour.createGame(); selectedId = null; render(); });
render();
