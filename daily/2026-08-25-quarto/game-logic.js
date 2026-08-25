(function defineQuarto(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Quarto = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const TRAITS = ['tall', 'dark', 'square', 'hollow'];
  const SIZE = 4;

  function createPieces() {
    return Array.from({ length: 16 }, (_, id) => ({
      id,
      traits: {
        tall: Boolean(id & 1),
        dark: Boolean(id & 2),
        square: Boolean(id & 4),
        hollow: Boolean(id & 8),
      },
    }));
  }

  function isPieceId(id) { return Number.isInteger(id) && id >= 0 && id < 16; }
  function cloneBoard(board) { return board.map((row) => [...row]); }

  function createState(input = {}) {
    const board = input.board === undefined ? Array.from({ length: SIZE }, () => Array(SIZE).fill(null)) : input.board;
    const available = input.available === undefined ? Array.from({ length: 16 }, (_, id) => id) : input.available;
    const offeredPiece = input.offeredPiece === undefined ? null : input.offeredPiece;
    if (!Array.isArray(board) || board.length !== SIZE || !board.every((row) => Array.isArray(row) && row.length === SIZE)) throw new Error('말판 정보가 올바르지 않습니다.');
    const placed = board.flat().filter((id) => id !== null);
    if (!placed.every(isPieceId) || new Set(placed).size !== placed.length || !Array.isArray(available) || !available.every(isPieceId) || new Set(available).size !== available.length || !placed.every((id) => !available.includes(id))) throw new Error('말 정보가 올바르지 않습니다.');
    if (offeredPiece !== null && (!isPieceId(offeredPiece) || !available.includes(offeredPiece))) throw new Error('고른 말 정보가 올바르지 않습니다.');
    return { board: cloneBoard(board), available: [...available], offeredPiece };
  }

  function offerPiece(state, pieceId) {
    const next = createState(state);
    if (next.offeredPiece !== null) throw new Error('먼저 고른 말을 말판에 놓아야 합니다.');
    if (!next.available.includes(pieceId)) throw new Error('그 말은 고를 수 없는 말입니다.');
    next.offeredPiece = pieceId;
    return next;
  }

  function placePiece(state, row, column) {
    const next = createState(state);
    if (next.offeredPiece === null) throw new Error('상대에게 줄 말을 먼저 골라야 합니다.');
    if (!Number.isInteger(row) || !Number.isInteger(column) || row < 0 || row >= SIZE || column < 0 || column >= SIZE) throw new Error('말판 칸을 확인하세요.');
    if (next.board[row][column] !== null) throw new Error('이미 말이 놓인 칸입니다.');
    next.board[row][column] = next.offeredPiece;
    next.available = next.available.filter((id) => id !== next.offeredPiece);
    next.offeredPiece = null;
    return next;
  }

  function sharedTrait(pieceIds) {
    if (pieceIds.length !== SIZE || pieceIds.some((id) => id === null)) return null;
    const pieces = createPieces();
    for (const trait of TRAITS) {
      const value = pieces[pieceIds[0]].traits[trait];
      if (pieceIds.every((id) => pieces[id].traits[trait] === value)) return { trait, value };
    }
    return null;
  }

  function getWinner(state) {
    const current = createState(state);
    for (let index = 0; index < SIZE; index += 1) {
      const rowTrait = sharedTrait(current.board[index]);
      if (rowTrait) return { type: 'row', index, ...rowTrait };
      const columnTrait = sharedTrait(current.board.map((row) => row[index]));
      if (columnTrait) return { type: 'column', index, ...columnTrait };
    }
    const diagonals = [current.board.map((row, index) => row[index]), current.board.map((row, index) => row[SIZE - 1 - index])];
    for (let index = 0; index < diagonals.length; index += 1) {
      const trait = sharedTrait(diagonals[index]);
      if (trait) return { type: 'diagonal', index, ...trait };
    }
    return null;
  }

  function getStatus(state) {
    const current = createState(state);
    if (getWinner(current)) return 'won';
    return current.available.length === 0 ? 'draw' : 'playing';
  }

  return { SIZE, TRAITS, createPieces, createState, offerPiece, placePiece, getWinner, getStatus };
}));
