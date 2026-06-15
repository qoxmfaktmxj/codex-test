const {
  BOARD_SIZE: DOT_BOARD_SIZE,
  BOX_SIZE: DOT_BOX_SIZE,
  claimEdge: drawEdge,
  createGame: makeGame,
  getBoxState: readBoxState,
  getEdgeState: readEdgeState,
} = window.DotsAndBoxesLogic;

const boardEl = document.getElementById('board');
const turnEl = document.getElementById('turn');
const blueScoreEl = document.getElementById('blue-score');
const redScoreEl = document.getElementById('red-score');
const movesEl = document.getElementById('moves');
const messageEl = document.getElementById('message');
const resetButton = document.getElementById('reset-button');

let game = makeGame();

function ownerClass(owner) {
  if (owner === '파랑') {
    return 'blue';
  }
  if (owner === '빨강') {
    return 'red';
  }
  return '';
}

function place(element, row, col) {
  element.style.gridRow = String(row);
  element.style.gridColumn = String(col);
}

function makeDot(row, col) {
  const dot = document.createElement('span');
  dot.className = 'dot';
  dot.setAttribute('aria-hidden', 'true');
  place(dot, row * 2 + 1, col * 2 + 1);
  return dot;
}

function makeBox(row, col) {
  const box = document.createElement('div');
  const state = readBoxState(game, row, col);
  box.className = ['box', ownerClass(state.owner)].filter(Boolean).join(' ');
  box.textContent = state.owner ? state.owner : '';
  place(box, row * 2 + 2, col * 2 + 2);
  return box;
}

function makeEdge(orientation, row, col) {
  const edge = document.createElement('button');
  const state = readEdgeState(game, orientation, row, col);
  edge.type = 'button';
  edge.className = [
    'edge',
    orientation === '가로' ? 'horizontal' : 'vertical',
    ownerClass(state.owner),
  ].filter(Boolean).join(' ');
  edge.disabled = !state.available || game.status !== '진행 중';
  edge.setAttribute('aria-label', `${row + 1}번째 ${col + 1}번째 ${orientation} 선`);
  edge.addEventListener('click', () => {
    game = drawEdge(game, orientation, row, col);
    render();
  });

  if (orientation === '가로') {
    place(edge, row * 2 + 1, col * 2 + 2);
  } else {
    place(edge, row * 2 + 2, col * 2 + 1);
  }
  return edge;
}

function renderBoard() {
  boardEl.innerHTML = '';

  for (let row = 0; row < DOT_BOX_SIZE; row += 1) {
    for (let col = 0; col < DOT_BOX_SIZE; col += 1) {
      boardEl.appendChild(makeBox(row, col));
    }
  }

  for (let row = 0; row < DOT_BOARD_SIZE; row += 1) {
    for (let col = 0; col < DOT_BOX_SIZE; col += 1) {
      boardEl.appendChild(makeEdge('가로', row, col));
    }
  }

  for (let row = 0; row < DOT_BOX_SIZE; row += 1) {
    for (let col = 0; col < DOT_BOARD_SIZE; col += 1) {
      boardEl.appendChild(makeEdge('세로', row, col));
    }
  }

  for (let row = 0; row < DOT_BOARD_SIZE; row += 1) {
    for (let col = 0; col < DOT_BOARD_SIZE; col += 1) {
      boardEl.appendChild(makeDot(row, col));
    }
  }
}

function render() {
  turnEl.textContent = game.status === '완료' ? '끝' : game.currentPlayer;
  turnEl.className = ownerClass(game.currentPlayer);
  blueScoreEl.textContent = String(game.scores['파랑']);
  redScoreEl.textContent = String(game.scores['빨강']);
  movesEl.textContent = String(game.moves);
  messageEl.textContent = game.message;
  renderBoard();
}

resetButton.addEventListener('click', () => {
  game = makeGame();
  render();
});

render();
