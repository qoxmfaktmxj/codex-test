(function defineMiniFanorona(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MiniFanorona = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const WIDTH = 5;
  const PLAYERS = ['white', 'black'];
  const other = (player) => player === 'white' ? 'black' : 'white';
  const inBoard = (index) => Number.isInteger(index) && index >= 0 && index < WIDTH * WIDTH;

  function createState(input = {}) {
    const board = input.board === undefined
      ? ['black', 'black', 'black', 'black', 'black', 'black', 'black', 'black', 'black', 'black', 'black', 'black', null, 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white']
      : input.board;
    const turn = input.turn === undefined ? 'white' : input.turn;
    const chainFrom = input.chainFrom === undefined ? null : input.chainFrom;
    if (!Array.isArray(board) || board.length !== WIDTH * WIDTH || board.some((piece) => piece !== null && !PLAYERS.includes(piece))) throw new Error('말판 정보가 올바르지 않습니다.');
    if (!PLAYERS.includes(turn)) throw new Error('차례 정보가 올바르지 않습니다.');
    if (chainFrom !== null && (!inBoard(chainFrom) || board[chainFrom] !== turn)) throw new Error('연속 잡기 정보가 올바르지 않습니다.');
    return { board: [...board], turn, chainFrom };
  }

  function neighbors(index) {
    if (!inBoard(index)) return [];
    const row = Math.floor(index / WIDTH);
    const col = index % WIDTH;
    const result = [];
    for (const [rowStep, colStep] of [[-1, 0], [0, -1], [0, 1], [1, 0]]) {
      const nextRow = row + rowStep;
      const nextCol = col + colStep;
      if (nextRow >= 0 && nextRow < WIDTH && nextCol >= 0 && nextCol < WIDTH) result.push(nextRow * WIDTH + nextCol);
    }
    if ((row + col) % 2 === 0) {
      for (const [rowStep, colStep] of [[-1, -1], [-1, 1], [1, -1], [1, 1]]) {
        const nextRow = row + rowStep;
        const nextCol = col + colStep;
        if (nextRow >= 0 && nextRow < WIDTH && nextCol >= 0 && nextCol < WIDTH) result.push(nextRow * WIDTH + nextCol);
      }
    }
    return result.sort((a, b) => a - b);
  }

  function captureLine(board, start, rowStep, colStep, opponent) {
    const captured = [];
    let row = Math.floor(start / WIDTH) + rowStep;
    let col = (start % WIDTH) + colStep;
    while (row >= 0 && row < WIDTH && col >= 0 && col < WIDTH && board[row * WIDTH + col] === opponent) {
      captured.push(row * WIDTH + col);
      row += rowStep;
      col += colStep;
    }
    return captured;
  }

  function possibleMoves(state) {
    const current = createState(state);
    const moves = [];
    current.board.forEach((piece, from) => {
      if (current.chainFrom !== null && from !== current.chainFrom) return;
      if (piece !== current.turn) return;
      neighbors(from).forEach((to) => {
        if (current.board[to] !== null) return;
        const rowStep = Math.floor(to / WIDTH) - Math.floor(from / WIDTH);
        const colStep = (to % WIDTH) - (from % WIDTH);
        const approach = captureLine(current.board, to, rowStep, colStep, other(current.turn));
        const withdrawal = captureLine(current.board, from, -rowStep, -colStep, other(current.turn));
        if (approach.length) moves.push({ from, to, mode: 'approach', captured: approach });
        if (withdrawal.length) moves.push({ from, to, mode: 'withdrawal', captured: withdrawal });
        if (!approach.length && !withdrawal.length) moves.push({ from, to, mode: 'quiet', captured: [] });
      });
    });
    return moves;
  }

  function getLegalMoves(state) {
    const moves = possibleMoves(state);
    const captures = moves.filter((move) => move.mode !== 'quiet');
    if (createState(state).chainFrom !== null) return captures;
    return captures.length ? captures : moves;
  }

  function getStatus(state) {
    const current = createState(state);
    if (!current.board.includes(current.turn) || !current.board.includes(other(current.turn))) return 'finished';
    return getLegalMoves(current).length ? 'playing' : 'finished';
  }

  function getWinner(state) {
    const current = createState(state);
    const opponent = other(current.turn);
    if (!current.board.includes(current.turn)) return opponent;
    if (!current.board.includes(opponent)) return current.turn;
    return getLegalMoves(current).length ? null : opponent;
  }

  function move(state, from, to, mode) {
    const current = createState(state);
    if (getStatus(current) === 'finished') throw new Error('이미 끝난 게임입니다.');
    const selected = getLegalMoves(current).find((candidate) => candidate.from === from && candidate.to === to && (mode === undefined || candidate.mode === mode));
    if (!selected) throw new Error('잡을 수 있는 수가 있으면 반드시 잡아야 합니다.');
    current.board[from] = null;
    current.board[to] = current.turn;
    selected.captured.forEach((index) => { current.board[index] = null; });
    if (selected.mode !== 'quiet') {
      const chained = { ...current, chainFrom: to };
      if (getLegalMoves(chained).length) return chained;
    }
    current.chainFrom = null;
    current.turn = other(current.turn);
    return current;
  }

  return { WIDTH, createState, neighbors, getLegalMoves, getStatus, getWinner, move };
}));
