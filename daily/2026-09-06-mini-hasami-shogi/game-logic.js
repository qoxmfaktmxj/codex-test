(function defineMiniHasami(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MiniHasami = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const SIZE = 5;
  const PLAYERS = ['white', 'black'];
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  const other = (player) => player === 'white' ? 'black' : 'white';
  const rowOf = (index) => Math.floor(index / SIZE);
  const columnOf = (index) => index % SIZE;
  const inBoard = (row, column) => row >= 0 && row < SIZE && column >= 0 && column < SIZE;
  const toIndex = (row, column) => row * SIZE + column;

  function createState(input = {}) {
    const board = input.board === undefined
      ? ['black', 'black', 'black', 'black', 'black', ...Array(15).fill(null), 'white', 'white', 'white', 'white', 'white']
      : input.board;
    const turn = input.turn === undefined ? 'white' : input.turn;
    if (!Array.isArray(board) || board.length !== 25 || board.some((piece) => piece !== null && !PLAYERS.includes(piece))) throw new Error('말판 정보가 올바르지 않습니다.');
    if (!PLAYERS.includes(turn)) throw new Error('차례 정보가 올바르지 않습니다.');
    return { board: [...board], turn };
  }

  function getDestinations(state, from) {
    const current = createState(state);
    if (!Number.isInteger(from) || from < 0 || from >= 25 || current.board[from] !== current.turn) return [];
    return directions.flatMap(([dr, dc]) => {
      const destinations = [];
      let row = rowOf(from) + dr;
      let column = columnOf(from) + dc;
      while (inBoard(row, column)) {
        const index = toIndex(row, column);
        if (current.board[index] !== null) break;
        destinations.push(index);
        row += dr;
        column += dc;
      }
      return destinations;
    }).sort((first, second) => first - second);
  }

  function getCaptures(board, to, player) {
    const enemy = other(player);
    return directions.flatMap(([dr, dc]) => {
      const captured = [];
      let row = rowOf(to) + dr;
      let column = columnOf(to) + dc;
      while (inBoard(row, column) && board[toIndex(row, column)] === enemy) {
        captured.push(toIndex(row, column));
        row += dr;
        column += dc;
      }
      return captured.length && inBoard(row, column) && board[toIndex(row, column)] === player ? captured : [];
    });
  }

  function getWinner(state) {
    const current = createState(state);
    const white = current.board.includes('white');
    const black = current.board.includes('black');
    if (!black) return 'white';
    if (!white) return 'black';
    return null;
  }

  function getStatus(state) {
    const current = createState(state);
    if (getWinner(current)) return 'won';
    return current.board.some((piece, index) => piece === current.turn && getDestinations(current, index).length) ? 'playing' : 'stuck';
  }

  function move(state, from, to) {
    const current = createState(state);
    if (getWinner(current)) throw new Error('이미 끝난 게임입니다.');
    if (!Number.isInteger(from) || !Number.isInteger(to) || from < 0 || from >= 25 || to < 0 || to >= 25) throw new Error('말판 안의 칸을 고르세요.');
    if (current.board[from] !== current.turn) throw new Error('내 말을 고르세요.');
    if (current.board[to] !== null) throw new Error('빈 칸으로만 움직일 수 있습니다.');
    if (!getDestinations(current, from).includes(to)) throw new Error('가로 또는 세로로 막힌 말 없이 움직이세요.');
    current.board[to] = current.turn;
    current.board[from] = null;
    getCaptures(current.board, to, current.turn).forEach((index) => { current.board[index] = null; });
    if (!getWinner(current)) current.turn = other(current.turn);
    return current;
  }

  return { SIZE, createState, getDestinations, getCaptures, getWinner, getStatus, move };
}));
