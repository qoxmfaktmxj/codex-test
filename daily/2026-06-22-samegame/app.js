const boardElement = document.getElementById('board');
const messageElement = document.getElementById('status-message');
const scoreElement = document.getElementById('score');
const removedElement = document.getElementById('removed');
const restartButton = document.getElementById('restart-button');

const colorClassNames = {
  빨강: 'red',
  파랑: 'blue',
  노랑: 'yellow',
  초록: 'green',
};

let game = SameGame.createGame();
let focusedGroup = [];

function render() {
  boardElement.innerHTML = '';
  scoreElement.textContent = String(game.score);
  removedElement.textContent = String(game.removed);
  messageElement.textContent = game.message;

  const focusedKeys = new Set(focusedGroup.map(([x, y]) => `${x},${y}`));

  game.board.forEach((row, y) => {
    row.forEach((color, x) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'cell';
      button.disabled = game.status === '완료' || !color;
      button.setAttribute('aria-label', color ? `${color} 블록 ${x + 1}열 ${y + 1}행` : `빈칸 ${x + 1}열 ${y + 1}행`);

      if (!color) {
        button.classList.add('empty');
      } else {
        button.classList.add(colorClassNames[color]);
      }

      if (focusedKeys.has(`${x},${y}`)) {
        button.classList.add('focused');
      }

      button.addEventListener('mouseenter', () => {
        focusedGroup = SameGame.findGroup(game, x, y);
        render();
      });
      button.addEventListener('focus', () => {
        focusedGroup = SameGame.findGroup(game, x, y);
        render();
      });
      button.addEventListener('click', () => {
        game = SameGame.removeGroup(game, x, y);
        focusedGroup = [];
        render();
      });

      boardElement.append(button);
    });
  });
}

boardElement.addEventListener('mouseleave', () => {
  focusedGroup = [];
  render();
});

restartButton.addEventListener('click', () => {
  game = SameGame.createGame();
  focusedGroup = [];
  render();
});

render();
