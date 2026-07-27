(function defineGameOfGoose(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.GameOfGoose = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const FINISH = 32;
  const DEFAULT_MESSAGE = '주사위를 굴려 32번 칸에 정확히 도착하세요.';
  const GOOSE_SQUARES = Object.freeze([5, 9, 14, 18, 23, 27]);
  const SPECIAL_SQUARES = Object.freeze({
    6: { type: 'bridge', target: 12, label: '다리' },
    24: { type: 'maze', target: 15, label: '미로' },
    25: { type: 'prison', wait: 1, label: '감옥' },
  });

  function clonePlayers(players) {
    return players.map((player) => ({ ...player }));
  }

  function cloneGame(game, overrides = {}) {
    return {
      players: clonePlayers(game.players),
      currentPlayer: game.currentPlayer,
      turns: game.turns,
      status: game.status,
      message: game.message,
      lastRoll: game.lastRoll ? { dice: game.lastRoll.dice.slice(), total: game.lastRoll.total } : null,
      ...overrides,
    };
  }

  function createGame(overrides = {}) {
    const game = {
      players: [
        { name: '나', position: 0, waiting: 0 },
        { name: '컴퓨터', position: 0, waiting: 0 },
      ],
      currentPlayer: 0,
      turns: 0,
      status: '진행 중',
      message: DEFAULT_MESSAGE,
      lastRoll: null,
      ...overrides,
    };

    return cloneGame(game);
  }

  function rollDice(random = Math.random) {
    const first = Math.floor(random() * 4) + 1;
    const second = Math.floor(random() * 4) + 1;
    return {
      dice: [first, second],
      total: first + second,
    };
  }

  function getNextPlayer(currentPlayer) {
    return currentPlayer === 0 ? 1 : 0;
  }

  function bouncePosition(position) {
    if (position <= FINISH) {
      return position;
    }

    return FINISH - (position - FINISH);
  }

  function applyLanding(position, total) {
    if (position === FINISH) {
      return {
        position,
        waiting: 0,
        note: `32번 칸에 정확히 도착했습니다. 승리!`,
        won: true,
      };
    }

    const special = SPECIAL_SQUARES[position];
    if (special?.type === 'bridge') {
      return {
        position: special.target,
        waiting: 0,
        note: `다리를 건너 ${special.target}번 칸으로 이동했습니다.`,
        won: false,
      };
    }

    if (special?.type === 'maze') {
      return {
        position: special.target,
        waiting: 0,
        note: `미로에서 길을 잃어 ${special.target}번 칸으로 돌아갔습니다.`,
        won: false,
      };
    }

    if (special?.type === 'prison') {
      return {
        position,
        waiting: special.wait,
        note: '감옥에서 한 턴 쉬어야 합니다.',
        won: false,
      };
    }

    if (GOOSE_SQUARES.includes(position)) {
      const boosted = bouncePosition(position + total);
      return {
        position: boosted,
        waiting: 0,
        note: `거위 칸 보너스로 ${total}칸 더 전진했습니다.`,
        won: boosted === FINISH,
      };
    }

    return {
      position,
      waiting: 0,
      note: `${position}번 칸에 도착했습니다.`,
      won: false,
    };
  }

  function normalizeDice(dice) {
    if (!Array.isArray(dice) || dice.length !== 2) {
      throw new Error('주사위는 두 개여야 합니다.');
    }

    const normalized = dice.map((value) => {
      if (!Number.isInteger(value) || value < 1 || value > 4) {
        throw new Error('주사위 눈은 1부터 4까지입니다.');
      }
      return value;
    });

    return {
      dice: normalized,
      total: normalized[0] + normalized[1],
    };
  }

  function playTurn(game, dice = null) {
    if (game.status !== '진행 중') {
      return cloneGame(game);
    }

    const next = cloneGame(game);
    const player = next.players[next.currentPlayer];

    if (player.waiting > 0) {
      player.waiting -= 1;
      return cloneGame(next, {
        currentPlayer: getNextPlayer(next.currentPlayer),
        turns: next.turns + 1,
        message: `${player.name}는 쉬는 턴입니다.`,
      });
    }

    const roll = dice ? normalizeDice(dice) : rollDice();
    const moved = bouncePosition(player.position + roll.total);
    const landing = applyLanding(moved, roll.total);
    player.position = landing.position;
    player.waiting = landing.waiting;

    const message = `${player.name}: ${roll.total}칸 이동, ${landing.note}`;
    return cloneGame(next, {
      currentPlayer: landing.won ? next.currentPlayer : getNextPlayer(next.currentPlayer),
      turns: next.turns + 1,
      status: landing.won ? '승리' : '진행 중',
      message,
      lastRoll: roll,
    });
  }

  return {
    FINISH,
    GOOSE_SQUARES,
    SPECIAL_SQUARES,
    createGame,
    rollDice,
    playTurn,
    bouncePosition,
  };
}));
