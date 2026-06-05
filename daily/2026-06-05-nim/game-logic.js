const ACTORS = {
  PLAYER: 'player',
  COMPUTER: 'computer',
};

const STATUS = {
  PLAYING: 'playing',
  WON: 'won',
  LOST: 'lost',
};

function cloneHistory(history) {
  return history.map((entry) => ({ ...entry }));
}

function actorSubject(actor) {
  return actor === ACTORS.PLAYER ? '당신이' : '컴퓨터가';
}

function createGame(options = {}) {
  return {
    stones: options.stones ?? 21,
    maxTake: options.maxTake ?? 3,
    turn: options.turn || ACTORS.PLAYER,
    status: options.status || STATUS.PLAYING,
    history: cloneHistory(options.history || []),
    message: options.message || '돌 1개부터 3개까지 가져가세요. 마지막 돌을 가져가면 승리합니다.',
  };
}

function availableTakes(game) {
  if (game.status !== STATUS.PLAYING) return [];
  const limit = Math.min(game.maxTake, game.stones);
  return Array.from({ length: limit }, (_, index) => index + 1);
}

function validateTake(game, count) {
  if (!Number.isInteger(count)) throw new Error('가져갈 돌 개수는 정수여야 합니다.');
  if (!availableTakes(game).includes(count)) throw new Error('그만큼은 가져갈 수 없습니다.');
}

function takeStones(game, count, actor) {
  validateTake(game, count);

  const nextStones = game.stones - count;
  const next = {
    ...game,
    stones: nextStones,
    history: [...cloneHistory(game.history), { actor, count }],
    message: `${actorSubject(actor)} 돌 ${count}개를 가져갔습니다.`,
  };

  if (nextStones === 0) {
    next.status = actor === ACTORS.PLAYER ? STATUS.WON : STATUS.LOST;
    next.turn = actor;
    next.message = actor === ACTORS.PLAYER
      ? '마지막 돌을 가져가 승리했습니다!'
      : '컴퓨터가 마지막 돌을 가져갔습니다. 다시 도전하세요.';
    return next;
  }

  next.turn = actor === ACTORS.PLAYER ? ACTORS.COMPUTER : ACTORS.PLAYER;
  return next;
}

function chooseComputerTake(game) {
  const takes = availableTakes(game);
  if (takes.length === 0) return 0;

  const target = game.maxTake + 1;
  const winningTake = game.stones % target;
  if (winningTake > 0 && takes.includes(winningTake)) return winningTake;
  return takes[0];
}

function playPlayerTurn(game, count) {
  if (game.status !== STATUS.PLAYING) return createGame(game);
  if (game.turn !== ACTORS.PLAYER) throw new Error('아직 당신 차례가 아닙니다.');

  const afterPlayer = takeStones(game, count, ACTORS.PLAYER);
  if (afterPlayer.status !== STATUS.PLAYING) return afterPlayer;

  const computerCount = chooseComputerTake(afterPlayer);
  const afterComputer = takeStones(afterPlayer, computerCount, ACTORS.COMPUTER);
  if (afterComputer.status === STATUS.PLAYING) {
    afterComputer.message = `컴퓨터가 돌 ${computerCount}개를 가져갔습니다. 다음 수를 고르세요.`;
  }
  return afterComputer;
}

function statusText(game) {
  if (game.status === STATUS.WON) return `승리 · 남은 돌 ${game.stones}개`;
  if (game.status === STATUS.LOST) return `패배 · 남은 돌 ${game.stones}개`;
  return `진행 중 · 남은 돌 ${game.stones}개`;
}

const api = {
  ACTORS,
  STATUS,
  createGame,
  availableTakes,
  chooseComputerTake,
  takeStones,
  playPlayerTurn,
  statusText,
};

if (typeof module !== 'undefined' && module.exports) module.exports = api;
if (typeof window !== 'undefined') window.NimLogic = api;
