(function defineBattleship(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.Battleship = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const DEFAULT_FLEET = [
    { name: '순양함', cells: [[0, 0], [0, 1], [0, 2]] },
    { name: '구축함', cells: [[2, 3], [3, 3]] },
    { name: '정찰정', cells: [[4, 0]] },
  ];

  const DEFAULT_MESSAGE = '좌표를 골라 숨은 전함을 모두 찾으세요.';

  function createShotGrid(size = 5, fill = null) {
    return Array.from({ length: size }, () => Array.from({ length: size }, () => fill));
  }

  function cloneShots(shots) {
    return shots.map((row) => row.slice());
  }

  function cloneFleet(fleet) {
    return fleet.map((ship) => ({
      name: ship.name,
      cells: ship.cells.map(([row, col]) => [row, col]),
      hits: ship.hits ? ship.hits.map(([row, col]) => [row, col]) : [],
      status: ship.status || '수색 중',
    }));
  }

  function sameCell(a, b) {
    return a[0] === b[0] && a[1] === b[1];
  }

  function hasCell(cells, target) {
    return cells.some((cell) => sameCell(cell, target));
  }

  function findShipAt(fleet, row, col) {
    return fleet.find((ship) => hasCell(ship.cells, [row, col]));
  }

  function countShipCells(fleet) {
    return fleet.reduce((total, ship) => total + ship.cells.length, 0);
  }

  function countHits(fleet) {
    return fleet.reduce((total, ship) => total + ship.hits.length, 0);
  }

  function createGame(options = {}) {
    const size = options.size || 5;
    const fleet = cloneFleet(options.fleet || DEFAULT_FLEET);
    const hits = countHits(fleet);
    const misses = Number.isInteger(options.misses) ? options.misses : 0;
    const shotsLeft = Number.isInteger(options.shotsLeft) ? options.shotsLeft : 15;

    return {
      size,
      shots: options.shots ? cloneShots(options.shots) : createShotGrid(size),
      fleet,
      shotsLeft,
      hits,
      misses,
      remainingShipCells: countShipCells(fleet) - hits,
      status: options.status || '진행 중',
      message: options.message || DEFAULT_MESSAGE,
    };
  }

  function cloneGame(game, overrides = {}) {
    return {
      size: game.size,
      shots: cloneShots(game.shots),
      fleet: cloneFleet(game.fleet),
      shotsLeft: game.shotsLeft,
      hits: game.hits,
      misses: game.misses,
      remainingShipCells: game.remainingShipCells,
      status: game.status,
      message: game.message,
      ...overrides,
    };
  }

  function validatePosition(game, row, col) {
    if (!Number.isInteger(row) || !Number.isInteger(col) || row < 0 || col < 0 || row >= game.size || col >= game.size) {
      throw new Error('격자 안의 좌표만 공격할 수 있습니다.');
    }
  }

  function updateShipHit(ship, row, col) {
    const target = [row, col];
    const hits = hasCell(ship.hits, target) ? ship.hits : [...ship.hits, target];
    const status = hits.length === ship.cells.length ? '격침' : '수색 중';

    return {
      ...ship,
      hits,
      status,
    };
  }

  function fireAt(game, row, col) {
    validatePosition(game, row, col);

    if (game.status !== '진행 중') {
      return cloneGame(game, {
        message: '이미 끝난 판입니다. 새 판을 시작하세요.',
      });
    }

    if (game.shots[row][col]) {
      return cloneGame(game, {
        message: '이미 확인한 칸입니다. 다른 좌표를 고르세요.',
      });
    }

    const ship = findShipAt(game.fleet, row, col);
    const shots = cloneShots(game.shots);

    if (!ship) {
      shots[row][col] = 'miss';
      const misses = game.misses + 1;
      const shotsLeft = game.shotsLeft - 1;
      const isLost = shotsLeft === 0;

      return cloneGame(game, {
        shots,
        misses,
        shotsLeft,
        status: isLost ? '패배' : '진행 중',
        message: isLost ? '패배. 포탄을 모두 썼습니다. 새 판에 도전하세요.' : `빗나갔습니다. 남은 포탄은 ${shotsLeft}발입니다.`,
      });
    }

    shots[row][col] = 'hit';
    const fleet = game.fleet.map((currentShip) => (
      currentShip.name === ship.name ? updateShipHit(currentShip, row, col) : currentShip
    ));
    const shotsLeft = game.shotsLeft - 1;
    const hits = countHits(fleet);
    const remainingShipCells = countShipCells(fleet) - hits;
    const updatedShip = fleet.find((currentShip) => currentShip.name === ship.name);
    const isWon = remainingShipCells === 0;
    const isLost = shotsLeft === 0 && !isWon;
    const isSunk = updatedShip.status === '격침';

    let message = `명중! ${ship.name} 일부를 맞혔습니다. 남은 포탄은 ${shotsLeft}발입니다.`;
    if (isSunk) {
      message = `${ship.name} 격침! 남은 전함 칸은 ${remainingShipCells}칸입니다.`;
    }
    if (isLost) {
      message = '패배. 포탄을 모두 썼습니다. 새 판에 도전하세요.';
    }
    if (isWon) {
      message = '승리! 숨은 전함을 모두 격침했습니다.';
    }

    return cloneGame(game, {
      shots,
      fleet,
      shotsLeft,
      hits,
      remainingShipCells,
      status: isWon ? '승리' : isLost ? '패배' : '진행 중',
      message,
    });
  }

  return {
    createGame,
    createShotGrid,
    fireAt,
  };
}));
