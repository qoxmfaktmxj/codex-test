(function defineSeega(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Seega = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const SIZE = 5;
  const PLAYERS = ['sand', 'ink'];
  const CENTER = 12;
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  const other = (player) => player === 'sand' ? 'ink' : 'sand';
  const inBoard = (row, column) => row >= 0 && row < SIZE && column >= 0 && column < SIZE;
  const toIndex = (row, column) => row * SIZE + column;
  const rowOf = (index) => Math.floor(index / SIZE);
  const columnOf = (index) => index % SIZE;

  function createState(input = {}) {
    const board = input.board === undefined ? Array(25).fill(null) : input.board;
    const turn = input.turn === undefined ? 'sand' : input.turn;
    const phase = input.phase === undefined ? 'placing' : input.phase;
    const placed = input.placed === undefined ? { sand: 0, ink: 0 } : input.placed;
    const forceCenter = input.forceCenter === undefined ? false : input.forceCenter;
    if (!Array.isArray(board) || board.length !== 25 || board.some((piece) => piece !== null && !PLAYERS.includes(piece))) throw new Error('말판 정보가 올바르지 않습니다.');
    if (!PLAYERS.includes(turn) || !['placing', 'moving'].includes(phase)) throw new Error('게임 정보가 올바르지 않습니다.');
    if (!placed || !Number.isInteger(placed.sand) || !Number.isInteger(placed.ink) || placed.sand < 0 || placed.ink < 0 || placed.sand > 12 || placed.ink > 12) throw new Error('놓은 말 수가 올바르지 않습니다.');
    if (typeof forceCenter !== 'boolean') throw new Error('첫 이동 정보가 올바르지 않습니다.');
    return { board: [...board], turn, phase, placed: { ...placed }, forceCenter };
  }

  function getPlacements(state) {
    const current = createState(state);
    if (current.phase !== 'placing' || current.placed[current.turn] >= 12) return [];
    return current.board.flatMap((piece, index) => piece === null && index !== CENTER ? [index] : []);
  }

  function getDestinations(state, from) {
    const current = createState(state);
    if (current.phase !== 'moving' || current.board[from] !== current.turn) return [];
    return directions.flatMap(([dr, dc]) => {
      const row = rowOf(from) + dr;
      const column = columnOf(from) + dc;
      if (!inBoard(row, column)) return [];
      const target = toIndex(row, column);
      return current.board[target] === null ? [target] : [];
    }).filter((target) => !current.forceCenter || target === CENTER).sort((first, second) => first - second);
  }

  function getCaptures(board, to, player) {
    const enemy = other(player);
    return directions.flatMap(([dr, dc]) => {
      const adjacentRow = rowOf(to) + dr;
      const adjacentColumn = columnOf(to) + dc;
      const farRow = rowOf(to) + dr * 2;
      const farColumn = columnOf(to) + dc * 2;
      if (!inBoard(adjacentRow, adjacentColumn) || !inBoard(farRow, farColumn)) return [];
      const adjacent = toIndex(adjacentRow, adjacentColumn);
      const far = toIndex(farRow, farColumn);
      return board[adjacent] === enemy && board[far] === player && adjacent !== CENTER ? [adjacent] : [];
    });
  }

  function getWinner(state) {
    const current = createState(state);
    if (current.phase !== 'moving') return null;
    const sand = current.board.filter((piece) => piece === 'sand').length;
    const ink = current.board.filter((piece) => piece === 'ink').length;
    if (ink <= 1) return 'sand';
    if (sand <= 1) return 'ink';
    return null;
  }

  function getStatus(state) {
    const current = createState(state);
    if (getWinner(current)) return 'won';
    if (current.phase === 'placing') return 'placing';
    return current.board.some((piece, index) => piece === current.turn && getDestinations(current, index).length) ? 'playing' : 'stuck';
  }

  function hasCapturingMove(state, player) {
    const current = createState({ ...state, turn: player, forceCenter: false });
    return current.board.some((piece, from) => piece === player && getDestinations(current, from).some((to) => {
      const board = [...current.board];
      board[to] = player;
      board[from] = null;
      return getCaptures(board, to, player).length > 0;
    }));
  }

  function place(state, index) {
    const current = createState(state);
    if (!Number.isInteger(index) || index < 0 || index >= 25) throw new Error('말판 안의 칸을 고르세요.');
    if (current.phase !== 'placing') throw new Error('이제 말을 움직일 차례입니다.');
    if (!getPlacements(current).includes(index)) throw new Error('가운데를 제외한 빈 칸에만 놓을 수 있습니다.');
    current.board[index] = current.turn;
    current.placed[current.turn] += 1;
    if (current.placed.sand === 12 && current.placed.ink === 12) {
      current.phase = 'moving';
      current.turn = 'sand';
      current.forceCenter = true;
    } else if (current.placed[current.turn] % 2 === 0) current.turn = other(current.turn);
    return current;
  }

  function move(state, from, to) {
    const current = createState(state);
    if (current.phase !== 'moving') throw new Error('말을 모두 놓은 뒤 움직일 수 있습니다.');
    if (!Number.isInteger(from) || !Number.isInteger(to) || from < 0 || from >= 25 || to < 0 || to >= 25) throw new Error('말판 안의 칸을 고르세요.');
    if (current.board[from] !== current.turn) throw new Error('내 말을 고르세요.');
    if (!getDestinations(current, from).includes(to)) throw new Error('인접한 빈 칸으로만 움직일 수 있습니다.');
    current.board[to] = current.turn;
    current.board[from] = null;
    const captures = getCaptures(current.board, to, current.turn);
    captures.forEach((index) => { current.board[index] = null; });
    current.forceCenter = false;
    if (!getWinner(current) && (!captures.length || !hasCapturingMove(current, current.turn))) current.turn = other(current.turn);
    return current;
  }

  return { SIZE, CENTER, createState, getPlacements, getDestinations, getWinner, getStatus, place, move };
}));
