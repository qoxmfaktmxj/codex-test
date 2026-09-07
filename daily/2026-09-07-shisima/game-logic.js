(function defineShisima(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Shisima = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const SIZE = 3;
  const PLAYERS = ['white', 'black'];
  const neighbors = [
    [1, 3, 4], [0, 2, 4], [1, 4, 5],
    [0, 4, 6], [0, 1, 2, 3, 5, 6, 7, 8], [2, 4, 8],
    [3, 4, 7], [4, 6, 8], [4, 5, 7],
  ];
  const winningLines = [[0, 4, 8], [1, 4, 7], [2, 4, 6], [3, 4, 5]];
  const other = (player) => player === 'white' ? 'black' : 'white';
  const positionKey = (board, turn) => `${board.map((piece) => piece || '-').join('')}:${turn}`;

  function createState(input = {}) {
    const board = input.board === undefined
      ? ['black', 'black', 'black', null, null, null, 'white', 'white', 'white']
      : input.board;
    const turn = input.turn === undefined ? 'white' : input.turn;
    const history = input.history === undefined ? [positionKey(board, turn)] : input.history;
    if (!Array.isArray(board) || board.length !== 9 || board.some((piece) => piece !== null && !PLAYERS.includes(piece))) throw new Error('말판 정보가 올바르지 않습니다.');
    if (!PLAYERS.includes(turn)) throw new Error('차례 정보가 올바르지 않습니다.');
    if (!Array.isArray(history) || history.some((key) => typeof key !== 'string')) throw new Error('기록 정보가 올바르지 않습니다.');
    return { board: [...board], turn, history: [...history] };
  }

  function getDestinations(state, from) {
    const current = createState(state);
    if (!Number.isInteger(from) || from < 0 || from >= 9 || current.board[from] !== current.turn) return [];
    return neighbors[from]
      .filter((index) => current.board[index] === null)
      .sort((first, second) => first - second);
  }

  function lineWinner(board) {
    const line = winningLines.find(([first, second, third]) => board[first] && board[first] === board[second] && board[second] === board[third]);
    return line ? board[line[0]] : null;
  }

  function getStatus(state) {
    const current = createState(state);
    if (lineWinner(current.board)) return 'won';
    const currentKey = positionKey(current.board, current.turn);
    if (current.history.filter((key) => key === currentKey).length >= 3) return 'drawn';
    return current.board.some((piece, index) => piece === current.turn && getDestinations(current, index).length) ? 'playing' : 'stuck';
  }

  function getWinner(state) {
    const current = createState(state);
    const line = lineWinner(current.board);
    if (line) return line;
    return getStatus(current) === 'stuck' ? other(current.turn) : null;
  }

  function move(state, from, to) {
    const current = createState(state);
    if (getStatus(current) !== 'playing') throw new Error('이미 끝난 게임입니다.');
    if (!Number.isInteger(from) || !Number.isInteger(to) || from < 0 || from >= 9 || to < 0 || to >= 9) throw new Error('말판 안의 점을 고르세요.');
    if (current.board[from] !== current.turn) throw new Error('내 말을 고르세요.');
    if (current.board[to] !== null) throw new Error('빈 점으로만 움직일 수 있습니다.');
    if (!getDestinations(current, from).includes(to)) throw new Error('선으로 이어진 이웃한 점으로만 움직일 수 있습니다.');
    current.board[to] = current.turn;
    current.board[from] = null;
    current.turn = other(current.turn);
    current.history.push(positionKey(current.board, current.turn));
    return current;
  }

  return { SIZE, createState, getDestinations, getStatus, getWinner, move };
}));
