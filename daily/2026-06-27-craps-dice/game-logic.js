(function defineCrapsDice(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CrapsDice = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const COME_OUT = 'come-out';
  const POINT = 'point';
  const FINISHED = 'finished';

  function cloneGame(game, overrides) {
    return {
      phase: game.phase,
      point: game.point,
      status: game.status,
      message: game.message,
      rolls: game.rolls.map((roll) => ({
        dice: [...roll.dice],
        total: roll.total,
        label: roll.label,
      })),
      ...overrides,
    };
  }

  function createGame() {
    return {
      phase: COME_OUT,
      point: null,
      status: '진행 중',
      message: '첫 굴림에서 7이나 11이 나오면 승리합니다.',
      rolls: [],
    };
  }

  function validateDice(dice) {
    if (
      !Array.isArray(dice) ||
      dice.length !== 2 ||
      dice.some((value) => !Number.isInteger(value) || value < 1 || value > 6)
    ) {
      throw new Error('주사위 값은 1부터 6까지의 정수 두 개여야 합니다.');
    }
  }

  function randomDice() {
    return [
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
    ];
  }

  function appendRoll(game, dice) {
    const total = dice[0] + dice[1];
    return game.rolls.concat({
      dice: [...dice],
      total,
      label: game.phase === COME_OUT ? '첫 굴림' : '포인트 굴림',
    });
  }

  function resolveComeOut(game, dice) {
    const total = dice[0] + dice[1];
    const rolls = appendRoll(game, dice);

    if (total === 7 || total === 11) {
      return cloneGame(game, {
        phase: FINISHED,
        status: '승리',
        message: `합계 ${total}입니다. 첫 굴림 승리!`,
        rolls,
      });
    }

    if (total === 2 || total === 3 || total === 12) {
      return cloneGame(game, {
        phase: FINISHED,
        status: '패배',
        message: `합계 ${total}입니다. 크랩스로 패배했습니다.`,
        rolls,
      });
    }

    return cloneGame(game, {
      phase: POINT,
      point: total,
      message: `포인트는 ${total}입니다. 7이 나오기 전에 ${total}을 다시 만드세요.`,
      rolls,
    });
  }

  function resolvePoint(game, dice) {
    const total = dice[0] + dice[1];
    const rolls = appendRoll(game, dice);

    if (total === game.point) {
      return cloneGame(game, {
        phase: FINISHED,
        status: '승리',
        message: `포인트 ${game.point}을 다시 만들었습니다. 승리!`,
        rolls,
      });
    }

    if (total === 7) {
      return cloneGame(game, {
        phase: FINISHED,
        status: '패배',
        message: '7이 나왔습니다. 포인트 전에 7이 나와 패배했습니다.',
        rolls,
      });
    }

    return cloneGame(game, {
      message: `합계 ${total}입니다. 포인트 ${game.point}을 계속 노리세요.`,
      rolls,
    });
  }

  function rollDice(game, dice = randomDice()) {
    validateDice(dice);

    if (game.phase === FINISHED) {
      return cloneGame(game, { message: '게임이 끝났습니다. 새 판을 시작하세요.' });
    }

    if (game.phase === COME_OUT) {
      return resolveComeOut(game, dice);
    }

    return resolvePoint(game, dice);
  }

  return {
    COME_OUT,
    POINT,
    FINISHED,
    createGame,
    rollDice,
    randomDice,
  };
}));
