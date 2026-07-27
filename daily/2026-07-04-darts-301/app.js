const scoreElement = document.querySelector('#score');
const roundElement = document.querySelector('#round');
const dartsLeftElement = document.querySelector('#darts-left');
const statusElement = document.querySelector('#status');
const boardElement = document.querySelector('#board');
const messageElement = document.querySelector('#message');
const turnThrowsElement = document.querySelector('#turn-throws');
const historyElement = document.querySelector('#history');
const resetButton = document.querySelector('#reset-button');
const modeButtons = Array.from(document.querySelectorAll('.mode-button'));
const specialButtons = Array.from(document.querySelectorAll('.special-button'));

const segments = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];
let selectedRing = 'single';
let game = Darts301.createGame();

function setMode(ring) {
  selectedRing = ring;
  modeButtons.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.ring === ring);
  });
}

function throwSelected(value) {
  game = Darts301.throwDart(game, { ring: selectedRing, value });
  render();
}

function throwSpecial(ring) {
  game = Darts301.throwDart(game, { ring });
  render();
}

function renderBoard() {
  boardElement.innerHTML = '';
  segments.forEach((value) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'segment-button';
    button.textContent = String(value);
    const rotation = segments.indexOf(value) * 18;
    button.style.setProperty('--rotation', `${rotation}deg`);
    button.style.setProperty('--counter-rotation', `${rotation * -1}deg`);
    button.disabled = game.status !== '진행 중';
    button.setAttribute('aria-label', `${value}점 ${selectedRing === 'single' ? '싱글' : selectedRing === 'double' ? '더블' : '트리플'} 구역`);
    button.addEventListener('click', () => throwSelected(value));
    boardElement.appendChild(button);
  });

  const center = document.createElement('button');
  center.type = 'button';
  center.className = 'bull-button';
  center.textContent = '불';
  center.disabled = game.status !== '진행 중';
  center.setAttribute('aria-label', '더블 불 50점');
  center.addEventListener('click', () => throwSpecial('doubleBull'));
  boardElement.appendChild(center);
}

function renderTurnThrows() {
  if (game.turnThrows.length === 0) {
    turnThrowsElement.textContent = '아직 던지지 않았습니다';
    return;
  }

  turnThrowsElement.textContent = game.turnThrows
    .map((dart) => `${dart.label}(${dart.points})`)
    .join(' · ');
}

function renderHistory() {
  historyElement.innerHTML = '';
  game.history.slice(-4).reverse().forEach((entry) => {
    const item = document.createElement('li');
    const total = entry.throws.reduce((sum, dart) => sum + dart.points, 0);
    item.textContent = `${entry.round}라운드: ${entry.bust ? '버스트' : `${total}점`} · 남은 점수 ${entry.score}`;
    historyElement.appendChild(item);
  });
}

function render() {
  scoreElement.textContent = String(game.score);
  roundElement.textContent = String(game.round);
  dartsLeftElement.textContent = String(game.dartsLeft);
  statusElement.textContent = game.status;
  messageElement.textContent = game.message;
  specialButtons.forEach((button) => {
    button.disabled = game.status !== '진행 중';
  });
  renderTurnThrows();
  renderHistory();
  renderBoard();
}

modeButtons.forEach((button) => {
  button.addEventListener('click', () => setMode(button.dataset.ring));
});

specialButtons.forEach((button) => {
  button.addEventListener('click', () => throwSpecial(button.dataset.ring));
});

resetButton.addEventListener('click', () => {
  game = Darts301.createGame();
  setMode('single');
  render();
});

render();
