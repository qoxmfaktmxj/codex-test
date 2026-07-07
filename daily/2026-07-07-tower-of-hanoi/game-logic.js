(function defineTowerOfHanoi(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.TowerOfHanoi = factory();
  }
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const MIN_DISKS = 2;
  const MAX_DISKS = 6;
  const DEFAULT_DISKS = 4;
  const DEFAULT_MESSAGE = '옮길 원반이 있는 기둥을 고르세요.';

  function clonePegs(pegs) {
    return pegs.map((peg) => peg.slice());
  }

  function cloneGame(game, overrides = {}) {
    return {
      diskCount: game.diskCount,
      pegs: clonePegs(game.pegs),
      moves: game.moves,
      status: game.status,
      selectedPeg: game.selectedPeg,
      message: game.message,
      ...overrides,
    };
  }

  function validateDiskCount(diskCount) {
    if (!Number.isInteger(diskCount) || diskCount < MIN_DISKS || diskCount > MAX_DISKS) {
      throw new Error('원반은 2개부터 6개까지 사용할 수 있습니다.');
    }
  }

  function validatePegIndex(pegIndex) {
    if (!Number.isInteger(pegIndex) || pegIndex < 0 || pegIndex > 2) {
      throw new Error('기둥 번호가 올바르지 않습니다.');
    }
  }

  function createGame(diskCount = DEFAULT_DISKS) {
    validateDiskCount(diskCount);
    const firstPeg = [];
    for (let disk = diskCount; disk >= 1; disk -= 1) {
      firstPeg.push(disk);
    }

    return {
      diskCount,
      pegs: [firstPeg, [], []],
      moves: 0,
      status: '진행 중',
      selectedPeg: null,
      message: DEFAULT_MESSAGE,
    };
  }

  function getTopDisk(peg) {
    return peg[peg.length - 1] || null;
  }

  function canMove(game, fromPegIndex, toPegIndex) {
    validatePegIndex(fromPegIndex);
    validatePegIndex(toPegIndex);
    if (fromPegIndex === toPegIndex || game.status !== '진행 중') {
      return false;
    }

    const fromDisk = getTopDisk(game.pegs[fromPegIndex]);
    const toDisk = getTopDisk(game.pegs[toPegIndex]);
    return Boolean(fromDisk) && (!toDisk || fromDisk < toDisk);
  }

  function isWon(pegs, diskCount) {
    return pegs[2].length === diskCount && pegs[0].length === 0 && pegs[1].length === 0;
  }

  function selectPeg(game, pegIndex) {
    validatePegIndex(pegIndex);
    if (game.status !== '진행 중') {
      return cloneGame(game);
    }

    if (game.selectedPeg === pegIndex) {
      return cloneGame(game, {
        selectedPeg: null,
        message: DEFAULT_MESSAGE,
      });
    }

    if (game.pegs[pegIndex].length === 0) {
      return cloneGame(game, {
        message: '빈 기둥에서는 원반을 고를 수 없습니다.',
      });
    }

    return cloneGame(game, {
      selectedPeg: pegIndex,
      message: `${pegIndex + 1}번 기둥의 원반을 선택했습니다. 놓을 기둥을 고르세요.`,
    });
  }

  function moveDisk(game, toPegIndex) {
    validatePegIndex(toPegIndex);
    if (game.status !== '진행 중' || game.selectedPeg === null) {
      return cloneGame(game);
    }

    const fromPegIndex = game.selectedPeg;
    if (fromPegIndex === toPegIndex) {
      return selectPeg(game, toPegIndex);
    }

    if (!canMove(game, fromPegIndex, toPegIndex)) {
      return cloneGame(game, {
        message: '큰 원반은 작은 원반 위에 놓을 수 없습니다.',
      });
    }

    const pegs = clonePegs(game.pegs);
    const disk = pegs[fromPegIndex].pop();
    pegs[toPegIndex].push(disk);
    const moves = game.moves + 1;
    const won = isWon(pegs, game.diskCount);

    return cloneGame(game, {
      pegs,
      moves,
      selectedPeg: null,
      status: won ? '승리' : '진행 중',
      message: won
        ? `성공입니다. ${moves}번 만에 모든 원반을 옮겼습니다.`
        : '원반을 옮겼습니다. 다음 원반을 고르세요.',
    });
  }

  return {
    MIN_DISKS,
    MAX_DISKS,
    DEFAULT_DISKS,
    createGame,
    selectPeg,
    moveDisk,
    canMove,
  };
}));
