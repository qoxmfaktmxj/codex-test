(function defineDara(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Dara = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const PLAYERS = ['blue', 'orange'];
  const WIDTH = 5;
  const SIZE = 30;
  const other = (player) => player === 'blue' ? 'orange' : 'blue';
  const validIndex = (index) => Number.isInteger(index) && index >= 0 && index < SIZE;
  const count = (board, player) => board.filter((piece) => piece === player).length;

  function createState(input = {}) {
    const board = input.board === undefined ? Array(SIZE).fill(null) : input.board;
    const turn = input.turn === undefined ? 'blue' : input.turn;
    const placed = input.placed === undefined ? { blue: 0, orange: 0 } : input.placed;
    const captures = input.captures === undefined ? { blue: 0, orange: 0 } : input.captures;
    const pendingCapture = input.pendingCapture === true;
    if (!Array.isArray(board) || board.length !== SIZE || board.some((piece) => piece !== null && !PLAYERS.includes(piece))) throw new Error('말판 정보가 올바르지 않습니다.');
    if (!PLAYERS.includes(turn)) throw new Error('차례 정보가 올바르지 않습니다.');
    for (const player of PLAYERS) {
      if (!Number.isInteger(placed[player]) || placed[player] < count(board, player) || placed[player] > 12) throw new Error('놓은 말 수가 올바르지 않습니다.');
      if (!Number.isInteger(captures[player]) || captures[player] < 0 || captures[player] > 10) throw new Error('잡은 말 수가 올바르지 않습니다.');
    }
    return { board: [...board], turn, placed: { ...placed }, captures: { ...captures }, pendingCapture };
  }

  function clone(state) {
    const current = createState(state);
    return { board: [...current.board], turn: current.turn, placed: { ...current.placed }, captures: { ...current.captures }, pendingCapture: current.pendingCapture };
  }

  function getPhase(state) {
    const current = createState(state);
    return current.placed.blue === 12 && current.placed.orange === 12 ? 'moving' : 'placing';
  }

  function getStatus(state) {
    const current = createState(state);
    const winner = PLAYERS.find((player) => current.captures[player] >= 10);
    if (winner) return `${winner}-won`;
    if (current.pendingCapture) return `${current.turn}-capture`;
    return 'playing';
  }

  function assertPlaying(state) {
    if (getStatus(state).endsWith('-won')) throw new Error('게임이 이미 끝났습니다.');
  }

  function lineLength(board, index, player) {
    const row = Math.floor(index / WIDTH);
    const col = index % WIDTH;
    const lengths = [
      (() => { let n = 1; for (let c = col - 1; c >= 0 && board[row * WIDTH + c] === player; c -= 1) n += 1; for (let c = col + 1; c < WIDTH && board[row * WIDTH + c] === player; c += 1) n += 1; return n; })(),
      (() => { let n = 1; for (let r = row - 1; r >= 0 && board[r * WIDTH + col] === player; r -= 1) n += 1; for (let r = row + 1; r < SIZE / WIDTH && board[r * WIDTH + col] === player; r += 1) n += 1; return n; })(),
    ];
    return Math.max(...lengths);
  }

  function endsTurn(next) { next.turn = other(next.turn); return next; }

  function place(state, index) {
    const next = clone(state);
    assertPlaying(next);
    if (next.pendingCapture) throw new Error('먼저 상대 말을 잡으세요.');
    if (getPhase(next) !== 'placing') throw new Error('이제 말을 움직이세요.');
    if (!validIndex(index) || next.board[index] !== null) throw new Error('빈 칸을 고르세요.');
    if (next.placed[next.turn] >= 12) throw new Error('내 말 열두 개를 모두 놓았습니다.');
    next.board[index] = next.turn;
    if (lineLength(next.board, index, next.turn) >= 4) throw new Error('말 네 개를 한 줄로 놓을 수 없습니다.');
    next.placed[next.turn] += 1;
    return endsTurn(next);
  }

  function isNeighbour(first, second) {
    const rowGap = Math.abs(Math.floor(first / WIDTH) - Math.floor(second / WIDTH));
    const colGap = Math.abs((first % WIDTH) - (second % WIDTH));
    return rowGap + colGap === 1;
  }

  function move(state, from, to) {
    const next = clone(state);
    assertPlaying(next);
    if (next.pendingCapture) throw new Error('먼저 상대 말을 잡으세요.');
    if (getPhase(next) !== 'moving') throw new Error('먼저 말을 모두 놓으세요.');
    if (!validIndex(from) || !validIndex(to) || next.board[from] !== next.turn || next.board[to] !== null) throw new Error('내 말과 빈 칸을 고르세요.');
    if (!isNeighbour(from, to)) throw new Error('가로 또는 세로 이웃 칸으로만 움직일 수 있습니다.');
    next.board[from] = null;
    next.board[to] = next.turn;
    const length = lineLength(next.board, to, next.turn);
    if (length >= 4) throw new Error('말 네 개를 한 줄로 만들 수 없습니다.');
    if (length === 3) { next.pendingCapture = true; return next; }
    return endsTurn(next);
  }

  function capture(state, index) {
    const next = clone(state);
    assertPlaying(next);
    if (!next.pendingCapture) throw new Error('지금은 잡을 차례가 아닙니다.');
    if (!validIndex(index) || next.board[index] !== other(next.turn)) throw new Error('상대 말을 고르세요.');
    if (lineLength(next.board, index, next.board[index]) >= 3) throw new Error('상대의 세 개 한 줄에 있는 말은 잡을 수 없습니다.');
    next.board[index] = null;
    next.captures[next.turn] += 1;
    next.pendingCapture = false;
    if (getStatus(next).endsWith('-won')) return next;
    return endsTurn(next);
  }

  return { createState, getPhase, getStatus, place, move, capture, WIDTH, SIZE };
}));
