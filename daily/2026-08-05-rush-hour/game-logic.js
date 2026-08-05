(function defineRushHour(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.RushHour = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const SIZE = 6;
  const RED_ID = 'red';
  const DIRECTIONS = ['가로', '세로'];
  const DEFAULT_VEHICLES = [
    { id: 'red', row: 2, column: 0, length: 2, direction: '가로' },
    { id: 'blue', row: 0, column: 2, length: 3, direction: '세로' },
    { id: 'yellow', row: 0, column: 0, length: 2, direction: '가로' },
    { id: 'green', row: 0, column: 3, length: 2, direction: '세로' },
    { id: 'purple', row: 3, column: 0, length: 2, direction: '가로' },
    { id: 'orange', row: 3, column: 3, length: 3, direction: '가로' },
    { id: 'pink', row: 4, column: 0, length: 2, direction: '가로' },
    { id: 'gray', row: 5, column: 0, length: 3, direction: '가로' },
  ];

  function cloneVehicles(vehicles) {
    return vehicles.map((vehicle) => ({ ...vehicle }));
  }

  function cellsFor(vehicle) {
    return Array.from({ length: vehicle.length }, (_, offset) => ({
      row: vehicle.row + (vehicle.direction === '세로' ? offset : 0),
      column: vehicle.column + (vehicle.direction === '가로' ? offset : 0),
    }));
  }

  function validateVehicles(vehicles) {
    if (!Array.isArray(vehicles) || vehicles.length === 0) throw new Error('자동차 정보가 필요합니다.');
    const ids = new Set();
    const occupied = new Set();
    vehicles.forEach((vehicle) => {
      if (!vehicle || typeof vehicle.id !== 'string' || ids.has(vehicle.id)) throw new Error('자동차 이름이 올바르지 않습니다.');
      if (!Number.isInteger(vehicle.row) || !Number.isInteger(vehicle.column) || !Number.isInteger(vehicle.length) || vehicle.length < 2 || !DIRECTIONS.includes(vehicle.direction)) throw new Error('자동차 정보가 올바르지 않습니다.');
      ids.add(vehicle.id);
      cellsFor(vehicle).forEach((cell) => {
        if (cell.row < 0 || cell.row >= SIZE || cell.column < 0 || cell.column >= SIZE) throw new Error('자동차가 말판 밖에 있습니다.');
        const key = `${cell.row},${cell.column}`;
        if (occupied.has(key)) throw new Error('자동차가 겹칩니다.');
        occupied.add(key);
      });
    });
    const red = vehicles.find((vehicle) => vehicle.id === RED_ID);
    if (!red || red.direction !== '가로' || red.row !== 2) throw new Error('빨간 자동차는 가운데 줄에서 가로로 놓여야 합니다.');
  }

  function isSolved(vehicles) {
    const red = vehicles.find((vehicle) => vehicle.id === RED_ID);
    return red.column + red.length === SIZE;
  }

  function describe(status, turns) {
    if (status === '탈출 성공') return `빨간 자동차가 탈출구를 통과했습니다! ${turns}번 만에 성공했습니다.`;
    return `빨간 자동차를 오른쪽 탈출구로 보내세요. 현재 ${turns}번 움직였습니다.`;
  }

  function buildGame(vehicles, turns) {
    const status = isSolved(vehicles) ? '탈출 성공' : '진행 중';
    return { vehicles: cloneVehicles(vehicles), turns, status, message: describe(status, turns) };
  }

  function createGame(options = {}) {
    const vehicles = options.vehicles ? cloneVehicles(options.vehicles) : cloneVehicles(DEFAULT_VEHICLES);
    const turns = options.turns === undefined ? 0 : options.turns;
    validateVehicles(vehicles);
    if (!Number.isInteger(turns) || turns < 0) throw new Error('이동 횟수가 올바르지 않습니다.');
    return buildGame(vehicles, turns);
  }

  function occupiedCells(vehicles, exceptId) {
    const occupied = new Set();
    vehicles.forEach((vehicle) => {
      if (vehicle.id !== exceptId) cellsFor(vehicle).forEach((cell) => occupied.add(`${cell.row},${cell.column}`));
    });
    return occupied;
  }

  function legalDistances(game, id) {
    const vehicle = game.vehicles.find((item) => item.id === id);
    if (!vehicle || game.status !== '진행 중') return [];
    const occupied = occupiedCells(game.vehicles, id);
    const distances = [];
    [-1, 1].forEach((sign) => {
      for (let distance = 1; distance < SIZE; distance += 1) {
        const probe = vehicle.direction === '가로'
          ? { row: vehicle.row, column: sign > 0 ? vehicle.column + vehicle.length - 1 + distance : vehicle.column - distance }
          : { row: sign > 0 ? vehicle.row + vehicle.length - 1 + distance : vehicle.row - distance, column: vehicle.column };
        if (probe.row < 0 || probe.row >= SIZE || probe.column < 0 || probe.column >= SIZE || occupied.has(`${probe.row},${probe.column}`)) break;
        distances.push(sign * distance);
      }
    });
    return distances.sort((a, b) => a - b);
  }

  function moveVehicle(game, id, distance) {
    if (game.status !== '진행 중') throw new Error('이미 끝난 게임입니다.');
    if (!Number.isInteger(distance) || !legalDistances(game, id).includes(distance)) throw new Error('그 방향으로 움직일 수 없습니다.');
    const vehicles = cloneVehicles(game.vehicles);
    const vehicle = vehicles.find((item) => item.id === id);
    if (vehicle.direction === '가로') vehicle.column += distance;
    else vehicle.row += distance;
    return buildGame(vehicles, game.turns + 1);
  }

  return { SIZE, RED_ID, createGame, legalDistances, moveVehicle };
}));
