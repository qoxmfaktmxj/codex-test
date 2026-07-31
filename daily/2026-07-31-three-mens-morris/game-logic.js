(function defineMorris(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.Morris = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const PLAYER = '나';
  const COMPUTER = '상대';
  const EMPTY = null;
  const LINES = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  const NEIGHBORS = [
    [1, 3, 4], [0, 2, 4], [1, 4, 5],
    [0, 4, 6], [0, 1, 2, 3, 5, 6, 7, 8], [2, 4, 8],
    [3, 4, 7], [4, 6, 8], [4, 5, 7],
  ];

  function other(player) {
    return player === PLAYER ? COMPUTER : PLAYER;
  }

  function count(board, player) {
    return board.filter((piece) => piece === player).length;
  }

  function hasLine(board, player) {
    return LINES.some((line) => line.every((index) => board[index] === player));
  }

  function validateBoard(board) {
    if (!Array.isArray(board) || board.length !== 9 || board.some((piece) => piece !== PLAYER && piece !== COMPUTER && piece !== EMPTY)) {
      throw new Error('말판 정보가 올바르지 않습니다.');
    }
    if (count(board, PLAYER) > 3 || count(board, COMPUTER) > 3) throw new Error('각 말은 세 개까지만 둘 수 있습니다.');
  }

  function describe(game) {
    if (game.status === '승리') return '가로·세로·대각선 한 줄을 완성했습니다. 승리!';
    if (game.status === '패배') return '상대가 한 줄을 완성했습니다. 다음 판에 다시 도전하세요.';
    return game.phase === '놓기'
      ? `${game.turn} 차례입니다. 빈 교차점에 말을 놓으세요.`
      : `${game.turn} 차례입니다. 내 말을 인접한 빈 교차점으로 옮기세요.`;
  }

  function buildGame(board, turn) {
    const winner = hasLine(board, PLAYER) ? PLAYER : hasLine(board, COMPUTER) ? COMPUTER : null;
    const phase = count(board, turn) < 3 ? '놓기' : '이동';
    const status = winner ? (winner === PLAYER ? '승리' : '패배') : '진행 중';
    const game = { board, turn, phase, status };
    return { ...game, message: describe(game) };
  }

  function createGame(options = {}) {
    const board = options.board ? options.board.slice() : Array(9).fill(EMPTY);
    validateBoard(board);
    const turn = options.turn || PLAYER;
    if (turn !== PLAYER && turn !== COMPUTER) throw new Error('차례 정보가 올바르지 않습니다.');
    return buildGame(board, turn);
  }

  function availableMoves(game) {
    if (game.status !== '진행 중') return [];
    if (game.phase === '놓기') return game.board.flatMap((piece, to) => piece === EMPTY ? [{ to }] : []);
    return game.board.flatMap((piece, from) => piece !== game.turn ? [] : NEIGHBORS[from]
      .filter((to) => game.board[to] === EMPTY)
      .map((to) => ({ from, to })));
  }

  function sameMove(first, second) {
    return first.from === second.from && first.to === second.to;
  }

  function applyMove(game, move) {
    if (game.status !== '진행 중') throw new Error('이미 끝난 게임입니다.');
    if (!move || !Number.isInteger(move.to) || move.to < 0 || move.to > 8) throw new Error('도착 교차점이 올바르지 않습니다.');
    const legal = availableMoves(game);
    if (!legal.some((candidate) => sameMove(candidate, move))) {
      if (game.phase === '이동' && Number.isInteger(move.from) && !NEIGHBORS[move.from].includes(move.to)) {
        throw new Error('인접한 교차점으로만 움직일 수 있습니다.');
      }
      throw new Error('둘 수 없는 자리입니다.');
    }
    const board = game.board.slice();
    if (game.phase === '이동') board[move.from] = EMPTY;
    board[move.to] = game.turn;
    return buildGame(board, other(game.turn));
  }

  function chooseComputerMove(game) {
    const moves = availableMoves(game);
    const winning = moves.find((move) => applyMove(game, move).status === '패배');
    if (winning) return winning;
    const opponent = { ...game, turn: other(game.turn), phase: count(game.board, other(game.turn)) < 3 ? '놓기' : '이동' };
    const threats = availableMoves(opponent).filter((move) => applyMove(opponent, move).status === '승리');
    const blocking = moves.find((move) => threats.some((threat) => threat.to === move.to));
    return blocking || moves[0] || null;
  }

  return { PLAYER, COMPUTER, EMPTY, createGame, availableMoves, applyMove, chooseComputerMove };
}));
