const STATUS = {
  PLAYING: 'playing',
  WON: 'won',
};

function clonePegs(pegs) {
  return pegs.map((peg) => [...peg]);
}

function minimumMoves(diskCount) {
  return 2 ** diskCount - 1;
}

function createGame(diskCount = 3) {
  const count = Number.isInteger(diskCount) && diskCount >= 3 && diskCount <= 5 ? diskCount : 3;
  return {
    diskCount: count,
    pegs: [Array.from({ length: count }, (_, index) => count - index), [], []],
    moves: 0,
    status: STATUS.PLAYING,
    selectedPeg: null,
    message: '작은 원반 위에 큰 원반을 올리지 않도록 모두 오른쪽 기둥으로 옮기세요.',
  };
}

function topDisk(peg) {
  return peg.length === 0 ? null : peg[peg.length - 1];
}

function assertPegIndex(index) {
  if (!Number.isInteger(index) || index < 0 || index > 2) {
    throw new Error('기둥 번호가 올바르지 않습니다.');
  }
}

function canMove(game, from, to) {
  assertPegIndex(from);
  assertPegIndex(to);
  if (game.status !== STATUS.PLAYING || from === to) return false;

  const sourceTop = topDisk(game.pegs[from]);
  if (sourceTop === null) return false;

  const targetTop = topDisk(game.pegs[to]);
  return targetTop === null || sourceTop < targetTop;
}

function moveDisk(game, from, to) {
  if (!canMove(game, from, to)) {
    const sourceTop = topDisk(game.pegs[from]);
    const targetTop = topDisk(game.pegs[to]);
    if (sourceTop !== null && targetTop !== null && sourceTop > targetTop) {
      throw new Error('큰 원반은 작은 원반 위에 올릴 수 없습니다.');
    }
    throw new Error('그 기둥으로는 옮길 수 없습니다.');
  }

  const pegs = clonePegs(game.pegs);
  const disk = pegs[from].pop();
  pegs[to].push(disk);

  const next = {
    ...game,
    pegs,
    moves: game.moves + 1,
    selectedPeg: null,
    message: `${disk}번 원반을 ${to + 1}번 기둥으로 옮겼습니다.`,
  };

  if (isSolved(next)) {
    next.status = STATUS.WON;
    next.message = `성공! ${next.moves}번 만에 모든 원반을 옮겼습니다.`;
  }

  return next;
}

function availableMoves(game) {
  const moves = [];
  for (let from = 0; from < 3; from += 1) {
    for (let to = 0; to < 3; to += 1) {
      if (canMove(game, from, to)) moves.push({ from, to });
    }
  }
  return moves;
}

function isSolved(game) {
  return game.pegs[2].length === game.diskCount
    && game.pegs[2].every((disk, index) => disk === game.diskCount - index);
}

function moveCountText(game) {
  return `이동 ${game.moves}회 · 최소 ${minimumMoves(game.diskCount)}회`;
}

function statusText(game) {
  return game.status === STATUS.WON ? '완성' : '진행 중';
}

const api = {
  STATUS,
  createGame,
  topDisk,
  canMove,
  moveDisk,
  availableMoves,
  isSolved,
  minimumMoves,
  moveCountText,
  statusText,
};

if (typeof module !== 'undefined' && module.exports) module.exports = api;
if (typeof window !== 'undefined') window.HanoiLogic = api;
