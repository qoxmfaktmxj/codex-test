(function defineUmulGonu(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.UmulGonu = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const WIDTH = 3;
  const PLAYERS = ['white', 'black'];
  const other = (player) => player === 'white' ? 'black' : 'white';
  const inBoard = (index) => Number.isInteger(index) && index >= 0 && index < WIDTH * WIDTH;
  const CONNECTIONS = [
    [1, 3, 4], [0, 2, 4], [1, 4, 5],
    [0, 4, 6], [0, 1, 2, 3, 5, 6, 7, 8], [2, 4, 8],
    [3, 4, 7], [4, 6, 8], [4, 5, 7]
  ];

  function createState(input = {}) {
    const board = input.board === undefined
      ? ['black', 'black', 'black', null, null, null, 'white', 'white', 'white']
      : input.board;
    const turn = input.turn === undefined ? 'white' : input.turn;
    if (!Array.isArray(board) || board.length !== WIDTH * WIDTH || board.some((piece) => piece !== null && !PLAYERS.includes(piece))) throw new Error('말판 정보가 올바르지 않습니다.');
    if (!PLAYERS.includes(turn)) throw new Error('차례 정보가 올바르지 않습니다.');
    return { board: [...board], turn };
  }

  function neighbors(index) {
    return inBoard(index) ? CONNECTIONS[index] : [];
  }

  function getDestinations(state, from) {
    const current = createState(state);
    if (!inBoard(from) || current.board[from] !== current.turn) return [];
    return neighbors(from).filter((to) => current.board[to] === null);
  }

  function getStatus(state) {
    const current = createState(state);
    return current.board.some((piece, index) => piece === current.turn && getDestinations(current, index).length) ? 'playing' : 'stuck';
  }

  function getWinner(state) {
    const current = createState(state);
    return getStatus(current) === 'stuck' ? other(current.turn) : null;
  }

  function move(state, from, to) {
    const current = createState(state);
    if (getStatus(current) !== 'playing') throw new Error('이미 끝난 게임입니다.');
    if (!inBoard(from) || !inBoard(to)) throw new Error('말판 안의 칸을 고르세요.');
    if (current.board[from] !== current.turn) throw new Error('내 말을 고르세요.');
    if (current.board[to] !== null) throw new Error('빈 칸으로만 움직일 수 있습니다.');
    if (!getDestinations(current, from).includes(to)) throw new Error('이웃한 칸으로만 움직일 수 있습니다.');
    current.board[to] = current.turn;
    current.board[from] = null;
    current.turn = other(current.turn);
    return current;
  }

  return { WIDTH, createState, getDestinations, getStatus, getWinner, move };
}));
