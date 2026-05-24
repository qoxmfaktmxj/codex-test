const BOARD_SIZE = 8;
const CELL_COUNT = BOARD_SIZE * BOARD_SIZE;
const MINE_COUNT = 10;

function isValidIndex(index) {
  return Number.isInteger(index) && index >= 0 && index < CELL_COUNT;
}

function cellIndex(col, row) {
  return row * BOARD_SIZE + col;
}

function rowOf(index) {
  return Math.floor(index / BOARD_SIZE);
}

function colOf(index) {
  return index % BOARD_SIZE;
}

function neighborIndexes(index) {
  if (!isValidIndex(index)) {
    return [];
  }

  const row = rowOf(index);
  const col = colOf(index);
  const neighbors = [];

  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
    for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
      if (rowOffset === 0 && colOffset === 0) {
        continue;
      }

      const nextRow = row + rowOffset;
      const nextCol = col + colOffset;
      if (nextRow >= 0 && nextRow < BOARD_SIZE && nextCol >= 0 && nextCol < BOARD_SIZE) {
        neighbors.push(nextRow * BOARD_SIZE + nextCol);
      }
    }
  }

  return neighbors;
}

function uniqueValidMines(mines) {
  const seen = new Set();
  mines.forEach((index) => {
    if (isValidIndex(index)) {
      seen.add(index);
    }
  });
  return [...seen];
}

function randomMines(count = MINE_COUNT) {
  const indexes = Array.from({ length: CELL_COUNT }, (_, index) => index);
  for (let index = indexes.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [indexes[index], indexes[swapIndex]] = [indexes[swapIndex], indexes[index]];
  }
  return indexes.slice(0, count);
}

function buildCells(mines) {
  const mineSet = new Set(mines);
  return Array.from({ length: CELL_COUNT }, (_, index) => ({
    index,
    row: rowOf(index),
    col: colOf(index),
    hasMine: mineSet.has(index),
    neighborMines: neighborIndexes(index).filter((neighbor) => mineSet.has(neighbor)).length,
    isRevealed: false,
    isFlagged: false,
  }));
}

function createGame(options = {}) {
  const mines = Array.isArray(options.mines) ? uniqueValidMines(options.mines) : randomMines(MINE_COUNT);
  return {
    cells: buildCells(mines),
    status: options.status || '진행 중',
    message: options.message || '칸을 열어 지뢰를 피하세요.',
    revealedCount: 0,
  };
}

function isPlaying(game) {
  return game.status === '진행 중';
}

function cloneCells(cells) {
  return cells.map((cell) => ({ ...cell }));
}

function countNeighborMines(game, index) {
  if (!isValidIndex(index)) {
    return 0;
  }
  return neighborIndexes(index).filter((neighbor) => game.cells[neighbor].hasMine).length;
}

function remainingSafeCells(game) {
  return game.cells.filter((cell) => !cell.hasMine && !cell.isRevealed).length;
}

function revealAllMines(cells) {
  cells.forEach((cell) => {
    if (cell.hasMine) {
      cell.isRevealed = true;
      cell.isFlagged = false;
    }
  });
}

function revealEmptyArea(cells, startIndex) {
  const queue = [startIndex];
  const visited = new Set();

  while (queue.length > 0) {
    const index = queue.shift();
    if (visited.has(index)) {
      continue;
    }
    visited.add(index);

    const cell = cells[index];
    if (!cell || cell.hasMine || cell.isFlagged) {
      continue;
    }

    cell.isRevealed = true;

    if (cell.neighborMines === 0) {
      neighborIndexes(index).forEach((neighbor) => {
        const neighborCell = cells[neighbor];
        if (!visited.has(neighbor) && !neighborCell.hasMine && !neighborCell.isFlagged) {
          queue.push(neighbor);
        }
      });
    }
  }
}

function withWinState(game) {
  if (remainingSafeCells(game) === 0) {
    return {
      ...game,
      status: '승리',
      message: '모든 안전한 칸을 열었습니다!',
      revealedCount: game.cells.filter((cell) => cell.isRevealed && !cell.hasMine).length,
    };
  }

  return {
    ...game,
    message: '좋아요. 다음 안전한 칸을 고르세요.',
    revealedCount: game.cells.filter((cell) => cell.isRevealed && !cell.hasMine).length,
  };
}

function revealCell(game, index) {
  if (!isPlaying(game) || !isValidIndex(index)) {
    return game;
  }

  const target = game.cells[index];
  if (target.isRevealed || target.isFlagged) {
    return game;
  }

  const cells = cloneCells(game.cells);
  const cell = cells[index];

  if (cell.hasMine) {
    revealAllMines(cells);
    return {
      ...game,
      cells,
      status: '게임 종료',
      message: '지뢰를 밟았습니다. 다시 도전하세요.',
      revealedCount: cells.filter((item) => item.isRevealed && !item.hasMine).length,
    };
  }

  if (cell.neighborMines > 0) {
    cell.isRevealed = true;
  } else {
    revealEmptyArea(cells, index);
  }

  return withWinState({ ...game, cells });
}

function toggleFlag(game, index) {
  if (!isPlaying(game) || !isValidIndex(index)) {
    return game;
  }

  const target = game.cells[index];
  if (target.isRevealed) {
    return game;
  }

  const cells = cloneCells(game.cells);
  cells[index].isFlagged = !cells[index].isFlagged;

  return {
    ...game,
    cells,
    message: cells[index].isFlagged ? '깃발을 표시했습니다.' : '깃발을 지웠습니다.',
  };
}

const gameLogic = {
  BOARD_SIZE,
  CELL_COUNT,
  MINE_COUNT,
  createGame,
  revealCell,
  toggleFlag,
  cellIndex,
  neighborIndexes,
  countNeighborMines,
  remainingSafeCells,
};

if (typeof module !== 'undefined') {
  module.exports = gameLogic;
}

if (typeof window !== 'undefined') {
  window.gameLogic = gameLogic;
}
