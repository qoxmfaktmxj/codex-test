(function defineLatrunculi(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Latrunculi = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const WIDTH = 5;
  const PLAYERS = ['white', 'black'];
  const other = (player) => player === 'white' ? 'black' : 'white';
  const inBoard = (index) => Number.isInteger(index) && index >= 0 && index < WIDTH * WIDTH;
  const row = (index) => Math.floor(index / WIDTH);
  const column = (index) => index % WIDTH;

  function createState(input = {}) {
    const board = input.board === undefined
      ? ['black', 'black', 'black', 'black', 'black', ...Array(15).fill(null), 'white', 'white', 'white', 'white', 'white']
      : input.board;
    const turn = input.turn === undefined ? 'white' : input.turn;
    if (!Array.isArray(board) || board.length !== WIDTH * WIDTH || board.some((piece) => piece !== null && !PLAYERS.includes(piece))) throw new Error('말판 정보가 올바르지 않습니다.');
    if (!PLAYERS.includes(turn)) throw new Error('차례 정보가 올바르지 않습니다.');
    return { board: [...board], turn };
  }

  function neighbors(index) {
    if (!inBoard(index)) return [];
    return [index - WIDTH, index - 1, index + 1, index + WIDTH]
      .filter((next) => inBoard(next) && (column(next) === column(index) || row(next) === row(index)));
  }

  function getDestinations(state, from) {
    const current = createState(state);
    if (!inBoard(from) || current.board[from] !== current.turn) return [];
    return neighbors(from).filter((to) => current.board[to] === null).sort((first, second) => first - second);
  }

  function count(board, player) { return board.filter((piece) => piece === player).length; }

  function getStatus(state) {
    const current = createState(state);
    if (count(current.board, 'white') === 0 || count(current.board, 'black') === 0) return 'won';
    return current.board.some((piece, index) => piece === current.turn && getDestinations(current, index).length) ? 'playing' : 'stuck';
  }

  function getWinner(state) {
    const current = createState(state);
    if (count(current.board, 'white') === 0) return 'black';
    if (count(current.board, 'black') === 0) return 'white';
    return getStatus(current) === 'stuck' ? other(current.turn) : null;
  }

  function capturesAfterMove(board, player, to) {
    const enemy = other(player);
    return neighbors(to).filter((middle) => {
      if (board[middle] !== enemy) return false;
      const beyond = middle + (middle - to);
      return inBoard(beyond)
        && (row(beyond) === row(middle) || column(beyond) === column(middle))
        && board[beyond] === player;
    });
  }

  function move(state, from, to) {
    const current = createState(state);
    if (getStatus(current) !== 'playing') throw new Error('이미 끝난 게임입니다.');
    if (!inBoard(from) || !inBoard(to)) throw new Error('말판 안의 칸을 고르세요.');
    if (current.board[from] !== current.turn) throw new Error('내 말을 고르세요.');
    if (current.board[to] !== null) throw new Error('빈 칸으로만 움직일 수 있습니다.');
    if (!getDestinations(current, from).includes(to)) throw new Error('가로 또는 세로로 이웃한 칸으로만 움직일 수 있습니다.');
    current.board[to] = current.turn;
    current.board[from] = null;
    const captured = capturesAfterMove(current.board, current.turn, to);
    captured.forEach((index) => { current.board[index] = null; });
    current.turn = other(current.turn);
    return { ...current, captured };
  }

  return { WIDTH, createState, getDestinations, getStatus, getWinner, move };
}));
