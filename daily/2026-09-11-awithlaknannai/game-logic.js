(function defineAwithlaknannai(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Awithlaknannai = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const WIDTH = 4;
  const PLAYERS = ['sun', 'moon'];
  const other = (player) => player === 'sun' ? 'moon' : 'sun';
  const inBoard = (index) => Number.isInteger(index) && index >= 0 && index < WIDTH * WIDTH;

  function createState(input = {}) {
    const board = input.board === undefined ? Array(WIDTH * WIDTH).fill(null) : input.board;
    const turn = input.turn === undefined ? 'sun' : input.turn;
    const reserve = input.reserve === undefined ? { sun: 6, moon: 6 } : input.reserve;
    const captures = input.captures === undefined ? { sun: 0, moon: 0 } : input.captures;
    const pendingCapture = input.pendingCapture === undefined ? null : input.pendingCapture;
    if (!Array.isArray(board) || board.length !== WIDTH * WIDTH || board.some((piece) => piece !== null && !PLAYERS.includes(piece))) throw new Error('말판 정보가 올바르지 않습니다.');
    if (!PLAYERS.includes(turn)) throw new Error('차례 정보가 올바르지 않습니다.');
    for (const player of PLAYERS) {
      if (!Number.isInteger(reserve[player]) || reserve[player] < 0 || !Number.isInteger(captures[player]) || captures[player] < 0) throw new Error('말 정보가 올바르지 않습니다.');
    }
    if (pendingCapture !== null && (!PLAYERS.includes(pendingCapture.player) || pendingCapture.player !== turn || !Array.isArray(pendingCapture.targets) || !pendingCapture.targets.length || pendingCapture.targets.some((index) => !inBoard(index) || board[index] !== other(turn)))) throw new Error('잡기 정보가 올바르지 않습니다.');
    return { board: [...board], turn, reserve: { ...reserve }, captures: { ...captures }, pendingCapture: pendingCapture === null ? null : { player: pendingCapture.player, targets: [...pendingCapture.targets] }, phase: reserve.sun + reserve.moon ? 'place' : 'move' };
  }

  function neighbors(index) {
    if (!inBoard(index)) return [];
    const row = Math.floor(index / WIDTH);
    const col = index % WIDTH;
    return [[-1, 0], [0, -1], [0, 1], [1, 0]]
      .map(([dr, dc]) => [row + dr, col + dc])
      .filter(([nextRow, nextCol]) => nextRow >= 0 && nextRow < WIDTH && nextCol >= 0 && nextCol < WIDTH)
      .map(([nextRow, nextCol]) => nextRow * WIDTH + nextCol)
      .sort((a, b) => a - b);
  }

  function lines() {
    const result = [];
    for (let row = 0; row < WIDTH; row += 1) for (let col = 0; col <= WIDTH - 3; col += 1) result.push([row * WIDTH + col, row * WIDTH + col + 1, row * WIDTH + col + 2]);
    for (let col = 0; col < WIDTH; col += 1) for (let row = 0; row <= WIDTH - 3; row += 1) result.push([row * WIDTH + col, (row + 1) * WIDTH + col, (row + 2) * WIDTH + col]);
    return result;
  }

  function makesLine(board, player) { return lines().some((line) => line.every((index) => board[index] === player)); }
  function pieceCount(board, player) { return board.filter((piece) => piece === player).length; }

  function getLegalMoves(state) {
    const current = createState(state);
    if (getStatus(current) === 'finished') return [];
    if (current.pendingCapture) return current.pendingCapture.targets.map((target) => ({ type: 'capture', target }));
    if (current.phase === 'place') return current.reserve[current.turn] ? current.board.flatMap((piece, to) => piece === null ? [{ type: 'place', to }] : []) : [];
    return current.board.flatMap((piece, from) => piece === current.turn ? neighbors(from).filter((to) => current.board[to] === null).map((to) => ({ type: 'move', from, to })) : []);
  }

  function getStatus(state) {
    const current = createState(state);
    if (current.reserve.sun + current.reserve.moon === 0 && PLAYERS.some((player) => pieceCount(current.board, player) < 3)) return 'finished';
    if (current.phase === 'move' && !current.pendingCapture && getRawMoves(current).length === 0) return 'finished';
    return 'playing';
  }

  function getRawMoves(current) {
    return current.board.flatMap((piece, from) => piece === current.turn ? neighbors(from).filter((to) => current.board[to] === null) : []);
  }

  function getWinner(state) {
    const current = createState(state);
    if (current.reserve.sun + current.reserve.moon === 0) {
      if (pieceCount(current.board, 'sun') < 3) return 'moon';
      if (pieceCount(current.board, 'moon') < 3) return 'sun';
    }
    if (current.phase === 'move' && !current.pendingCapture && getRawMoves(current).length === 0) return other(current.turn);
    return null;
  }

  function play(state, action) {
    const current = createState(state);
    if (getStatus(current) === 'finished') throw new Error('이미 끝난 게임입니다.');
    const legal = getLegalMoves(current).find((move) => move.type === action.type && (move.type === 'capture' ? move.target === action.target : move.to === action.to && (move.type === 'place' || move.from === action.from)));
    if (!legal) throw new Error(action.type === 'capture' ? '잡을 상대 말을 고르세요.' : action.type === 'move' ? '인접한 빈칸으로만 움직일 수 있습니다.' : '빈칸에만 말을 놓을 수 있습니다.');
    if (legal.type === 'capture') {
      current.board[legal.target] = null;
      current.captures[current.turn] += 1;
      current.pendingCapture = null;
      current.turn = other(current.turn);
      return createState(current);
    }
    const hadLine = makesLine(current.board, current.turn);
    if (legal.type === 'place') { current.board[legal.to] = current.turn; current.reserve[current.turn] -= 1; }
    else { current.board[legal.from] = null; current.board[legal.to] = current.turn; }
    const targets = current.board.flatMap((piece, index) => piece === other(current.turn) ? [index] : []);
    if (!hadLine && makesLine(current.board, current.turn) && targets.length) { current.pendingCapture = { player: current.turn, targets }; return createState(current); }
    current.turn = other(current.turn);
    return createState(current);
  }

  return { WIDTH, createState, neighbors, getLegalMoves, getStatus, getWinner, play };
}));
