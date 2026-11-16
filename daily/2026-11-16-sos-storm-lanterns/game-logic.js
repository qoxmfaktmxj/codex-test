(function(root, factory) { const api = factory(); if (typeof module !== 'undefined') module.exports = api; root.SosStormLogic = api; })(globalThis, function() {
  const other = player => player === '등대' ? '배' : '등대';
  const createGame = size => {
    if (!Number.isInteger(size) || size < 2) throw new Error('크기는 2 이상이어야 합니다');
    return { size, board: Array.from({ length: size }, () => Array(size).fill('')), turn: '등대', scores: { 등대: 0, 배: 0 }, finished: false, winner: null, lastLines: [], message: '등대 차례 · S 또는 O를 고르세요' };
  };
  const availableLetters = () => ['S', 'O'];
  const linesAt = (board, row, col) => {
    const lines = [];
    [[0,1],[1,0],[1,1],[1,-1]].forEach(([dr, dc]) => {
      for (let offset = -2; offset <= 0; offset++) {
        const cells = [0,1,2].map(step => [row + (offset + step) * dr, col + (offset + step) * dc]);
        if (!cells.some(([r,c]) => r < 0 || c < 0 || r >= board.length || c >= board.length) && cells.some(([r,c]) => r === row && c === col) && cells.map(([r,c]) => board[r][c]).join('') === 'SOS') lines.push(cells);
      }
    });
    return lines;
  };
  const placeLetter = (game, row, col, letter) => {
    if (game.finished) return game;
    if (!Number.isInteger(row) || !Number.isInteger(col) || row < 0 || col < 0 || row >= game.size || col >= game.size) throw new Error('게임판 범위를 벗어났습니다');
    if (!availableLetters().includes(letter)) throw new Error('S 또는 O만 놓을 수 있습니다');
    if (game.board[row][col]) throw new Error('이미 놓인 자리입니다');
    const board = game.board.map(line => line.slice()); board[row][col] = letter;
    const lastLines = linesAt(board, row, col); const scores = { ...game.scores, [game.turn]: game.scores[game.turn] + lastLines.length };
    const full = board.every(line => line.every(Boolean)); const winner = full ? (scores.등대 === scores.배 ? '무승부' : scores.등대 > scores.배 ? '등대' : '배') : null;
    const turn = lastLines.length ? game.turn : other(game.turn);
    const message = full ? (winner === '무승부' ? '전보가 비었습니다 · 무승부' : winner + ' 승리 · 신호를 더 많이 보냈습니다') : lastLines.length ? 'SOS 포착! ' + game.turn + '이 한 번 더 둡니다' : turn + ' 차례 · S 또는 O를 고르세요';
    return { ...game, board, scores, turn, finished: full, winner, lastLines, message };
  };
  return { createGame, placeLetter, availableLetters, resetGame: createGame };
});
