(function defineMingMang(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MingMang = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const SIZE = 3;
  const PLAYERS = ['red', 'blue'];
  const other = (player) => player === 'red' ? 'blue' : 'red';
  const inBoard = (index) => Number.isInteger(index) && index >= 0 && index < SIZE * SIZE;

  function createState(input = {}) {
    const board = input.board === undefined ? ['red', 'red', 'red', null, null, null, 'blue', 'blue', 'blue'] : input.board;
    const turn = input.turn === undefined ? 'red' : input.turn;
    const captures = input.captures === undefined ? { red: 0, blue: 0 } : input.captures;
    if (!Array.isArray(board) || board.length !== SIZE * SIZE || board.some((piece) => piece !== null && !PLAYERS.includes(piece))) throw new Error('말판 정보가 올바르지 않습니다.');
    if (!PLAYERS.includes(turn)) throw new Error('차례 정보가 올바르지 않습니다.');
    if (PLAYERS.some((player) => !Number.isInteger(captures[player]) || captures[player] < 0)) throw new Error('잡기 정보가 올바르지 않습니다.');
    return { board: [...board], turn, captures: { ...captures } };
  }

  function neighbors(index) {
    if (!inBoard(index)) return [];
    const row = Math.floor(index / SIZE);
    const col = index % SIZE;
    return [[-1, 0], [0, -1], [0, 1], [1, 0]]
      .map(([dr, dc]) => [row + dr, col + dc])
      .filter(([nextRow, nextCol]) => nextRow >= 0 && nextRow < SIZE && nextCol >= 0 && nextCol < SIZE)
      .map(([nextRow, nextCol]) => nextRow * SIZE + nextCol)
      .sort((a, b) => a - b);
  }

  function getLegalMoves(state) {
    const current = createState(state);
    if (getStatus(current) === 'finished') return [];
    return current.board.flatMap((piece, from) => piece === current.turn
      ? neighbors(from).filter((to) => current.board[to] === null).map((to) => ({ from, to }))
      : []);
  }

  function getWinner(state) {
    const current = createState(state);
    const opponent = other(current.turn);
    if (!current.board.includes(opponent)) return current.turn;
    if (!current.board.includes(current.turn)) return opponent;
    return getLegalMovesRaw(current).length ? null : opponent;
  }

  function getLegalMovesRaw(current) {
    return current.board.flatMap((piece, from) => piece === current.turn
      ? neighbors(from).filter((to) => current.board[to] === null).map((to) => ({ from, to }))
      : []);
  }

  function getStatus(state) { return getWinner(state) ? 'finished' : 'playing'; }

  function capturesFrom(board, target, player) {
    const row = Math.floor(target / SIZE);
    const col = target % SIZE;
    const rival = other(player);
    const taken = [];
    for (const [dr, dc] of [[-1, 0], [0, -1], [0, 1], [1, 0]]) {
      const middleRow = row + dr;
      const middleCol = col + dc;
      const endRow = row + dr * 2;
      const endCol = col + dc * 2;
      if (middleRow < 0 || middleRow >= SIZE || middleCol < 0 || middleCol >= SIZE || endRow < 0 || endRow >= SIZE || endCol < 0 || endCol >= SIZE) continue;
      const middle = middleRow * SIZE + middleCol;
      const end = endRow * SIZE + endCol;
      if (board[middle] === rival && board[end] === player) taken.push(middle);
    }
    return taken;
  }

  function play(state, action) {
    const current = createState(state);
    if (getStatus(current) === 'finished') throw new Error('이미 끝난 게임입니다.');
    const legal = getLegalMovesRaw(current).find((move) => move.from === action.from && move.to === action.to);
    if (!legal) throw new Error('인접한 빈칸으로만 움직일 수 있습니다.');
    current.board[legal.from] = null;
    current.board[legal.to] = current.turn;
    const taken = capturesFrom(current.board, legal.to, current.turn);
    taken.forEach((index) => { current.board[index] = current.turn; });
    current.captures[current.turn] += taken.length;
    current.turn = other(current.turn);
    return createState(current);
  }

  return { SIZE, createState, neighbors, getLegalMoves, getStatus, getWinner, play };
}));
