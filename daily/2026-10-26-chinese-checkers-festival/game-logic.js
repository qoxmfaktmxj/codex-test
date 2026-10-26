(function(root, factory) {
  const api = factory();
  if (typeof module !== 'undefined') module.exports = api;
  root.ChineseCheckersLogic = api;
})(globalThis, function() {
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, 1], [1, -1]];
  const key = (x, y) => `${x},${y}`;
  const inside = (x, y) => x >= 0 && x < 9 && y >= 0 && y < 9;
  const createGame = () => ({ turn: 'red', pieces: [
    { id: 'r0', side: 'red', x: 4, y: 2 }, { id: 'r1', side: 'red', x: 3, y: 1 }, { id: 'r2', side: 'red', x: 5, y: 1 },
    { id: 'b0', side: 'blue', x: 4, y: 6 }, { id: 'b1', side: 'blue', x: 3, y: 7 }, { id: 'b2', side: 'blue', x: 5, y: 7 }
  ] });
  const occupied = (game, x, y) => game.pieces.some(piece => piece.x === x && piece.y === y);
  const legalMoves = (game, id) => {
    const piece = game.pieces.find(item => item.id === id);
    if (!piece || piece.side !== game.turn) return [];
    const moves = [], seen = new Set(), add = (x, y) => { if (inside(x, y) && !occupied(game, x, y) && !seen.has(key(x, y))) { seen.add(key(x, y)); moves.push({ x, y }); } };
    dirs.forEach(([dx, dy]) => add(piece.x + dx, piece.y + dy));
    const jump = (x, y) => dirs.forEach(([dx, dy]) => {
      const mx = x + dx, my = y + dy, nx = x + dx * 2, ny = y + dy * 2;
      if (inside(nx, ny) && occupied(game, mx, my) && !occupied(game, nx, ny) && !seen.has(key(nx, ny))) { add(nx, ny); jump(nx, ny); }
    });
    jump(piece.x, piece.y);
    return moves.sort((a, b) => a.y - b.y || a.x - b.x);
  };
  const move = (game, id, target) => {
    if (winner(game)) return game;
    if (!legalMoves(game, id).some(cell => cell.x === target.x && cell.y === target.y)) return game;
    return { turn: game.turn === 'red' ? 'blue' : 'red', pieces: game.pieces.map(piece => piece.id === id ? { ...piece, x: target.x, y: target.y } : piece) };
  };
  const winner = game => {
    const red = game.pieces.filter(piece => piece.side === 'red');
    const blue = game.pieces.filter(piece => piece.side === 'blue');
    const sameCells = (pieces, cells) => pieces.length === cells.length && pieces.every(piece => cells.some(cell => cell.x === piece.x && cell.y === piece.y));
    if (sameCells(red, [{ x: 4, y: 6 }, { x: 3, y: 7 }, { x: 5, y: 7 }])) return 'red';
    if (sameCells(blue, [{ x: 4, y: 2 }, { x: 3, y: 1 }, { x: 5, y: 1 }])) return 'blue';
    return null;
  };
  return { createGame, legalMoves, move, winner };
});
