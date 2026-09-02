(function defineYote(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Yote = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const PLAYERS = ['blue', 'orange'];
  const WIDTH = 5;
  const HEIGHT = 6;
  const SIZE = WIDTH * HEIGHT;
  const PIECES = 12;
  const other = (player) => player === 'blue' ? 'orange' : 'blue';
  const validIndex = (index) => Number.isInteger(index) && index >= 0 && index < SIZE;
  const count = (board, player) => board.filter((piece) => piece === player).length;

  function createState(input = {}) {
    const board = input.board === undefined ? Array(SIZE).fill(null) : input.board;
    const turn = input.turn === undefined ? 'blue' : input.turn;
    const placed = input.placed === undefined ? { blue: 0, orange: 0 } : input.placed;
    const removed = input.removed === undefined ? { blue: 0, orange: 0 } : input.removed;
    const pendingRemove = input.pendingRemove === true;
    if (!Array.isArray(board) || board.length !== SIZE || board.some((piece) => piece !== null && !PLAYERS.includes(piece))) throw new Error('말판 정보가 올바르지 않습니다.');
    if (!PLAYERS.includes(turn)) throw new Error('차례 정보가 올바르지 않습니다.');
    for (const player of PLAYERS) {
      if (!Number.isInteger(placed[player]) || placed[player] < count(board, player) || placed[player] > PIECES) throw new Error('놓은 말 수가 올바르지 않습니다.');
      if (!Number.isInteger(removed[player]) || removed[player] < 0 || removed[player] > PIECES) throw new Error('잡힌 말 수가 올바르지 않습니다.');
    }
    return { board: [...board], turn, placed: { ...placed }, removed: { ...removed }, pendingRemove };
  }

  function clone(state) { return createState(state); }
  function getPhase(state) { const current = createState(state); return current.placed.blue === PIECES && current.placed.orange === PIECES ? 'moving' : 'placing'; }
  function hasAction(board, player) {
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (let index = 0; index < SIZE; index += 1) {
      if (board[index] !== player) continue;
      const row = Math.floor(index / WIDTH);
      const col = index % WIDTH;
      for (const [rowStep, colStep] of directions) {
        const adjacentRow = row + rowStep;
        const adjacentCol = col + colStep;
        const landingRow = row + rowStep * 2;
        const landingCol = col + colStep * 2;
        if (adjacentRow >= 0 && adjacentRow < HEIGHT && adjacentCol >= 0 && adjacentCol < WIDTH) {
          const adjacent = adjacentRow * WIDTH + adjacentCol;
          if (board[adjacent] === null) return true;
          if (landingRow >= 0 && landingRow < HEIGHT && landingCol >= 0 && landingCol < WIDTH && board[adjacent] === other(player) && board[landingRow * WIDTH + landingCol] === null) return true;
        }
      }
    }
    return false;
  }
  function getStatus(state) {
    const current = createState(state);
    if (getPhase(current) === 'moving') {
      const winner = PLAYERS.find((player) => count(current.board, other(player)) === 0);
      if (winner) return `${winner}-won`;
      if (!current.pendingRemove && !hasAction(current.board, current.turn)) return `${other(current.turn)}-won`;
    }
    if (current.pendingRemove) return `${current.turn}-remove`;
    return 'playing';
  }
  function assertPlaying(state) { if (getStatus(state).endsWith('-won')) throw new Error('게임이 이미 끝났습니다.'); }
  function endTurn(state) { state.turn = other(state.turn); return state; }
  function orthogonalDistance(from, to) {
    const rowGap = Math.abs(Math.floor(from / WIDTH) - Math.floor(to / WIDTH));
    const colGap = Math.abs((from % WIDTH) - (to % WIDTH));
    return rowGap + colGap;
  }

  function place(state, index) {
    const next = clone(state);
    assertPlaying(next);
    if (next.pendingRemove) throw new Error('먼저 상대 말 하나를 골라 치우세요.');
    if (getPhase(next) !== 'placing') throw new Error('이제 말을 움직이세요.');
    if (!validIndex(index) || next.board[index] !== null) throw new Error('빈 칸을 고르세요.');
    if (next.placed[next.turn] >= PIECES) throw new Error('내 말 열두 개를 모두 놓았습니다.');
    next.board[index] = next.turn;
    next.placed[next.turn] += 1;
    return endTurn(next);
  }

  function move(state, from, to) {
    const next = clone(state);
    assertPlaying(next);
    if (next.pendingRemove) throw new Error('먼저 상대 말 하나를 골라 치우세요.');
    if (getPhase(next) !== 'moving') throw new Error('먼저 말을 모두 놓으세요.');
    if (!validIndex(from) || !validIndex(to) || next.board[from] !== next.turn) throw new Error('내 말을 고르세요.');
    if (next.board[to] !== null) throw new Error('빈 칸으로만 움직일 수 있습니다.');
    if (orthogonalDistance(from, to) !== 1) throw new Error('가로 또는 세로 이웃 칸으로만 움직일 수 있습니다.');
    next.board[to] = next.board[from];
    next.board[from] = null;
    return endTurn(next);
  }

  function capture(state, from, to) {
    const next = clone(state);
    assertPlaying(next);
    if (next.pendingRemove) throw new Error('먼저 상대 말 하나를 골라 치우세요.');
    if (getPhase(next) !== 'moving') throw new Error('먼저 말을 모두 놓으세요.');
    if (!validIndex(from) || !validIndex(to) || next.board[from] !== next.turn) throw new Error('내 말을 고르세요.');
    if (next.board[to] !== null || orthogonalDistance(from, to) !== 2) throw new Error('상대 말을 하나 넘어 두 칸 떨어진 빈 칸으로 가야 합니다.');
    const middle = (from + to) / 2;
    if (next.board[middle] !== other(next.turn)) throw new Error('사이에 상대 말이 있어야 합니다.');
    next.board[to] = next.board[from];
    next.board[from] = null;
    next.board[middle] = null;
    next.removed[other(next.turn)] += 1;
    next.pendingRemove = true;
    return next;
  }

  function remove(state, index) {
    const next = clone(state);
    assertPlaying(next);
    if (!next.pendingRemove) throw new Error('지금은 말을 치울 차례가 아닙니다.');
    if (!validIndex(index) || next.board[index] !== other(next.turn)) throw new Error('상대 말 하나를 고르세요.');
    next.board[index] = null;
    next.removed[other(next.turn)] += 1;
    next.pendingRemove = false;
    if (getStatus(next).endsWith('-won')) return next;
    return endTurn(next);
  }

  return { createState, getPhase, getStatus, place, move, capture, remove, WIDTH, HEIGHT, SIZE };
}));
