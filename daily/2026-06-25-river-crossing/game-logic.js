const SIDES = ['left', 'right'];
const ITEMS = ['farmer', 'wolf', 'goat', 'cabbage'];
const CARGO = ['wolf', 'goat', 'cabbage'];
const ITEM_NAMES = {
  farmer: '농부',
  wolf: '늑대',
  goat: '염소',
  cabbage: '양배추',
};
const SIDE_NAMES = {
  left: '왼쪽 강가',
  right: '오른쪽 강가',
};

function normalizeSide(side) {
  return SIDES.includes(side) ? side : 'left';
}

function oppositeSide(side) {
  return normalizeSide(side) === 'left' ? 'right' : 'left';
}

function createPositions(input = {}) {
  return ITEMS.reduce((positions, item) => ({
    ...positions,
    [item]: normalizeSide(input[item]),
  }), {});
}

function getItemsOnSide(gameInput, sideInput) {
  const game = createGame(gameInput);
  const side = normalizeSide(sideInput);

  return ITEMS.filter((item) => game.positions[item] === side);
}

function getDangerMessages(positionsInput) {
  const positions = createPositions(positionsInput);
  const messages = [];

  SIDES.forEach((side) => {
    const farmerAway = positions.farmer !== side;
    const wolfWithGoat = positions.wolf === side && positions.goat === side;
    const goatWithCabbage = positions.goat === side && positions.cabbage === side;

    if (farmerAway && wolfWithGoat) {
      messages.push('농부가 없으면 늑대가 염소를 잡아먹습니다.');
    }

    if (farmerAway && goatWithCabbage) {
      messages.push('농부가 없으면 염소가 양배추를 먹습니다.');
    }
  });

  return messages;
}

function isWin(gameInput) {
  const positions = createPositions(gameInput?.positions);

  return ITEMS.every((item) => positions[item] === 'right');
}

function getMoveMessage(passenger, side) {
  if (!passenger) {
    return `농부가 혼자 ${SIDE_NAMES[side]}로 건넜습니다.`;
  }

  return `농부가 ${ITEM_NAMES[passenger]}와 함께 ${SIDE_NAMES[side]}로 건넜습니다.`;
}

function createGame(options = {}) {
  const positions = createPositions(options.positions);
  const moves = Math.max(0, Math.floor(Number(options.moves) || 0));
  const won = isWin({ positions });

  return {
    positions,
    moves,
    status: options.status || (won ? '성공' : '진행 중'),
    message: options.message || (
      won
        ? '성공입니다. 모두 안전하게 강을 건넜습니다!'
        : '농부와 짐을 모두 오른쪽 강가로 옮기세요.'
    ),
  };
}

function crossRiver(gameInput, passenger = null) {
  const game = createGame(gameInput);

  if (game.status === '성공') {
    return {
      ...game,
      message: '이미 모두 강을 건넜습니다.',
    };
  }

  if (passenger !== null && !CARGO.includes(passenger)) {
    return {
      ...game,
      message: '배에는 늑대, 염소, 양배추 중 하나만 태울 수 있습니다.',
    };
  }

  const from = game.positions.farmer;
  const to = oppositeSide(from);

  if (passenger && game.positions[passenger] !== from) {
    return {
      ...game,
      message: '같은 강가에 있는 짐만 배에 태울 수 있습니다.',
    };
  }

  const nextPositions = {
    ...game.positions,
    farmer: to,
  };

  if (passenger) {
    nextPositions[passenger] = to;
  }

  const dangerMessages = getDangerMessages(nextPositions);
  if (dangerMessages.length > 0) {
    return {
      ...game,
      message: dangerMessages[0],
    };
  }

  return createGame({
    positions: nextPositions,
    moves: game.moves + 1,
    message: isWin({ positions: nextPositions })
      ? '성공입니다. 모두 안전하게 강을 건넜습니다!'
      : getMoveMessage(passenger, to),
  });
}

const RiverCrossing = {
  createGame,
  crossRiver,
  getDangerMessages,
  getItemsOnSide,
  isWin,
  oppositeSide,
};

if (typeof module !== 'undefined') {
  module.exports = RiverCrossing;
}

if (typeof window !== 'undefined') {
  window.RiverCrossing = RiverCrossing;
}
