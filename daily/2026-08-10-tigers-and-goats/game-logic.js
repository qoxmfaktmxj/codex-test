(function defineBaghChal(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.BaghChal = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const GOAT = '염소';
  const TIGER = '호랑이';
  const DIRECTIONS = [-1, 0, 1];

  function row(spot) { return Math.floor(spot / 5); }
  function column(spot) { return spot % 5; }
  function inBoard(r, c) { return r >= 0 && r < 5 && c >= 0 && c < 5; }
  function other(player) { return player === GOAT ? TIGER : GOAT; }
  function adjacent(spot) {
    const result = [];
    DIRECTIONS.forEach((dy) => DIRECTIONS.forEach((dx) => {
      if (dx === 0 && dy === 0) return;
      const r = row(spot) + dy;
      const c = column(spot) + dx;
      if (inBoard(r, c)) result.push(r * 5 + c);
    }));
    return result.sort((a, b) => a - b);
  }
  function createGame() {
    const board = Array(25).fill(null);
    [0, 4, 20, 24].forEach((spot) => { board[spot] = TIGER; });
    return { board, goatsToPlace: 20, capturedGoats: 0, turn: GOAT, status: '진행 중', winner: null, message: '빈 교차점을 골라 염소를 놓으세요.' };
  }
  function getDestinations(game, from) {
    if (game.status !== '진행 중' || !Number.isInteger(from) || game.board[from] !== game.turn || (game.turn === GOAT && game.goatsToPlace > 0)) return [];
    const ordinary = adjacent(from).filter((spot) => game.board[spot] === null);
    if (game.turn !== TIGER) return ordinary;
    const jumps = [];
    DIRECTIONS.forEach((dy) => DIRECTIONS.forEach((dx) => {
      if (dx === 0 && dy === 0) return;
      const jumpedRow = row(from) + dy;
      const jumpedColumn = column(from) + dx;
      const destinationRow = row(from) + (dy * 2);
      const destinationColumn = column(from) + (dx * 2);
      if (!inBoard(destinationRow, destinationColumn)) return;
      const jumped = jumpedRow * 5 + jumpedColumn;
      const destination = destinationRow * 5 + destinationColumn;
      if (game.board[jumped] === GOAT && game.board[destination] === null) jumps.push(destination);
    }));
    return [...new Set([...ordinary, ...jumps])].sort((a, b) => a - b);
  }
  function hasMoves(game, player) {
    if (player === GOAT && game.goatsToPlace > 0) return game.board.some((piece) => piece === null);
    return game.board.some((piece, spot) => piece === player && getDestinations({ ...game, turn: player }, spot).length);
  }
  function finishOrNext(game) {
    if (game.capturedGoats >= 5) return { ...game, status: '종료', winner: TIGER, message: '호랑이가 염소 다섯 마리를 잡았습니다. 호랑이의 승리!' };
    const next = other(game.turn);
    if (!hasMoves(game, next)) return { ...game, status: '종료', winner: game.turn, message: `${game.turn}이(가) 상대를 움직일 수 없게 했습니다. ${game.turn}의 승리!` };
    return { ...game, turn: next, message: next === GOAT ? (game.goatsToPlace > 0 ? '빈 교차점을 골라 염소를 놓으세요.' : '염소 하나를 골라 인접한 빈자리로 움직이세요.') : '호랑이가 움직일 차례입니다.' };
  }
  function placeGoat(game, spot) {
    if (game.status !== '진행 중' || game.turn !== GOAT || game.goatsToPlace === 0 || !Number.isInteger(spot) || game.board[spot] !== null) throw new Error('염소를 놓을 수 없는 자리입니다.');
    const board = game.board.slice();
    board[spot] = GOAT;
    return finishOrNext({ ...game, board, goatsToPlace: game.goatsToPlace - 1 });
  }
  function movePiece(game, from, to) {
    if (game.status !== '진행 중' || !getDestinations(game, from).includes(to)) throw new Error('그렇게 움직일 수 없습니다.');
    const board = game.board.slice();
    const isJump = Math.abs(row(from) - row(to)) === 2 || Math.abs(column(from) - column(to)) === 2;
    board[from] = null;
    board[to] = game.turn;
    let capturedGoats = game.capturedGoats;
    if (game.turn === TIGER && isJump) {
      const jumped = ((row(from) + row(to)) / 2) * 5 + ((column(from) + column(to)) / 2);
      board[jumped] = null;
      capturedGoats += 1;
    }
    return finishOrNext({ ...game, board, capturedGoats });
  }
  return { GOAT, TIGER, createGame, getDestinations, placeGoat, movePiece };
}));
