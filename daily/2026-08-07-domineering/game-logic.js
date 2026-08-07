(function defineDomineering(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Domineering = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const HORIZONTAL = '가로';
  const VERTICAL = '세로';

  function createBoard(size) {
    return Array.from({ length: size }, () => Array(size).fill(null));
  }

  function getLegalMoves(board, direction) {
    const moves = [];
    const size = board.length;
    const rowStep = direction === VERTICAL ? 1 : 0;
    const columnStep = direction === HORIZONTAL ? 1 : 0;
    for (let row = 0; row < size; row += 1) {
      for (let column = 0; column < size; column += 1) {
        const nextRow = row + rowStep;
        const nextColumn = column + columnStep;
        if (nextRow < size && nextColumn < size && !board[row][column] && !board[nextRow][nextColumn]) moves.push({ row, column });
      }
    }
    return moves;
  }

  function createGame(size = 4) {
    if (!Number.isInteger(size) || size < 2 || size > 8) throw new Error('말판 크기는 2에서 8 사이여야 합니다.');
    return { board: createBoard(size), turn: HORIZONTAL, status: '진행 중', winner: null, message: '가로 도미노를 놓아 시작하세요.' };
  }

  function placeDomino(game, row, column) {
    if (game.status !== '진행 중') throw new Error('이미 끝난 게임입니다.');
    const move = getLegalMoves(game.board, game.turn).find((item) => item.row === row && item.column === column);
    if (!move) throw new Error('그곳에는 도미노를 놓을 수 없습니다.');
    const board = game.board.map((line) => line.slice());
    const rowStep = game.turn === VERTICAL ? 1 : 0;
    const columnStep = game.turn === HORIZONTAL ? 1 : 0;
    board[row][column] = game.turn;
    board[row + rowStep][column + columnStep] = game.turn;
    const nextTurn = game.turn === HORIZONTAL ? VERTICAL : HORIZONTAL;
    if (getLegalMoves(board, nextTurn).length === 0) {
      return { ...game, board, status: '종료', winner: game.turn, message: `${game.turn} 도미노가 이겼습니다!` };
    }
    return { ...game, board, turn: nextTurn, message: `${nextTurn} 도미노 차례입니다.` };
  }

  return { HORIZONTAL, VERTICAL, createGame, getLegalMoves, placeDomino };
}));
