(function defineMiniHalma(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MiniHalma = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const SIZE = 6;
  const PLAYERS = ['blue', 'coral'];
  const BLUE_CAMP = [0, 1, 2, 6, 7, 12];
  const CORAL_CAMP = [23, 28, 29, 33, 34, 35];

  function createBoard() {
    const board = Array(SIZE * SIZE).fill(null);
    BLUE_CAMP.forEach((index) => { board[index] = 'blue'; });
    CORAL_CAMP.forEach((index) => { board[index] = 'coral'; });
    return board;
  }

  function createState(input = {}) {
    const board = input.board === undefined ? createBoard() : input.board;
    const turn = input.turn === undefined ? 'blue' : input.turn;
    const moves = input.moves === undefined ? 0 : input.moves;
    if (!Array.isArray(board) || board.length !== SIZE * SIZE || board.some((piece) => piece !== null && !PLAYERS.includes(piece))) throw new Error('말판 정보가 올바르지 않습니다.');
    if (board.filter((piece) => piece === 'blue').length !== 6 || board.filter((piece) => piece === 'coral').length !== 6) throw new Error('양쪽 말은 여섯 개여야 합니다.');
    if (!PLAYERS.includes(turn)) throw new Error('차례 정보가 올바르지 않습니다.');
    if (!Number.isInteger(moves) || moves < 0) throw new Error('이동 횟수가 올바르지 않습니다.');
    return { board: [...board], turn, moves };
  }

  function row(index) { return Math.floor(index / SIZE); }
  function column(index) { return index % SIZE; }
  function indexAt(r, c) { return r * SIZE + c; }
  function inBoard(r, c) { return r >= 0 && r < SIZE && c >= 0 && c < SIZE; }
  function opponent(player) { return player === 'blue' ? 'coral' : 'blue'; }
  const directions = [-1, 0, 1].flatMap((dr) => [-1, 0, 1].map((dc) => [dr, dc]).filter(([a, b]) => a || b));

  function getWinner(state) {
    const current = createState(state);
    if (CORAL_CAMP.every((spot) => current.board[spot] === 'blue')) return 'blue';
    if (BLUE_CAMP.every((spot) => current.board[spot] === 'coral')) return 'coral';
    return null;
  }

  function jumpDestinations(board, from) {
    const destinations = new Set();
    const visited = new Set([from]);
    function visit(position) {
      directions.forEach(([dr, dc]) => {
        const middleRow = row(position) + dr;
        const middleColumn = column(position) + dc;
        const landingRow = row(position) + dr * 2;
        const landingColumn = column(position) + dc * 2;
        if (!inBoard(landingRow, landingColumn) || !inBoard(middleRow, middleColumn)) return;
        const middle = indexAt(middleRow, middleColumn);
        const landing = indexAt(landingRow, landingColumn);
        const emptyLanding = landing === from || board[landing] === null;
        if (middle === from || board[middle] === null || !emptyLanding || visited.has(landing)) return;
        visited.add(landing);
        destinations.add(landing);
        visit(landing);
      });
    }
    visit(from);
    return [...destinations];
  }

  function getDestinations(state, from) {
    const current = createState(state);
    if (getWinner(current) || !Number.isInteger(from) || current.board[from] !== current.turn) return [];
    const targets = [];
    directions.forEach(([dr, dc]) => {
      const nextRow = row(from) + dr;
      const nextColumn = column(from) + dc;
      if (!inBoard(nextRow, nextColumn)) return;
      const to = indexAt(nextRow, nextColumn);
      if (current.board[to] === null) targets.push({ to, kind: 'step' });
    });
    jumpDestinations(current.board, from).forEach((to) => targets.push({ to, kind: 'jump' }));
    return targets.sort((first, second) => first.to - second.to);
  }

  function getMoves(state) {
    const current = createState(state);
    if (getWinner(current)) return [];
    return current.board.flatMap((piece, from) => piece === current.turn ? getDestinations(current, from).map((move) => ({ from, ...move })) : []);
  }

  function getStatus(state) { return getWinner(state) ? 'won' : getMoves(state).length ? 'playing' : 'stuck'; }

  function move(state, from, to) {
    const current = createState(state);
    if (getWinner(current)) throw new Error('게임이 이미 끝났습니다.');
    if (!Number.isInteger(from) || !Number.isInteger(to) || from < 0 || from >= SIZE * SIZE || to < 0 || to >= SIZE * SIZE) throw new Error('말판 안의 칸을 고르세요.');
    if (current.board[from] !== current.turn) throw new Error('내 말을 고르세요.');
    if (!getDestinations(current, from).some((target) => target.to === to)) throw new Error('갈 수 없는 곳입니다.');
    current.board[to] = current.turn;
    current.board[from] = null;
    current.moves += 1;
    if (!getWinner(current)) current.turn = opponent(current.turn);
    return current;
  }

  return { SIZE, createState, getDestinations, getMoves, getStatus, getWinner, move };
}));
