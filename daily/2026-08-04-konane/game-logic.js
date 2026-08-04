(function defineKonane(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Konane = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const SIZE = 4;
  const PLAYER = '나';
  const COMPUTER = '상대';
  const EMPTY = null;
  const CENTRE = [5, 6, 9, 10];
  const other = (player) => (player === PLAYER ? COMPUTER : PLAYER);
  const row = (index) => Math.floor(index / SIZE);
  const column = (index) => index % SIZE;
  const ownerAtStart = (index) => ((row(index) + column(index)) % 2 === 0 ? PLAYER : COMPUTER);

  function createBoard() {
    return Array.from({ length: SIZE * SIZE }, (_, index) => ownerAtStart(index));
  }

  function normalMoves(board, player) {
    const moves = [];
    board.forEach((piece, from) => {
      if (piece !== player) return;
      [[0, -2], [0, 2], [-2, 0], [2, 0]].forEach(([dr, dc]) => {
        const targetRow = row(from) + dr;
        const targetColumn = column(from) + dc;
        if (targetRow < 0 || targetRow >= SIZE || targetColumn < 0 || targetColumn >= SIZE) return;
        const to = targetRow * SIZE + targetColumn;
        const jumped = (row(from) + dr / 2) * SIZE + column(from) + dc / 2;
        if (board[jumped] === other(player) && board[to] === EMPTY) moves.push({ from, to, jumped });
      });
    });
    return moves.sort((a, b) => a.from - b.from || a.to - b.to);
  }

  function openingMoves(board, player, phase) {
    if ((player === PLAYER && phase !== '시작 제거') || (player === COMPUTER && phase !== '상대 제거')) return [];
    return CENTRE.filter((index) => board[index] === player).map((from) => ({ from }));
  }

  function legalMoves(game) {
    if (game.status !== '진행 중') return [];
    if (game.phase === '도약') return normalMoves(game.board, game.turn);
    return openingMoves(game.board, game.turn, game.phase);
  }

  function describe(status, turn, phase) {
    if (status === '승리') return '상대가 뛰어넘을 수 없습니다. 승리!';
    if (status === '패배') return '더 이상 뛰어넘을 수 없습니다. 상대의 승리입니다.';
    if (phase === '시작 제거') return '가운데의 검은 말 하나를 먼저 치우세요.';
    if (phase === '상대 제거') return '상대가 가운데 흰 말을 치우고 있습니다.';
    return `${turn} 차례입니다. 상대 말 하나를 가로 또는 세로로 뛰어넘으세요.`;
  }

  function buildGame(board, turn, phase, status = '진행 중') {
    return { board, turn, phase, status, message: describe(status, turn, phase) };
  }

  function createGame(options = {}) {
    const board = options.board ? options.board.slice() : createBoard();
    if (!Array.isArray(board) || board.length !== SIZE * SIZE || board.some((piece) => piece !== PLAYER && piece !== COMPUTER && piece !== EMPTY)) throw new Error('말판 정보가 올바르지 않습니다.');
    const turn = options.turn || PLAYER;
    const phase = options.phase || '시작 제거';
    if (turn !== PLAYER && turn !== COMPUTER) throw new Error('차례 정보가 올바르지 않습니다.');
    if (!['시작 제거', '상대 제거', '도약'].includes(phase)) throw new Error('진행 정보가 올바르지 않습니다.');
    return buildGame(board, turn, phase);
  }

  function moveMatches(move, candidate) {
    return move && move.from === candidate.from && (candidate.to === undefined || move.to === candidate.to);
  }

  function applyMove(game, move) {
    if (game.status !== '진행 중') throw new Error('이미 끝난 게임입니다.');
    const candidate = legalMoves(game).find((item) => moveMatches(move, item));
    if (!candidate) {
      if (game.phase !== '도약') throw new Error('가운데의 내 말만 치울 수 있습니다.');
      if (!move || !Number.isInteger(move.from) || !Number.isInteger(move.to)) throw new Error('이동 위치가 올바르지 않습니다.');
      const dr = Math.abs(row(move.to) - row(move.from));
      const dc = Math.abs(column(move.to) - column(move.from));
      if (!((dr === 2 && dc === 0) || (dr === 0 && dc === 2))) throw new Error('가로 또는 세로로 두 칸을 이동해야 합니다.');
      throw new Error('뛰어넘을 상대 말과 빈 칸이 필요합니다.');
    }
    const board = game.board.slice();
    if (game.phase !== '도약') {
      board[candidate.from] = EMPTY;
      const nextPhase = game.phase === '시작 제거' ? '상대 제거' : '도약';
      return buildGame(board, other(game.turn), nextPhase);
    }
    board[candidate.from] = EMPTY;
    board[candidate.jumped] = EMPTY;
    board[candidate.to] = game.turn;
    const nextTurn = other(game.turn);
    const status = normalMoves(board, nextTurn).length === 0 ? (game.turn === PLAYER ? '승리' : '패배') : '진행 중';
    return buildGame(board, nextTurn, '도약', status);
  }

  function chooseComputerMove(game) {
    if (game.status !== '진행 중' || game.turn !== COMPUTER) return null;
    const moves = legalMoves(game);
    if (game.phase === '상대 제거') {
      const removedByPlayer = CENTRE.find((index) => game.board[index] === EMPTY);
      const preferred = removedByPlayer === 5 ? 6 : removedByPlayer === 10 ? 9 : undefined;
      return moves.find((move) => move.from === preferred) || moves[0] || null;
    }
    return moves[0] || null;
  }

  return { SIZE, PLAYER, COMPUTER, EMPTY, createGame, legalMoves, applyMove, chooseComputerMove };
}));
