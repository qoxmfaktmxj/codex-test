function createGame(size = 4) {
  const count = Number.isInteger(size) && size >= 3 && size <= 5 ? size : 4;
  return {
    rods: [Array.from({ length: count }, (_, index) => count - index), [], []],
    moves: 0,
    status: 'playing',
    message: '책 한 권을 골라 다른 서가로 옮기세요.',
  };
}

function topDisk(game, rodIndex) {
  const rod = game.rods[rodIndex];
  return rod && rod.length ? rod[rod.length - 1] : null;
}

function isSolved(game) {
  return game.rods[2].length === game.rods[0].length + game.rods[1].length + game.rods[2].length;
}

function moveDisk(game, from, to) {
  if (game.status === 'won' || isSolved(game)) {
    return { ...game, status: 'won', message: '서가 정리가 끝났습니다. 훌륭해요!' };
  }
  if (![0, 1, 2].includes(from) || ![0, 1, 2].includes(to) || from === to || !topDisk(game, from)) {
    return { ...game, message: '옮길 책과 서가를 다시 골라주세요.' };
  }
  const disk = topDisk(game, from);
  const destination = topDisk(game, to);
  if (destination !== null && disk > destination) {
    return { ...game, message: '작은 책 위에는 더 큰 책을 올릴 수 없어요.' };
  }
  const rods = game.rods.map((rod) => rod.slice());
  rods[from].pop();
  rods[to].push(disk);
  const next = { ...game, rods, moves: game.moves + 1, message: '책을 조심스럽게 옮겼습니다.' };
  return isSolved(next)
    ? { ...next, status: 'won', message: `${next.moves}번 만에 서가 정리가 끝났습니다!` }
    : next;
}

const gameLogic = { createGame, moveDisk, topDisk, isSolved };
if (typeof module !== 'undefined') module.exports = gameLogic;
if (typeof window !== 'undefined') window.gameLogic = gameLogic;
