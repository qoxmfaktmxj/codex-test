const TILE_LABELS = ['빨강', '파랑', '노랑', '초록'];
const TARGET_ROUNDS = 5;

function tileFromRandom(random = Math.random) {
  const value = random();
  const safeValue = Number.isFinite(value) ? value : 0;
  const index = Math.min(
    TILE_LABELS.length - 1,
    Math.max(0, Math.floor(safeValue * TILE_LABELS.length)),
  );
  return TILE_LABELS[index];
}

function normalizeSequence(input) {
  if (Array.isArray(input)) {
    return input.filter((tile) => TILE_LABELS.includes(tile));
  }

  return [tileFromRandom(input && input.random)];
}

function createGame(input) {
  const safeSequence = normalizeSequence(input);
  const initialSequence = safeSequence.length > 0 ? safeSequence : [tileFromRandom()];

  return {
    sequence: initialSequence.slice(),
    playerIndex: 0,
    round: initialSequence.length,
    phase: 'memorizing',
    status: 'playing',
    message: `${initialSequence.length}라운드 순서를 외우세요.`,
  };
}

function startInput(game) {
  if (game.status !== 'playing' || game.phase !== 'memorizing') {
    return game;
  }

  return {
    ...game,
    playerIndex: 0,
    phase: 'input',
    message: '순서대로 색을 누르세요.',
  };
}

function remainingCount(game) {
  return game.sequence.length - game.playerIndex;
}

function chooseTile(game, tile, random = Math.random) {
  if (
    game.status !== 'playing' ||
    game.phase !== 'input' ||
    !TILE_LABELS.includes(tile)
  ) {
    return game;
  }

  const expected = game.sequence[game.playerIndex];
  if (tile !== expected) {
    return {
      ...game,
      status: 'lost',
      message: `틀렸습니다. 정답은 ${expected}입니다.`,
    };
  }

  const nextPlayerIndex = game.playerIndex + 1;
  if (nextPlayerIndex < game.sequence.length) {
    const remaining = game.sequence.length - nextPlayerIndex;
    return {
      ...game,
      playerIndex: nextPlayerIndex,
      message: `좋아요. ${remaining}개 남았습니다.`,
    };
  }

  if (game.sequence.length >= TARGET_ROUNDS) {
    return {
      ...game,
      status: 'won',
      message: `성공! ${TARGET_ROUNDS}라운드를 외웠습니다.`,
    };
  }

  const sequence = game.sequence.concat(tileFromRandom(random));
  return {
    sequence,
    playerIndex: 0,
    round: sequence.length,
    phase: 'memorizing',
    status: 'playing',
    message: `${sequence.length}라운드 순서를 외우세요.`,
  };
}

function sequenceText(game) {
  return game.sequence.join(' → ');
}

function visibleSequenceText(game) {
  return game.phase === 'memorizing' ? sequenceText(game) : '순서를 숨겼습니다';
}

const gameLogic = {
  TILE_LABELS,
  TARGET_ROUNDS,
  createGame,
  startInput,
  chooseTile,
  sequenceText,
  visibleSequenceText,
  remainingCount,
};

if (typeof module !== 'undefined') {
  module.exports = gameLogic;
}

if (typeof window !== 'undefined') {
  window.gameLogic = gameLogic;
}
