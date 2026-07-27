(function defineMiniLudo(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.MiniLudo = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const PLAYERS = ['빨강', '파랑'];
  const BOARD_SIZE = 20;
  const FINISH = 20;
  const STARTS = {
    빨강: 0,
    파랑: 10,
  };

  function otherPlayer(player) {
    return player === PLAYERS[0] ? PLAYERS[1] : PLAYERS[0];
  }

  function normalizePieces(pieces, piecesPerPlayer) {
    if (!Array.isArray(pieces) || pieces.length !== piecesPerPlayer) {
      throw new Error('말 개수가 맞지 않습니다.');
    }
    pieces.forEach((piece) => {
      if (!Number.isInteger(piece) || piece < -1 || piece > FINISH) {
        throw new Error('말 위치가 올바르지 않습니다.');
      }
    });
    return pieces.slice();
  }

  function normalizePlayers(players, piecesPerPlayer) {
    const normalized = {};
    PLAYERS.forEach((player) => {
      const pieces = players && players[player]
        ? players[player].pieces
        : Array(piecesPerPlayer).fill(-1);
      normalized[player] = {
        pieces: normalizePieces(pieces, piecesPerPlayer),
      };
    });
    return normalized;
  }

  function cloneGame(game, overrides = {}) {
    return {
      players: {
        빨강: { pieces: game.players.빨강.pieces.slice() },
        파랑: { pieces: game.players.파랑.pieces.slice() },
      },
      currentPlayer: game.currentPlayer,
      roll: game.roll,
      status: game.status,
      winner: game.winner || null,
      message: game.message,
      ...overrides,
    };
  }

  function getAbsolutePosition(player, progress) {
    if (progress < 0 || progress >= FINISH) {
      return null;
    }
    return (STARTS[player] + progress) % BOARD_SIZE;
  }

  function hasOwnPieceAt(game, player, absolutePosition) {
    return game.players[player].pieces.some((piece) => (
      getAbsolutePosition(player, piece) === absolutePosition
    ));
  }

  function canMovePiece(game, pieceIndex) {
    if (game.status !== '진행 중' || game.roll === null) {
      return false;
    }
    const player = game.currentPlayer;
    const piece = game.players[player].pieces[pieceIndex];
    if (piece === undefined || piece === FINISH) {
      return false;
    }
    if (piece === -1) {
      return game.roll === 6 && !hasOwnPieceAt(game, player, STARTS[player]);
    }
    const target = piece + game.roll;
    if (target > FINISH) {
      return false;
    }
    if (target === FINISH) {
      return true;
    }
    return !hasOwnPieceAt(game, player, getAbsolutePosition(player, target));
  }

  function getLegalMoves(game) {
    return game.players[game.currentPlayer].pieces
      .map((_, index) => index)
      .filter((index) => canMovePiece(game, index));
  }

  function createGame(options = {}) {
    const piecesPerPlayer = options.piecesPerPlayer
      || (options.players && options.players.빨강 && options.players.빨강.pieces.length)
      || 3;
    const currentPlayer = options.currentPlayer || PLAYERS[0];
    if (!PLAYERS.includes(currentPlayer)) {
      throw new Error('차례가 올바르지 않습니다.');
    }
    const roll = options.roll === undefined ? null : options.roll;
    if (roll !== null && (!Number.isInteger(roll) || roll < 1 || roll > 6)) {
      throw new Error('주사위는 1부터 6까지입니다.');
    }
    return {
      players: normalizePlayers(options.players, piecesPerPlayer),
      currentPlayer,
      roll,
      status: options.status || '진행 중',
      winner: options.winner || null,
      message: options.message || '주사위를 굴려 말을 출발시키세요. 6이 나오면 한 번 더 합니다.',
    };
  }

  function rollDie(game, random = Math.random) {
    if (game.status !== '진행 중') {
      throw new Error('이미 끝난 판입니다.');
    }
    if (game.roll !== null) {
      throw new Error('먼저 움직일 말을 선택하세요.');
    }
    const roll = Math.floor(random() * 6) + 1;
    const rolled = cloneGame(game, {
      roll,
      message: `${game.currentPlayer} 차례: ${roll}이 나왔습니다. 움직일 말을 고르세요.`,
    });
    if (getLegalMoves(rolled).length > 0) {
      return rolled;
    }
    return cloneGame(rolled, {
      currentPlayer: otherPlayer(game.currentPlayer),
      roll: null,
      message: `${game.currentPlayer}은 ${roll}이 나왔지만 움직일 말이 없습니다. 차례가 넘어갑니다.`,
    });
  }

  function captureOpponents(game, player, absolutePosition) {
    const opponent = otherPlayer(player);
    let captures = 0;
    const pieces = game.players[opponent].pieces.map((piece) => {
      if (getAbsolutePosition(opponent, piece) === absolutePosition) {
        captures += 1;
        return -1;
      }
      return piece;
    });
    return { captures, pieces };
  }

  function movePiece(game, pieceIndex) {
    if (!canMovePiece(game, pieceIndex)) {
      throw new Error('선택한 말은 움직일 수 없습니다.');
    }
    const player = game.currentPlayer;
    const next = cloneGame(game);
    const pieces = next.players[player].pieces;
    const previous = pieces[pieceIndex];
    const target = previous === -1 ? 0 : previous + game.roll;
    pieces[pieceIndex] = target;

    let captures = 0;
    if (target < FINISH) {
      const captured = captureOpponents(next, player, getAbsolutePosition(player, target));
      captures = captured.captures;
      next.players[otherPlayer(player)].pieces = captured.pieces;
    }

    if (pieces.every((piece) => piece === FINISH)) {
      return cloneGame(next, {
        roll: null,
        status: '승리',
        winner: player,
        message: `${player}이 모든 말을 도착시켜 승리했습니다.`,
      });
    }

    const extraTurn = game.roll === 6;
    const action = target === FINISH ? '말이 도착했습니다.' : '말을 움직였습니다.';
    const captureText = captures > 0 ? ` 상대 말 ${captures}개를 잡았습니다.` : '';
    return cloneGame(next, {
      currentPlayer: extraTurn ? player : otherPlayer(player),
      roll: null,
      message: `${player}이 ${action}${captureText} ${extraTurn ? '6이 나와 한 번 더 굴립니다.' : '차례가 넘어갑니다.'}`,
    });
  }

  return {
    BOARD_SIZE,
    FINISH,
    PLAYERS,
    STARTS,
    createGame,
    getAbsolutePosition,
    getLegalMoves,
    movePiece,
    rollDie,
  };
}));
