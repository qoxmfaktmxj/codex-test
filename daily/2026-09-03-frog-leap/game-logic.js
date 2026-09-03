(function defineFrogLeap(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.FrogLeap = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const SIZE = 7;
  const FROGS = ['left', 'right'];
  const START = ['left', 'left', 'left', null, 'right', 'right', 'right'];
  const FINISH = ['right', 'right', 'right', null, 'left', 'left', 'left'];

  function createState(input = {}) {
    const board = input.board === undefined ? START : input.board;
    const moves = input.moves === undefined ? 0 : input.moves;
    if (!Array.isArray(board) || board.length !== SIZE || board.some((frog) => frog !== null && !FROGS.includes(frog))) throw new Error('줄 정보가 올바르지 않습니다.');
    if (board.filter((frog) => frog === 'left').length !== 3 || board.filter((frog) => frog === 'right').length !== 3) throw new Error('양쪽 개구리는 각각 세 마리여야 합니다.');
    if (!Number.isInteger(moves) || moves < 0) throw new Error('이동 횟수가 올바르지 않습니다.');
    return { board: [...board], moves };
  }

  function sameLine(first, second) { return first.every((frog, index) => frog === second[index]); }
  function direction(frog) { return frog === 'left' ? 1 : -1; }

  function getMoves(state) {
    const current = createState(state);
    if (sameLine(current.board, FINISH)) return [];
    const moves = [];
    current.board.forEach((frog, from) => {
      if (!frog) return;
      for (const distance of [1, 2]) {
        const to = from + direction(frog) * distance;
        if (to < 0 || to >= SIZE || current.board[to] !== null) continue;
        if (distance === 2 && current.board[from + direction(frog)] === null) continue;
        moves.push({ from, to });
      }
    });
    return moves;
  }

  function getStatus(state) {
    const current = createState(state);
    if (sameLine(current.board, FINISH)) return 'won';
    return getMoves(current).length ? 'playing' : 'stuck';
  }

  function move(state, from, to) {
    const current = createState(state);
    if (getStatus(current) === 'won') throw new Error('게임이 이미 끝났습니다.');
    if (!Number.isInteger(from) || !Number.isInteger(to) || from < 0 || from >= SIZE || to < 0 || to >= SIZE) throw new Error('줄 안의 칸을 고르세요.');
    const frog = current.board[from];
    if (!frog) throw new Error('개구리가 있는 칸을 고르세요.');
    if ((to - from) * direction(frog) <= 0) throw new Error('개구리는 앞으로만 움직일 수 있습니다.');
    const distance = Math.abs(to - from);
    if (distance !== 1 && distance !== 2) throw new Error('한 칸 또는 한 마리만 뛰어넘을 수 있습니다.');
    if (current.board[to] !== null) throw new Error('비어 있는 칸으로만 움직일 수 있습니다.');
    if (distance === 2 && current.board[from + direction(frog)] === null) throw new Error('뛰어넘을 개구리가 있어야 합니다.');
    current.board[to] = frog;
    current.board[from] = null;
    current.moves += 1;
    return current;
  }

  return { createState, getMoves, getStatus, move, SIZE };
}));
