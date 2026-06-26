(function defineMake24(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.Make24 = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const TARGET = 24;
  const EPSILON = 0.000001;
  const DEFAULT_PUZZLES = [
    [3, 3, 8, 8],
    [1, 5, 5, 5],
    [2, 4, 6, 8],
    [4, 4, 7, 7],
    [1, 3, 4, 6],
  ];

  function formatNumber(value) {
    if (Number.isInteger(value)) {
      return String(value);
    }

    return String(Math.round(value * 100) / 100);
  }

  function normalizeNumber(value) {
    const rounded = Math.round(value);
    return Math.abs(value - rounded) < EPSILON ? rounded : value;
  }

  function createTile(value, index) {
    return {
      id: `tile-${index + 1}`,
      value,
      expression: formatNumber(value),
    };
  }

  function cloneGame(game, overrides) {
    return {
      numbers: [...game.numbers],
      tiles: game.tiles.map((tile) => ({ ...tile })),
      moves: [...game.moves],
      history: game.history.map((entry) => cloneGame(entry, { history: [] })),
      nextId: game.nextId,
      status: game.status,
      message: game.message,
      puzzleIndex: game.puzzleIndex,
      ...overrides,
    };
  }

  function createGame(numbers, puzzleIndex = 0) {
    const puzzle = numbers ? [...numbers] : [...DEFAULT_PUZZLES[puzzleIndex % DEFAULT_PUZZLES.length]];

    return {
      numbers: puzzle,
      tiles: puzzle.map(createTile),
      moves: [],
      history: [],
      nextId: puzzle.length + 1,
      status: '진행 중',
      message: '숫자 두 개와 연산을 골라 24를 만드세요.',
      puzzleIndex,
    };
  }

  function findTile(game, tileId) {
    return game.tiles.find((tile) => tile.id === tileId);
  }

  function calculate(first, second, operator) {
    if (operator === '+') {
      return first.value + second.value;
    }
    if (operator === '-') {
      return first.value - second.value;
    }
    if (operator === '*') {
      return first.value * second.value;
    }
    if (operator === '/') {
      if (Math.abs(second.value) < EPSILON) {
        return null;
      }
      return first.value / second.value;
    }

    return undefined;
  }

  function combineTiles(game, firstId, secondId, operator) {
    if (game.status === '성공') {
      return cloneGame(game, { message: '이미 24를 만들었습니다. 새 문제를 시작하세요.' });
    }

    if (!firstId || !secondId || firstId === secondId) {
      return cloneGame(game, { message: '서로 다른 숫자 두 개를 골라야 합니다.' });
    }

    const first = findTile(game, firstId);
    const second = findTile(game, secondId);

    if (!first || !second) {
      return cloneGame(game, { message: '현재 남아 있는 숫자만 고를 수 있습니다.' });
    }

    const rawValue = calculate(first, second, operator);
    if (rawValue === undefined) {
      return cloneGame(game, { message: '연산을 먼저 고르세요.' });
    }
    if (rawValue === null) {
      return cloneGame(game, { message: '0으로 나눌 수 없습니다.' });
    }

    const value = normalizeNumber(rawValue);
    const expression = `(${first.expression} ${operator} ${second.expression})`;
    const newTile = {
      id: `tile-${game.nextId}`,
      value,
      expression,
    };
    const tiles = game.tiles
      .filter((tile) => tile.id !== firstId && tile.id !== secondId)
      .concat(newTile);
    const moveMessage = `${first.expression} ${operator} ${second.expression} = ${formatNumber(value)}`;
    const isSolved = tiles.length === 1 && Math.abs(tiles[0].value - TARGET) < EPSILON;

    return cloneGame(game, {
      tiles,
      moves: game.moves.concat(moveMessage),
      history: game.history.concat(cloneGame(game, { history: [] })),
      nextId: game.nextId + 1,
      status: isSolved ? '성공' : '진행 중',
      message: isSolved ? '성공입니다. 24를 만들었습니다!' : moveMessage,
    });
  }

  function undo(game) {
    if (game.history.length === 0) {
      return cloneGame(game, { message: '되돌릴 계산이 없습니다.' });
    }

    const previous = game.history[game.history.length - 1];
    return cloneGame(previous, {
      history: game.history.slice(0, -1),
      message: '마지막 계산을 되돌렸습니다.',
    });
  }

  function nextPuzzle(game) {
    return createGame(null, (game.puzzleIndex + 1) % DEFAULT_PUZZLES.length);
  }

  function isWin(game) {
    return game.status === '성공';
  }

  return {
    TARGET,
    DEFAULT_PUZZLES,
    createGame,
    combineTiles,
    undo,
    nextPuzzle,
    isWin,
    formatNumber,
  };
}));
