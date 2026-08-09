(function defineMorris(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Morris = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const PLAYER = '당신';
  const COMPUTER = '컴퓨터';
  const MILLS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], [9, 10, 11], [12, 13, 14], [15, 16, 17], [18, 19, 20], [21, 22, 23],
    [0, 9, 21], [3, 10, 18], [6, 11, 15], [1, 4, 7], [16, 19, 22], [8, 12, 17], [5, 13, 20], [2, 14, 23],
  ];
  const NEIGHBORS = [
    [1, 9], [0, 2, 4], [1, 14], [4, 10], [1, 3, 5, 7], [4, 13], [7, 11], [4, 6, 8], [7, 12],
    [0, 10, 21], [3, 9, 11, 18], [6, 10, 15], [8, 13, 17], [5, 12, 14, 20], [2, 13, 23], [11, 16],
    [15, 17, 19], [12, 16], [10, 19], [16, 18, 20, 22], [13, 19], [9, 22], [19, 21, 23], [14, 22],
  ];

  function other(player) { return player === PLAYER ? COMPUTER : PLAYER; }
  function countPieces(board, player) { return board.filter((piece) => piece === player).length; }
  function isMill(board, position, player) {
    return MILLS.some((line) => line.includes(position) && line.every((slot) => board[slot] === player));
  }
  function createGame() {
    return { board: Array(24).fill(null), reserve: { [PLAYER]: 9, [COMPUTER]: 9 }, turn: PLAYER, phase: '놓기', status: '진행 중', winner: null, message: '빈 교차점을 골라 말을 놓으세요.' };
  }
  function getLegalMoves(game) {
    if (game.status !== '진행 중') return [];
    if (game.phase === '잡기') {
      const enemy = other(game.turn);
      const ordinary = game.board.map((piece, index) => piece === enemy && !isMill(game.board, index, enemy) ? index : null).filter(Number.isInteger);
      return ordinary.length ? ordinary : game.board.map((piece, index) => piece === enemy ? index : null).filter(Number.isInteger);
    }
    if (game.reserve[game.turn] > 0) return game.board.map((piece, index) => piece === null ? index : null).filter(Number.isInteger);
    return game.board.map((piece, index) => piece === game.turn && getMoveDestinations(game, index).length ? index : null).filter(Number.isInteger);
  }
  function getMoveDestinations(game, from) {
    if (game.status !== '진행 중' || game.phase === '잡기' || game.reserve[game.turn] > 0 || game.board[from] !== game.turn) return [];
    const empty = game.board.map((piece, index) => piece === null ? index : null).filter(Number.isInteger);
    return countPieces(game.board, game.turn) === 3 ? empty : NEIGHBORS[from].filter((slot) => game.board[slot] === null);
  }
  function afterAction(game, board, reserve) {
    const madeMill = isMill(board, game.lastPosition, game.turn);
    if (madeMill) return { ...game, board, reserve, phase: '잡기', message: '가로·세로 한 줄을 완성했습니다! 컴퓨터 말 하나를 잡으세요.' };
    return nextTurn({ ...game, board, reserve });
  }
  function nextTurn(game) {
    const next = other(game.turn);
    const nextGame = { ...game, turn: next, phase: '놓기' };
    if (game.reserve[next] === 0 && (countPieces(game.board, next) < 3 || getLegalMoves(nextGame).length === 0)) {
      return { ...game, turn: next, phase: '종료', status: '종료', winner: game.turn, message: `${game.turn}의 승리입니다!` };
    }
    return { ...nextGame, message: `${next} 차례입니다.` };
  }
  function placePiece(game, position) {
    if (game.status !== '진행 중' || game.phase !== '놓기' || game.reserve[game.turn] === 0 || !Number.isInteger(position) || game.board[position] !== null) throw new Error('말을 놓을 수 없는 자리입니다.');
    const board = game.board.slice(); board[position] = game.turn;
    const reserve = { ...game.reserve, [game.turn]: game.reserve[game.turn] - 1 };
    return afterAction({ ...game, lastPosition: position }, board, reserve);
  }
  function movePiece(game, from, to) {
    if (game.status !== '진행 중' || game.phase !== '놓기' || game.reserve[game.turn] > 0 || !getMoveDestinations(game, from).includes(to)) throw new Error('그렇게 말을 움직일 수 없습니다.');
    const board = game.board.slice(); board[from] = null; board[to] = game.turn;
    return afterAction({ ...game, lastPosition: to }, board, { ...game.reserve });
  }
  function removePiece(game, position) {
    if (game.status !== '진행 중' || game.phase !== '잡기') throw new Error('지금은 말을 잡을 수 없습니다.');
    if (game.board[position] === game.turn) throw new Error('자기 말을 잡을 수 없습니다.');
    if (!getLegalMoves(game).includes(position)) throw new Error('그 말을 잡을 수 없습니다.');
    const board = game.board.slice(); board[position] = null;
    return nextTurn({ ...game, board, phase: '놓기' });
  }
  return { PLAYER, COMPUTER, createGame, isMill, getLegalMoves, getMoveDestinations, placePiece, movePiece, removePiece };
}));
