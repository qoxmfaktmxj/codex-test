(function defineHex(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Hex = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const SIZE = 7;
  const PLAYER = '나';
  const COMPUTER = '상대';
  const EMPTY = null;
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, 1], [1, -1]];
  const other = (player) => (player === PLAYER ? COMPUTER : PLAYER);
  const row = (index) => Math.floor(index / SIZE);
  const column = (index) => index % SIZE;

  function neighbors(index) {
    const r = row(index); const c = column(index);
    return directions.map(([dr, dc]) => [r + dr, c + dc])
      .filter(([nextRow, nextColumn]) => nextRow >= 0 && nextRow < SIZE && nextColumn >= 0 && nextColumn < SIZE)
      .map(([nextRow, nextColumn]) => nextRow * SIZE + nextColumn);
  }

  function hasConnection(board, player) {
    const starts = Array.from({ length: SIZE }, (_, offset) => (player === PLAYER ? offset : offset * SIZE));
    const reachesFarSide = player === PLAYER ? (index) => row(index) === SIZE - 1 : (index) => column(index) === SIZE - 1;
    const queue = starts.filter((index) => board[index] === player);
    const seen = new Set(queue);
    while (queue.length) {
      const current = queue.shift();
      if (reachesFarSide(current)) return true;
      neighbors(current).filter((index) => board[index] === player && !seen.has(index)).forEach((index) => { seen.add(index); queue.push(index); });
    }
    return false;
  }

  function describe(status, turn) {
    if (status === '승리') return '파란 길을 위에서 아래까지 이었습니다. 승리!';
    if (status === '패배') return '상대가 빨간 길을 왼쪽에서 오른쪽까지 이었습니다.';
    return `${turn} 차례입니다. 빈 육각형을 눌러 길을 만드세요.`;
  }

  function buildGame(board, turn) {
    const status = hasConnection(board, PLAYER) ? '승리' : hasConnection(board, COMPUTER) ? '패배' : '진행 중';
    return { board, turn, status, message: describe(status, turn) };
  }

  function createGame(options = {}) {
    const board = options.board ? options.board.slice() : Array(SIZE * SIZE).fill(EMPTY);
    if (!Array.isArray(board) || board.length !== SIZE * SIZE || board.some((cell) => cell !== EMPTY && cell !== PLAYER && cell !== COMPUTER)) throw new Error('말판 정보가 올바르지 않습니다.');
    const turn = options.turn || PLAYER;
    if (turn !== PLAYER && turn !== COMPUTER) throw new Error('차례 정보가 올바르지 않습니다.');
    return buildGame(board, turn);
  }

  function applyMove(game, index) {
    if (game.status !== '진행 중') throw new Error('이미 끝난 게임입니다.');
    if (!Number.isInteger(index) || index < 0 || index >= SIZE * SIZE) throw new Error('놓을 위치가 올바르지 않습니다.');
    if (game.board[index] !== EMPTY) throw new Error('빈 칸에만 놓을 수 있습니다.');
    const board = game.board.slice();
    board[index] = game.turn;
    return buildGame(board, other(game.turn));
  }

  function chooseComputerMove(game) {
    if (game.status !== '진행 중' || game.turn !== COMPUTER) return null;
    const open = game.board.map((cell, index) => (cell === EMPTY ? index : null)).filter((index) => index !== null);
    const winning = open.find((index) => hasConnection(game.board.map((cell, cellIndex) => cellIndex === index ? COMPUTER : cell), COMPUTER));
    if (winning !== undefined) return winning;
    const blocking = open.find((index) => hasConnection(game.board.map((cell, cellIndex) => cellIndex === index ? PLAYER : cell), PLAYER));
    if (blocking !== undefined) return blocking;
    return open.sort((a, b) => Math.abs(row(a) - 3) + Math.abs(column(a) - 3) - Math.abs(row(b) - 3) - Math.abs(column(b) - 3) || a - b)[0] || null;
  }

  return { SIZE, PLAYER, COMPUTER, EMPTY, createGame, applyMove, chooseComputerMove, hasConnection };
}));
