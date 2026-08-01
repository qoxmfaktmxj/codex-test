(function defineMuTorere(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MuTorere = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const PLAYER = '나';
  const COMPUTER = '상대';
  const EMPTY = null;
  const CENTER = 4;
  const NEIGHBORS = [
    [1, 8, CENTER], [0, 2, CENTER], [1, 3, CENTER], [2, CENTER, 5],
    [0, 1, 2, 3, 5, 6, 7, 8], [3, CENTER, 6], [5, CENTER, 7], [6, CENTER, 8], [7, 0, CENTER],
  ];
  function other(player) { return player === PLAYER ? COMPUTER : PLAYER; }
  function count(board, player) { return board.filter((piece) => piece === player).length; }
  function validateBoard(board) {
    if (!Array.isArray(board) || board.length !== 9 || board.some((piece) => piece !== PLAYER && piece !== COMPUTER && piece !== EMPTY)) throw new Error('말판 정보가 올바르지 않습니다.');
    if (count(board, PLAYER) !== 4 || count(board, COMPUTER) !== 4 || count(board, EMPTY) !== 1) throw new Error('각 플레이어의 말 네 개와 빈 자리 하나가 필요합니다.');
  }
  function movesFor(board, player) {
    return board.flatMap((piece, from) => piece !== player ? [] : NEIGHBORS[from].filter((to) => board[to] === EMPTY).map((to) => ({ from, to })));
  }
  function describe(game) {
    if (game.status === '승리') return '상대가 움직일 수 없어 승리했습니다!';
    if (game.status === '패배') return '더 이상 움직일 수 없습니다. 다음 판에 다시 도전하세요.';
    return `${game.turn} 차례입니다. 말을 선택한 뒤 빛나는 빈자리를 누르세요.`;
  }
  function buildGame(board, turn) {
    const stuck = movesFor(board, turn).length === 0;
    const status = stuck ? (turn === COMPUTER ? '승리' : '패배') : '진행 중';
    const game = { board, turn, status };
    return { ...game, message: describe(game) };
  }
  function createGame(options = {}) {
    const board = options.board ? options.board.slice() : [PLAYER, PLAYER, PLAYER, PLAYER, EMPTY, COMPUTER, COMPUTER, COMPUTER, COMPUTER];
    validateBoard(board);
    const turn = options.turn || PLAYER;
    if (turn !== PLAYER && turn !== COMPUTER) throw new Error('차례 정보가 올바르지 않습니다.');
    return buildGame(board, turn);
  }
  function availableMoves(game) { return game.status === '진행 중' ? movesFor(game.board, game.turn) : []; }
  function applyMove(game, move) {
    if (game.status !== '진행 중') throw new Error('이미 끝난 게임입니다.');
    if (!move || !Number.isInteger(move.from) || !Number.isInteger(move.to) || move.from < 0 || move.from > 8 || move.to < 0 || move.to > 8) throw new Error('움직일 위치가 올바르지 않습니다.');
    if (!NEIGHBORS[move.from].includes(move.to)) throw new Error('인접한 자리로만 움직일 수 있습니다.');
    if (game.board[move.from] !== game.turn || game.board[move.to] !== EMPTY) throw new Error('움직일 수 없는 자리입니다.');
    const board = game.board.slice();
    board[move.to] = board[move.from];
    board[move.from] = EMPTY;
    return buildGame(board, other(game.turn));
  }
  function chooseComputerMove(game) {
    const moves = availableMoves(game);
    return moves.find((move) => applyMove(game, move).status === '패배') || moves[0] || null;
  }
  return { PLAYER, COMPUTER, EMPTY, CENTER, createGame, availableMoves, applyMove, chooseComputerMove };
}));
