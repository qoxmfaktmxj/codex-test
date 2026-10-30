(function(root, factory) {
  const api = factory();
  if (typeof module !== 'undefined') module.exports = api;
  root.PaperFootballLogic = api;
})(globalThis, function() {
  const size = 5;
  const goals = [3, 23];
  const key = (a, b) => [a, b].sort((x, y) => x - y).join('-');
  const createGame = () => ({ position: 13, edges: [], moves: 0 });
  const legalMoves = game => {
    const row = Math.floor((game.position - 1) / size);
    const col = (game.position - 1) % size;
    const used = new Set(game.edges.map(edge => key(edge.from, edge.to)));
    const moves = [];
    for (let dr = -1; dr <= 1; dr += 1) for (let dc = -1; dc <= 1; dc += 1) {
      if (!dr && !dc) continue;
      const nextRow = row + dr, nextCol = col + dc;
      if (nextRow < 0 || nextRow >= size || nextCol < 0 || nextCol >= size) continue;
      const to = nextRow * size + nextCol + 1;
      if (!used.has(key(game.position, to))) moves.push({ from: game.position, to });
    }
    return moves;
  };
  const playMove = (game, move) => {
    if (!legalMoves(game).some(candidate => candidate.to === move.to && candidate.from === move.from)) throw new Error('둘 수 없는 이동');
    return { position: move.to, edges: [...game.edges, { from: move.from, to: move.to }], moves: game.moves + 1 };
  };
  const isGoal = game => goals.includes(game.position);
  return { createGame, legalMoves, playMove, isGoal, goals, size };
});
