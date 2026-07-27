(function defineFifteenPuzzle(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.FifteenPuzzle = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const SIZE = 4;
  const TILE_COUNT = SIZE * SIZE;
  const SOLVED_TILES = Object.freeze([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0]);
  const DEFAULT_TILES = Object.freeze([1, 2, 4, 8, 6, 7, 3, 12, 5, 14, 10, 0, 9, 13, 11, 15]);
  const DEFAULT_MESSAGE = '빈칸 옆의 숫자를 눌러 순서대로 맞추세요.';

  function cloneTiles(tiles) {
    return tiles.slice();
  }

  function cloneGame(game, overrides = {}) {
    return {
      tiles: cloneTiles(game.tiles),
      moves: game.moves,
      status: game.status,
      message: game.message,
      ...overrides,
    };
  }

  function validateTiles(tiles) {
    if (!Array.isArray(tiles) || tiles.length !== TILE_COUNT) {
      throw new Error('타일 배열이 올바르지 않습니다.');
    }

    const seen = new Set(tiles);
    if (seen.size !== TILE_COUNT) {
      throw new Error('타일 배열이 올바르지 않습니다.');
    }

    for (let value = 0; value < TILE_COUNT; value += 1) {
      if (!seen.has(value)) {
        throw new Error('타일 배열이 올바르지 않습니다.');
      }
    }
  }

  function getPosition(index) {
    return {
      row: Math.floor(index / SIZE),
      column: index % SIZE,
    };
  }

  function areAdjacent(firstIndex, secondIndex) {
    const first = getPosition(firstIndex);
    const second = getPosition(secondIndex);
    return Math.abs(first.row - second.row) + Math.abs(first.column - second.column) === 1;
  }

  function countInversions(tiles) {
    const numbers = tiles.filter((tile) => tile !== 0);
    let inversions = 0;

    for (let left = 0; left < numbers.length - 1; left += 1) {
      for (let right = left + 1; right < numbers.length; right += 1) {
        if (numbers[left] > numbers[right]) {
          inversions += 1;
        }
      }
    }

    return inversions;
  }

  function isSolvable(tiles) {
    validateTiles(tiles);
    const blankIndex = tiles.indexOf(0);
    const blankRowFromBottom = SIZE - getPosition(blankIndex).row;
    const inversions = countInversions(tiles);

    if (SIZE % 2 === 1) {
      return inversions % 2 === 0;
    }

    return blankRowFromBottom % 2 === 0
      ? inversions % 2 === 1
      : inversions % 2 === 0;
  }

  function isSolved(tiles) {
    return tiles.every((tile, index) => tile === SOLVED_TILES[index]);
  }

  function createGame(tiles = DEFAULT_TILES) {
    validateTiles(tiles);
    if (!isSolvable(tiles)) {
      throw new Error('풀 수 없는 배치입니다.');
    }

    const solved = isSolved(tiles);
    return {
      tiles: cloneTiles(tiles),
      moves: 0,
      status: solved ? '승리' : '진행 중',
      message: solved ? '이미 완성된 퍼즐입니다.' : DEFAULT_MESSAGE,
    };
  }

  function canMove(game, tileNumber) {
    if (!Number.isInteger(tileNumber) || tileNumber < 1 || tileNumber >= TILE_COUNT) {
      return false;
    }

    if (game.status !== '진행 중') {
      return false;
    }

    const tileIndex = game.tiles.indexOf(tileNumber);
    const blankIndex = game.tiles.indexOf(0);
    return tileIndex !== -1 && areAdjacent(tileIndex, blankIndex);
  }

  function moveTile(game, tileNumber) {
    if (!canMove(game, tileNumber)) {
      return cloneGame(game, {
        message: '그 숫자는 빈칸과 맞닿아 있지 않습니다.',
      });
    }

    const tiles = cloneTiles(game.tiles);
    const tileIndex = tiles.indexOf(tileNumber);
    const blankIndex = tiles.indexOf(0);
    tiles[blankIndex] = tileNumber;
    tiles[tileIndex] = 0;

    const moves = game.moves + 1;
    const solved = isSolved(tiles);
    return cloneGame(game, {
      tiles,
      moves,
      status: solved ? '승리' : '진행 중',
      message: solved
        ? `성공입니다. ${moves}번 만에 퍼즐을 완성했습니다.`
        : `${tileNumber}번 타일을 옮겼습니다.`,
    });
  }

  function getMovableTiles(tiles) {
    validateTiles(tiles);
    const blankIndex = tiles.indexOf(0);
    return tiles.filter((tile, index) => tile !== 0 && areAdjacent(index, blankIndex));
  }

  function shuffleTiles(steps = 80, random = Math.random) {
    let tiles = cloneTiles(SOLVED_TILES);
    let previousBlankIndex = -1;

    for (let step = 0; step < steps; step += 1) {
      const blankIndex = tiles.indexOf(0);
      const candidates = getMovableTiles(tiles).filter((tile) => {
        const tileIndex = tiles.indexOf(tile);
        return tileIndex !== previousBlankIndex;
      });
      const movableTiles = candidates.length > 0 ? candidates : getMovableTiles(tiles);
      const tileNumber = movableTiles[Math.floor(random() * movableTiles.length)];
      const tileIndex = tiles.indexOf(tileNumber);
      previousBlankIndex = blankIndex;
      tiles[blankIndex] = tileNumber;
      tiles[tileIndex] = 0;
    }

    return tiles;
  }

  return {
    SIZE,
    TILE_COUNT,
    SOLVED_TILES,
    DEFAULT_TILES,
    createGame,
    canMove,
    moveTile,
    isSolvable,
    isSolved,
    getMovableTiles,
    shuffleTiles,
  };
}));
