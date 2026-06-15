const BOARD_SIZE = 4;
const BOX_SIZE = BOARD_SIZE - 1;
const PLAYERS = ['파랑', '빨강'];

function cloneGrid(grid) {
  return grid.map((row) => row.slice());
}

function normalizeOwner(value) {
  if (PLAYERS.includes(value)) {
    return value;
  }
  return value ? PLAYERS[0] : null;
}

function makeGrid(rows, cols, source) {
  const input = Array.isArray(source) ? source : [];
  return Array.from({ length: rows }, (_, row) => {
    const line = Array.isArray(input[row]) ? input[row] : [];
    return Array.from({ length: cols }, (_, col) => normalizeOwner(line[col]));
  });
}

function countBoxes(boxes, player) {
  return boxes.flat().filter((owner) => owner === player).length;
}

function normalizeScores(scores, boxes) {
  return {
    파랑: Math.max(0, Math.floor(Number(scores && scores['파랑']) || countBoxes(boxes, '파랑'))),
    빨강: Math.max(0, Math.floor(Number(scores && scores['빨강']) || countBoxes(boxes, '빨강'))),
  };
}

function createGame(options = {}) {
  const boxes = makeGrid(BOX_SIZE, BOX_SIZE, options.boxes);
  return {
    horizontal: makeGrid(BOARD_SIZE, BOX_SIZE, options.horizontal),
    vertical: makeGrid(BOX_SIZE, BOARD_SIZE, options.vertical),
    boxes,
    scores: normalizeScores(options.scores, boxes),
    currentPlayer: PLAYERS.includes(options.currentPlayer) ? options.currentPlayer : PLAYERS[0],
    moves: Math.max(0, Math.floor(Number(options.moves) || 0)),
    status: options.status || '진행 중',
    message: options.message || '점 사이의 선을 골라 칸을 완성하세요.',
  };
}

function isHorizontal(row, col) {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOX_SIZE;
}

function isVertical(row, col) {
  return row >= 0 && row < BOX_SIZE && col >= 0 && col < BOARD_SIZE;
}

function getEdgeGrid(game, orientation) {
  if (orientation === '가로') {
    return game.horizontal;
  }
  if (orientation === '세로') {
    return game.vertical;
  }
  return null;
}

function isValidEdge(orientation, row, col) {
  return orientation === '가로' ? isHorizontal(row, col) : orientation === '세로' && isVertical(row, col);
}

function getCandidateBoxes(orientation, row, col) {
  if (orientation === '가로') {
    return [
      row > 0 ? { row: row - 1, col } : null,
      row < BOX_SIZE ? { row, col } : null,
    ].filter(Boolean);
  }

  return [
    col > 0 ? { row, col: col - 1 } : null,
    col < BOX_SIZE ? { row, col } : null,
  ].filter(Boolean);
}

function isBoxClosed(game, row, col) {
  if (row < 0 || row >= BOX_SIZE || col < 0 || col >= BOX_SIZE) {
    return false;
  }
  return Boolean(
    game.horizontal[row][col]
      && game.horizontal[row + 1][col]
      && game.vertical[row][col]
      && game.vertical[row][col + 1],
  );
}

function nextPlayer(player) {
  return player === PLAYERS[0] ? PLAYERS[1] : PLAYERS[0];
}

function getWinner(game) {
  if (game.scores['파랑'] === game.scores['빨강']) {
    return '무승부';
  }
  return game.scores['파랑'] > game.scores['빨강'] ? '파랑' : '빨강';
}

function isBoardFull(boxes) {
  return boxes.every((row) => row.every(Boolean));
}

function makeFinishMessage(game) {
  const winner = getWinner(game);
  if (winner === '무승부') {
    return '무승부입니다. 같은 수의 칸을 차지했습니다.';
  }
  return `${winner} 승리! 더 많은 칸을 차지했습니다.`;
}

function claimEdge(game, orientation, row, col) {
  if (!game || game.status !== '진행 중') {
    return game;
  }
  if (!isValidEdge(orientation, row, col)) {
    return {
      ...game,
      message: '그을 수 없는 선입니다.',
    };
  }

  const edgeGrid = getEdgeGrid(game, orientation);
  if (edgeGrid[row][col]) {
    return {
      ...game,
      message: '이미 그은 선입니다.',
    };
  }

  const nextGame = {
    ...game,
    horizontal: cloneGrid(game.horizontal),
    vertical: cloneGrid(game.vertical),
    boxes: cloneGrid(game.boxes),
    scores: { ...game.scores },
    moves: game.moves + 1,
  };

  getEdgeGrid(nextGame, orientation)[row][col] = game.currentPlayer;
  const completed = getCandidateBoxes(orientation, row, col).filter((box) => {
    return !nextGame.boxes[box.row][box.col] && isBoxClosed(nextGame, box.row, box.col);
  });

  completed.forEach((box) => {
    nextGame.boxes[box.row][box.col] = game.currentPlayer;
  });

  if (completed.length > 0) {
    nextGame.scores[game.currentPlayer] += completed.length;
    nextGame.currentPlayer = game.currentPlayer;
    nextGame.message = `${game.currentPlayer}이 ${completed.length}칸을 완성했습니다. 한 번 더 그으세요.`;
  } else {
    nextGame.currentPlayer = nextPlayer(game.currentPlayer);
    nextGame.message = `${nextGame.currentPlayer} 차례입니다.`;
  }

  if (isBoardFull(nextGame.boxes)) {
    nextGame.status = '완료';
    nextGame.message = makeFinishMessage(nextGame);
  }

  return nextGame;
}

function getEdgeState(game, orientation, row, col) {
  if (!game || !isValidEdge(orientation, row, col)) {
    return {
      owner: null,
      available: false,
    };
  }
  const owner = getEdgeGrid(game, orientation)[row][col];
  return {
    owner,
    available: !owner,
  };
}

function getBoxState(game, row, col) {
  const owner = game.boxes[row][col];
  return {
    owner,
    closed: Boolean(owner),
  };
}

function resetGame() {
  return createGame();
}

const DotsAndBoxesLogic = {
  BOARD_SIZE,
  BOX_SIZE,
  PLAYERS,
  createGame,
  claimEdge,
  getEdgeState,
  getBoxState,
  getWinner,
  isBoxClosed,
  resetGame,
};

if (typeof module !== 'undefined') {
  module.exports = DotsAndBoxesLogic;
}

if (typeof window !== 'undefined') {
  window.DotsAndBoxesLogic = DotsAndBoxesLogic;
}
