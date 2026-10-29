(function(root, factory) {
  const api = factory();
  if (typeof module !== 'undefined') module.exports = api;
  root.PegLogic = api;
})(globalThis, function() {
  const size = 7;
  const valid = index => {
    const row = Math.floor(index / size);
    const col = index % size;
    return row >= 0 && row < size && col >= 0 && col < size && !((row < 2 || row > 4) && (col < 2 || col > 4));
  };
  const createGame = () => ({ board: Array.from({ length: 49 }, (_, index) => valid(index) && index !== 24 ? 1 : null), moves: 0 });
  const legalMoves = (game, from) => {
    if (game.board[from] !== 1) return [];
    return [-14, 14, -2, 2].map(delta => ({ from, over: from + delta / 2, to: from + delta }))
      .filter(move => {
        const fromRow = Math.floor(move.from / size), fromCol = move.from % size;
        const toRow = Math.floor(move.to / size), toCol = move.to % size;
        const straightJump = (Math.abs(toRow - fromRow) === 2 && toCol === fromCol) || (toRow === fromRow && Math.abs(toCol - fromCol) === 2);
        return straightJump && valid(move.to) && valid(move.over) && game.board[move.over] === 1 && game.board[move.to] === null;
      });
  };
  const playMove = (game, move) => {
    const allowed = legalMoves(game, move.from).some(candidate => candidate.over === move.over && candidate.to === move.to);
    if (!allowed) throw new Error('둘 수 없는 이동');
    const board = [...game.board];
    board[move.from] = null;
    board[move.over] = null;
    board[move.to] = 1;
    return { board, moves: game.moves + 1 };
  };
  const remainingPegs = game => game.board.filter(value => value === 1).length;
  return { createGame, legalMoves, playMove, remainingPegs, valid };
});
