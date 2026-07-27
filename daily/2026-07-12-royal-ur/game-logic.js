(function defineRoyalUr(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.RoyalUr = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const PLAYER = 'X';
  const COMPUTER = 'O';
  const HOME = -1;
  const FINISH = 14;
  const STATUS_PLAYING = '진행 중';
  const STATUS_WIN = '승리';
  const STATUS_LOSS = '패배';
  const ROSETTES = [3, 7, 13];
  const DEFAULT_MESSAGE = '주사위를 굴려 말을 전진하세요.';

  function clonePieces(pieces) {
    return {
      [PLAYER]: pieces[PLAYER].slice(),
      [COMPUTER]: pieces[COMPUTER].slice(),
    };
  }

  function cloneGame(game, overrides = {}) {
    const next = {
      pieces: clonePieces(game.pieces),
      turn: game.turn,
      dice: game.dice,
      rolls: game.rolls ? game.rolls.slice() : [],
      status: game.status,
      message: game.message,
      lastMove: game.lastMove ? { ...game.lastMove } : null,
      ...overrides,
    };

    if (overrides.pieces) {
      next.pieces = clonePieces(overrides.pieces);
    }
    if (overrides.rolls) {
      next.rolls = overrides.rolls.slice();
    }
    if (overrides.lastMove) {
      next.lastMove = { ...overrides.lastMove };
    }

    return next;
  }

  function createGame(overrides = {}) {
    const base = {
      pieces: {
        [PLAYER]: Array(5).fill(HOME),
        [COMPUTER]: Array(5).fill(HOME),
      },
      turn: PLAYER,
      dice: null,
      rolls: [],
      status: STATUS_PLAYING,
      message: DEFAULT_MESSAGE,
      lastMove: null,
    };

    return cloneGame({
      ...base,
      ...overrides,
      pieces: overrides.pieces || base.pieces,
      rolls: overrides.rolls || base.rolls,
    });
  }

  function getOpponent(piece) {
    return piece === PLAYER ? COMPUTER : PLAYER;
  }

  function isRosette(position) {
    return ROSETTES.includes(position);
  }

  function isShared(position) {
    return position >= 4 && position <= 11;
  }

  function isFinished(position) {
    return position === FINISH;
  }

  function getPieceLabel(piece) {
    return piece === PLAYER ? '내' : '컴퓨터';
  }

  function rollDice(random = Math.random) {
    const rolls = Array.from({ length: 4 }, () => (random() < 0.5 ? 0 : 1));
    return {
      dice: rolls.reduce((sum, value) => sum + value, 0),
      rolls,
    };
  }

  function getTarget(position, dice) {
    if (dice === null || dice <= 0 || isFinished(position)) {
      return null;
    }

    const target = position === HOME ? dice - 1 : position + dice;
    return target <= FINISH ? target : null;
  }

  function findPieceAt(game, piece, position) {
    return game.pieces[piece].findIndex((piecePosition) => piecePosition === position);
  }

  function canCaptureAt(game, piece, target) {
    const opponent = getOpponent(piece);
    return isShared(target) && !isRosette(target) && findPieceAt(game, opponent, target) !== -1;
  }

  function buildMove(game, piece, pieceIndex) {
    const from = game.pieces[piece][pieceIndex];
    const to = getTarget(from, game.dice);

    if (to === null) {
      return null;
    }
    if (!isFinished(to) && findPieceAt(game, piece, to) !== -1) {
      return null;
    }
    if (isShared(to) && isRosette(to) && findPieceAt(game, getOpponent(piece), to) !== -1) {
      return null;
    }

    return {
      piece: pieceIndex,
      from,
      to,
      capture: canCaptureAt(game, piece, to),
      score: isFinished(to),
      rosette: isRosette(to),
    };
  }

  function getLegalMoves(game, piece = game.turn) {
    if (game.status !== STATUS_PLAYING || game.dice === null || game.dice === 0) {
      return [];
    }

    return game.pieces[piece]
      .map((_, pieceIndex) => buildMove(game, piece, pieceIndex))
      .filter(Boolean);
  }

  function getRollMessage(game, dice) {
    if (dice === 0) {
      return '눈이 나오지 않아 차례가 넘어갑니다.';
    }

    const moves = getLegalMoves({ ...game, dice });
    if (moves.length === 0) {
      return `${dice}칸이 나왔지만 움직일 말이 없습니다.`;
    }

    return game.turn === PLAYER
      ? `${dice}칸이 나왔습니다. 움직일 말을 고르세요.`
      : `컴퓨터가 ${dice}칸을 움직입니다.`;
  }

  function rollTurn(game, random = Math.random) {
    if (game.status !== STATUS_PLAYING) {
      return cloneGame(game);
    }
    if (game.dice !== null) {
      throw new Error('이미 주사위를 굴렸습니다.');
    }

    const rolled = rollDice(random);
    const rolledGame = cloneGame(game, {
      dice: rolled.dice,
      rolls: rolled.rolls,
      message: getRollMessage(game, rolled.dice),
      lastMove: null,
    });

    if (rolled.dice === 0 || getLegalMoves(rolledGame).length === 0) {
      return cloneGame(rolledGame, {
        turn: getOpponent(game.turn),
        dice: null,
        message: `${rolledGame.message} ${getPieceLabel(getOpponent(game.turn))} 차례입니다.`,
      });
    }

    return rolledGame;
  }

  function movePiece(game, pieceIndex) {
    if (game.status !== STATUS_PLAYING) {
      return cloneGame(game);
    }
    if (!Number.isInteger(pieceIndex) || pieceIndex < 0 || pieceIndex >= game.pieces[game.turn].length) {
      throw new Error('올바른 말을 골라야 합니다.');
    }

    const move = buildMove(game, game.turn, pieceIndex);
    if (!move) {
      throw new Error('그 말은 이번 눈으로 움직일 수 없습니다.');
    }

    const pieces = clonePieces(game.pieces);
    const opponent = getOpponent(game.turn);
    let capture = false;

    if (move.capture) {
      const capturedIndex = findPieceAt(game, opponent, move.to);
      pieces[opponent][capturedIndex] = HOME;
      capture = true;
    }

    pieces[game.turn][pieceIndex] = move.to;

    if (pieces[game.turn].every(isFinished)) {
      return cloneGame(game, {
        pieces,
        dice: null,
        status: game.turn === PLAYER ? STATUS_WIN : STATUS_LOSS,
        message: game.turn === PLAYER
          ? '모든 말을 먼저 도착시켰습니다. 승리!'
          : '컴퓨터가 모든 말을 먼저 도착시켰습니다. 패배.',
        lastMove: { ...move, capture },
      });
    }

    if (move.rosette) {
      return cloneGame(game, {
        pieces,
        dice: null,
        message: '꽃무늬 칸에 도착해 한 번 더 굴립니다.',
        lastMove: { ...move, capture },
      });
    }

    return cloneGame(game, {
      pieces,
      turn: opponent,
      dice: null,
      message: capture
        ? `상대 말을 잡았습니다. ${getPieceLabel(opponent)} 차례입니다.`
        : `${getPieceLabel(opponent)} 차례입니다.`,
      lastMove: { ...move, capture },
    });
  }

  function rateMove(move) {
    return (move.score ? 100 : 0)
      + (move.capture ? 40 : 0)
      + (move.rosette ? 25 : 0)
      + move.to;
  }

  function chooseComputerMove(game) {
    const moves = getLegalMoves(game, COMPUTER);
    if (moves.length === 0) {
      return null;
    }

    return moves.slice().sort((a, b) => rateMove(b) - rateMove(a))[0];
  }

  function playComputerTurn(game, random = Math.random) {
    if (game.status !== STATUS_PLAYING || game.turn !== COMPUTER) {
      return cloneGame(game);
    }

    const ready = game.dice === null ? rollTurn(game, random) : cloneGame(game);
    if (ready.turn !== COMPUTER || ready.status !== STATUS_PLAYING) {
      return ready;
    }

    const move = chooseComputerMove(ready);
    if (!move) {
      return cloneGame(ready, {
        turn: PLAYER,
        dice: null,
        message: '컴퓨터가 움직일 수 없어 내 차례입니다.',
      });
    }

    return movePiece(ready, move.piece);
  }

  return {
    PLAYER,
    COMPUTER,
    HOME,
    FINISH,
    ROSETTES,
    createGame,
    rollDice,
    rollTurn,
    getLegalMoves,
    movePiece,
    chooseComputerMove,
    playComputerTurn,
    isRosette,
    isShared,
  };
}));
