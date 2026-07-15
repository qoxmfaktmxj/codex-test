const pilesElement = document.getElementById('piles');
const movesElement = document.getElementById('moves');
const pileCountElement = document.getElementById('pile-count');
const statusElement = document.getElementById('status');
const messageElement = document.getElementById('message');
const moveButton = document.getElementById('move');
const resetButton = document.getElementById('reset');

let game = BulgarianSolitaire.createGame();

function render() {
  movesElement.textContent = `${game.moves}회`;
  pileCountElement.textContent = `${game.piles.length}개`;
  statusElement.textContent = game.status;
  messageElement.textContent = game.message;
  moveButton.disabled = game.status !== '진행 중';
  pilesElement.innerHTML = '';

  game.piles.forEach((pile, index) => {
    const cardPile = document.createElement('div');
    cardPile.className = 'pile';
    cardPile.setAttribute('aria-label', `${index + 1}번 더미 ${pile}장`);
    cardPile.style.setProperty('--height', `${Math.max(44, pile * 9)}px`);

    const stack = document.createElement('div');
    stack.className = 'stack';

    const count = document.createElement('strong');
    count.textContent = `${pile}`;

    const label = document.createElement('span');
    label.textContent = '장';

    cardPile.append(stack, count, label);
    pilesElement.appendChild(cardPile);
  });
}

moveButton.addEventListener('click', () => {
  game = BulgarianSolitaire.playMove(game);
  render();
});

resetButton.addEventListener('click', () => {
  game = BulgarianSolitaire.createGame();
  render();
});

render();
