(function(root, factory) { const api = factory(); if (typeof module !== 'undefined') module.exports = api; root.InkGomokuLogic = api; })(globalThis, function() {
  const other = player => player === '흑돌' ? '백돌' : '흑돌';
  const createGame = size => {
    if (!Number.isInteger(size) || size < 5) throw new Error('크기는 5 이상이어야 합니다');
    return { size, board: Array.from({ length: size }, () => Array(size).fill('')), turn: '흑돌', finished: false, winner: null, winningCells: [], lastMove: null, message: '흑돌 차례 · 빈 교차점을 고르세요' };
  };
  const winningLine = (board, row, col) => {
    const stone = board[row][col]; if (!stone) return [];
    for (const [dr, dc] of [[0,1],[1,0],[1,1],[1,-1]]) {
      const cells = [[row, col]];
      for (const sign of [-1, 1]) for (let step = 1; ; step++) { const r = row + dr * step * sign; const c = col + dc * step * sign; if (r < 0 || c < 0 || r >= board.length || c >= board.length || board[r][c] !== stone) break; cells.push([r,c]); }
      if (cells.length >= 5) return cells.sort((a,b) => a[0] - b[0] || a[1] - b[1]).slice(0, 5);
    }
    return [];
  };
  const placeStone = (game, row, col) => {
    if (!Number.isInteger(row) || !Number.isInteger(col) || row < 0 || col < 0 || row >= game.size || col >= game.size) throw new Error('게임판 범위를 벗어났습니다');
    if (game.finished) return game;
    if (game.board[row][col]) throw new Error('이미 돌이 놓인 자리입니다');
    const board = game.board.map(line => line.slice()); board[row][col] = game.turn;
    const winningCells = winningLine(board, row, col); const full = board.every(line => line.every(Boolean)); const finished = Boolean(winningCells.length) || full; const winner = winningCells.length ? game.turn : full ? '무승부' : null;
    return { ...game, board, turn: finished ? game.turn : other(game.turn), finished, winner, winningCells, lastMove: [row,col], message: finished ? (winner === '무승부' ? '정원이 가득 찼습니다 · 무승부' : winner + ' 승리 · 다섯 알이 이어졌습니다') : other(game.turn) + ' 차례 · 빈 교차점을 고르세요' };
  };
  return { createGame, placeStone, resetGame: createGame };
});
