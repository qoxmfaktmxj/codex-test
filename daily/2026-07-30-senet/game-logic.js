(function defineSenet(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.Senet = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const TRACK_SIZE = 12;
  const PLAYER = '나';
  const COMPUTER = '상대';
  const EMPTY = null;

  function cloneBoard(board) {
    return board.slice();
  }

  function other(player) {
    return player === PLAYER ? COMPUTER : PLAYER;
  }

  function openingBoard() {
    return [PLAYER, COMPUTER, PLAYER, COMPUTER, PLAYER, COMPUTER, ...Array(TRACK_SIZE - 6).fill(EMPTY)];
  }

  function isProtected(board, index) {
    const piece = board[index];
    return piece !== EMPTY && [index - 1, index + 1].some((neighbor) => board[neighbor] === piece);
  }

  function validateBoard(board) {
    if (!Array.isArray(board) || board.length !== TRACK_SIZE || board.some((piece) => piece !== PLAYER && piece !== COMPUTER && piece !== EMPTY)) {
      throw new Error('말판 정보가 올바르지 않습니다.');
    }
  }

  function gameMessage(game) {
    if (game.status === '승리') return '내 모든 말을 말판 밖으로 보냈습니다. 승리!';
    if (game.status === '패배') return '상대 말이 모두 말판을 떠났습니다. 다음 판에 다시 도전하세요.';
    return `${game.turn} 차례입니다. 막대 ${game.roll}칸을 사용해 말을 움직이세요.`;
  }

  function buildGame(board, turn, home, roll) {
    let status = '진행 중';
    if (home.player >= 3) status = '승리';
    if (home.computer >= 3) status = '패배';
    const game = { board, turn, home, roll, status };
    return { ...game, message: gameMessage(game) };
  }

  function createGame(options = {}) {
    const board = options.board ? cloneBoard(options.board) : openingBoard();
    validateBoard(board);
    const turn = options.turn || PLAYER;
    if (turn !== PLAYER && turn !== COMPUTER) throw new Error('차례 정보가 올바르지 않습니다.');
    const home = { player: 0, computer: 0, ...(options.home || {}) };
    if (!Number.isInteger(home.player) || !Number.isInteger(home.computer) || home.player < 0 || home.computer < 0) {
      throw new Error('나간 말 정보가 올바르지 않습니다.');
    }
    const roll = options.roll || 1;
    if (!Number.isInteger(roll) || roll < 1 || roll > 5) throw new Error('막대 수는 1부터 5까지여야 합니다.');
    return buildGame(board, turn, home, roll);
  }

  function availableMoves(game, roll = game.roll) {
    if (game.status !== '진행 중') return [];
    if (!Number.isInteger(roll) || roll < 1 || roll > 5) return [];
    const moves = [];
    game.board.forEach((piece, from) => {
      if (piece !== game.turn) return;
      const to = from + roll;
      if (to > TRACK_SIZE) return;
      if (to === TRACK_SIZE) {
        moves.push({ from, to });
      } else if (game.board[to] === EMPTY || (game.board[to] === other(game.turn) && !isProtected(game.board, to))) {
        moves.push({ from, to });
      }
    });
    return moves;
  }

  function moveToken(game, from, roll = game.roll) {
    if (game.status !== '진행 중') throw new Error('이미 끝난 게임입니다.');
    if (!Number.isInteger(from) || from < 0 || from >= TRACK_SIZE) throw new Error('시작 칸이 올바르지 않습니다.');
    if (!Number.isInteger(roll) || roll < 1 || roll > 5) throw new Error('막대 수는 1부터 5까지여야 합니다.');
    if (game.board[from] !== game.turn) throw new Error('내 차례의 말을 선택하세요.');
    const to = from + roll;
    if (to > TRACK_SIZE) throw new Error('정확한 수로만 말판을 나갈 수 있습니다.');
    if (to < TRACK_SIZE && game.board[to] === game.turn) throw new Error('내 말이 있는 칸으로는 갈 수 없습니다.');
    if (to < TRACK_SIZE && game.board[to] === other(game.turn) && isProtected(game.board, to)) {
      throw new Error('이웃한 상대 말은 보호되어 잡을 수 없습니다.');
    }

    const board = cloneBoard(game.board);
    const home = { ...game.home };
    board[from] = EMPTY;
    if (to === TRACK_SIZE) {
      home[game.turn === PLAYER ? 'player' : 'computer'] += 1;
    } else if (board[to] === other(game.turn)) {
      board[from] = board[to];
      board[to] = game.turn;
    } else {
      board[to] = game.turn;
    }
    const keepsTurn = roll === 4 || roll === 5;
    const next = buildGame(board, keepsTurn ? game.turn : other(game.turn), home, roll);
    if (next.status === '진행 중' && keepsTurn) {
      return { ...next, message: `${game.turn}이 ${roll}을 던져 한 번 더 움직입니다.` };
    }
    return next;
  }

  function chooseComputerMove(game, roll) {
    const moves = availableMoves({ ...game, roll }, roll);
    return moves.sort((first, second) => second.to - first.to)[0] || null;
  }

  return { TRACK_SIZE, PLAYER, COMPUTER, EMPTY, createGame, availableMoves, moveToken, chooseComputerMove };
}));
