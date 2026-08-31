(function definePicaria(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Picaria = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const PLAYERS = ['blue', 'orange'];
  const LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  const EDGES = [[0, 1], [1, 2], [3, 4], [4, 5], [6, 7], [7, 8], [0, 3], [3, 6], [1, 4], [4, 7], [2, 5], [5, 8], [0, 4], [4, 8], [2, 4], [4, 6]];

  function clone(state) { return { board: [...state.board], turn: state.turn }; }
  function other(player) { return player === 'blue' ? 'orange' : 'blue'; }
  function validIndex(index) { return Number.isInteger(index) && index >= 0 && index < 9; }

  function createState(input = {}) {
    const board = input.board === undefined ? Array(9).fill(null) : input.board;
    const turn = input.turn === undefined ? 'blue' : input.turn;
    if (!Array.isArray(board) || board.length !== 9 || board.some((piece) => piece !== null && !PLAYERS.includes(piece))) throw new Error('말판 정보가 올바르지 않습니다.');
    if (!PLAYERS.includes(turn)) throw new Error('차례 정보가 올바르지 않습니다.');
    if (PLAYERS.some((player) => board.filter((piece) => piece === player).length > 3)) throw new Error('말은 세 개까지만 둘 수 있습니다.');
    return { board: [...board], turn };
  }

  function winner(state) {
    const current = createState(state);
    return PLAYERS.find((player) => LINES.some((line) => line.every((index) => current.board[index] === player))) || null;
  }
  function getStatus(state) { const won = winner(state); return won ? `${won}-won` : 'playing'; }
  function getPhase(state) { const current = createState(state); return current.board.filter(Boolean).length < 6 ? 'placing' : 'moving'; }
  function assertPlaying(state) { if (getStatus(state) !== 'playing') throw new Error('게임이 이미 끝났습니다.'); }

  function place(state, index) {
    const next = clone(createState(state));
    assertPlaying(next);
    if (getPhase(next) !== 'placing') throw new Error('이제 말을 움직이세요.');
    if (!validIndex(index) || next.board[index] !== null) throw new Error('빈 칸을 고르세요.');
    if (next.board.filter((piece) => piece === next.turn).length >= 3) throw new Error('내 말 세 개를 모두 놓았습니다.');
    next.board[index] = next.turn;
    if (getStatus(next) === 'playing') next.turn = other(next.turn);
    return next;
  }

  function connected(from, to) { return EDGES.some(([first, second]) => (first === from && second === to) || (first === to && second === from)); }
  function move(state, from, to) {
    const next = clone(createState(state));
    assertPlaying(next);
    if (getPhase(next) !== 'moving') throw new Error('먼저 말을 모두 놓으세요.');
    if (!validIndex(from) || !validIndex(to) || next.board[from] !== next.turn || next.board[to] !== null) throw new Error('내 말과 빈 칸을 고르세요.');
    if (!connected(from, to)) throw new Error('선으로 연결된 이웃 칸으로만 움직일 수 있습니다.');
    next.board[to] = next.turn;
    next.board[from] = null;
    if (getStatus(next) === 'playing') next.turn = other(next.turn);
    return next;
  }

  return { createState, getStatus, getPhase, place, move, LINES, EDGES };
}));
