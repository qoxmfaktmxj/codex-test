(function defineSixMensMorris(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SixMensMorris = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const SIZE = 16;
  const EDGES = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,0],[8,9],[9,10],[10,11],[11,12],[12,13],[13,14],[14,15],[15,8],[1,9],[3,11],[5,13],[7,15]];
  const MILLS = [[0,1,2],[2,3,4],[4,5,6],[6,7,0],[8,9,10],[10,11,12],[12,13,14],[14,15,8]];

  function createState(input = {}) {
    const board = input.board === undefined ? Array(SIZE).fill(null) : input.board;
    const turn = input.turn === undefined ? 'black' : input.turn;
    const toPlace = input.toPlace === undefined ? { black: 6, white: 6 } : input.toPlace;
    const pendingRemoval = input.pendingRemoval === true;
    if (!Array.isArray(board) || board.length !== SIZE || !board.every((piece) => piece === null || piece === 'black' || piece === 'white')) throw new Error('말판 정보가 올바르지 않습니다.');
    if (!['black', 'white'].includes(turn)) throw new Error('차례 정보가 올바르지 않습니다.');
    if (!toPlace || !Number.isInteger(toPlace.black) || !Number.isInteger(toPlace.white) || toPlace.black < 0 || toPlace.white < 0 || toPlace.black > 6 || toPlace.white > 6) throw new Error('남은 말 정보가 올바르지 않습니다.');
    return { board: [...board], turn, toPlace: { ...toPlace }, pendingRemoval };
  }

  function opponent(player) { return player === 'black' ? 'white' : 'black'; }
  function isIndex(index) { return Number.isInteger(index) && index >= 0 && index < SIZE; }
  function neighbors(index) { return EDGES.filter(([a, b]) => a === index || b === index).map(([a, b]) => a === index ? b : a); }
  function formsMill(board, index, player) { return MILLS.some((line) => line.includes(index) && line.every((spot) => board[spot] === player)); }
  function isInAnyMill(board, index, player) { return MILLS.some((line) => line.includes(index) && line.every((spot) => board[spot] === player)); }
  function countPieces(board, player) { return board.filter((piece) => piece === player).length; }
  function hasLegalMove(board, player) { return board.some((piece, index) => piece === player && neighbors(index).some((neighbor) => board[neighbor] === null)); }

  function getStatus(state) {
    const current = createState(state);
    if (current.toPlace.black === 0 && countPieces(current.board, 'black') < 3) return 'white-won';
    if (current.toPlace.white === 0 && countPieces(current.board, 'white') < 3) return 'black-won';
    if (current.toPlace.black === 0 && current.toPlace.white === 0 && !current.pendingRemoval && !hasLegalMove(current.board, current.turn)) return `${opponent(current.turn)}-won`;
    return 'playing';
  }

  function play(state, first, second) {
    const next = createState(state);
    if (getStatus(next) !== 'playing') throw new Error('게임이 이미 끝났습니다.');
    if (!isIndex(first)) throw new Error('말판의 칸을 선택하세요.');

    if (next.pendingRemoval) {
      const target = next.board[first];
      const enemy = opponent(next.turn);
      if (target !== enemy) throw new Error('상대 말을 선택하세요.');
      const removable = next.board.some((piece, index) => piece === enemy && !isInAnyMill(next.board, index, enemy));
      if (removable && isInAnyMill(next.board, first, enemy)) throw new Error('줄 밖의 상대 말을 먼저 없애세요.');
      next.board[first] = null;
      next.pendingRemoval = false;
      next.turn = enemy;
      return next;
    }

    if (next.toPlace[next.turn] > 0) {
      if (next.board[first]) throw new Error('그 칸은 비어 있지 않습니다.');
      next.board[first] = next.turn;
      next.toPlace[next.turn] -= 1;
      if (formsMill(next.board, first, next.turn)) next.pendingRemoval = true;
      else next.turn = opponent(next.turn);
      return next;
    }

    if (!isIndex(second)) throw new Error('도착 칸을 선택하세요.');
    if (next.board[first] !== next.turn) throw new Error('내 말을 선택하세요.');
    if (next.board[second]) throw new Error('그 칸은 비어 있지 않습니다.');
    if (!neighbors(first).includes(second)) throw new Error('인접한 선을 따라 움직이세요.');
    next.board[first] = null;
    next.board[second] = next.turn;
    if (formsMill(next.board, second, next.turn)) next.pendingRemoval = true;
    else next.turn = opponent(next.turn);
    return next;
  }

  return { SIZE, EDGES, MILLS, createState, neighbors, formsMill, play, getStatus };
}));
