const SUITS = ['스페이드', '하트', '다이아몬드', '클럽'];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const RANK_NAMES = {
  A: '에이스',
  J: '잭',
  Q: '퀸',
  K: '킹',
};

function createDeck() {
  return SUITS.flatMap((suit) => RANKS.map((rank) => ({ suit, rank })));
}

function shuffleDeck(deck) {
  const copy = deck.map((card) => ({ ...card }));
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

function cardRankLabel(card) {
  return RANK_NAMES[card.rank] || card.rank;
}

function cardLabel(card) {
  return `${card.suit} ${cardRankLabel(card)}`;
}

function cardScore(card) {
  if (card.rank === 'A') return 11;
  if (['K', 'Q', 'J'].includes(card.rank)) return 10;
  return Number(card.rank);
}

function handValue(hand) {
  let total = 0;
  let aces = 0;

  hand.forEach((card) => {
    total += cardScore(card);
    if (card.rank === 'A') {
      aces += 1;
    }
  });

  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }

  return total;
}

function cloneHand(hand = []) {
  return hand.map((card) => ({ ...card }));
}

function cloneDeck(deck = []) {
  return deck.map((card) => ({ ...card }));
}

function draw(deck) {
  const [card, ...rest] = deck;
  return { card, deck: rest };
}

function buildGame(playerHand, dealerHand, deck, status, message) {
  return {
    playerHand: cloneHand(playerHand),
    dealerHand: cloneHand(dealerHand),
    deck: cloneDeck(deck),
    status,
    message,
  };
}

function canPlayerAct(game) {
  return game.status === '플레이 중';
}

function createGame(options = {}) {
  let deck = options.deck ? cloneDeck(options.deck) : shuffleDeck(createDeck());
  const playerHand = [];
  const dealerHand = [];

  for (let count = 0; count < 2; count += 1) {
    let drawn = draw(deck);
    if (drawn.card) playerHand.push(drawn.card);
    deck = drawn.deck;

    drawn = draw(deck);
    if (drawn.card) dealerHand.push(drawn.card);
    deck = drawn.deck;
  }

  const playerScore = handValue(playerHand);
  const dealerScore = handValue(dealerHand);

  if (playerScore === 21 && dealerScore === 21) {
    return buildGame(playerHand, dealerHand, deck, '무승부', '둘 다 블랙잭입니다. 승부가 나지 않았습니다.');
  }
  if (playerScore === 21) {
    return buildGame(playerHand, dealerHand, deck, '승리', '블랙잭! 시작하자마자 승리했습니다.');
  }
  if (dealerScore === 21) {
    return buildGame(playerHand, dealerHand, deck, '패배', '딜러가 블랙잭입니다. 다시 도전하세요.');
  }

  return buildGame(playerHand, dealerHand, deck, '플레이 중', '카드를 더 받을지 멈출지 선택하세요.');
}

function hitPlayer(game) {
  if (!canPlayerAct(game)) {
    return game;
  }

  const drawn = draw(game.deck);
  if (!drawn.card) {
    return buildGame(game.playerHand, game.dealerHand, [], '무승부', '더 받을 카드가 없어 승부가 멈췄습니다.');
  }

  const playerHand = [...game.playerHand, drawn.card];
  const score = handValue(playerHand);

  if (score > 21) {
    return buildGame(playerHand, game.dealerHand, drawn.deck, '패배', '21을 넘었습니다. 딜러의 승리입니다.');
  }
  if (score === 21) {
    return standDealer(buildGame(playerHand, game.dealerHand, drawn.deck, '플레이 중', '21점입니다. 딜러와 승부합니다.'));
  }

  return buildGame(playerHand, game.dealerHand, drawn.deck, '플레이 중', `${score}점입니다. 더 받을 수 있습니다.`);
}

function compareHands(playerHand, dealerHand, deck) {
  const playerScore = handValue(playerHand);
  const dealerScore = handValue(dealerHand);

  if (dealerScore > 21) {
    return buildGame(playerHand, dealerHand, deck, '승리', `딜러가 ${dealerScore}점으로 초과했습니다. 승리했습니다!`);
  }
  if (playerScore > dealerScore) {
    return buildGame(playerHand, dealerHand, deck, '승리', `플레이어 ${playerScore}점, 딜러 ${dealerScore}점. 승리했습니다!`);
  }
  if (playerScore < dealerScore) {
    return buildGame(playerHand, dealerHand, deck, '패배', `플레이어 ${playerScore}점, 딜러 ${dealerScore}점. 딜러의 승리입니다.`);
  }
  return buildGame(playerHand, dealerHand, deck, '무승부', `둘 다 ${playerScore}점입니다. 무승부입니다.`);
}

function standDealer(game) {
  if (!canPlayerAct(game)) {
    return game;
  }

  let dealerHand = cloneHand(game.dealerHand);
  let deck = cloneDeck(game.deck);

  while (handValue(dealerHand) < 17 && deck.length > 0) {
    const drawn = draw(deck);
    dealerHand = [...dealerHand, drawn.card];
    deck = drawn.deck;
  }

  return compareHands(game.playerHand, dealerHand, deck);
}

const gameLogic = {
  SUITS,
  RANKS,
  createDeck,
  shuffleDeck,
  cardLabel,
  cardRankLabel,
  cardScore,
  handValue,
  createGame,
  hitPlayer,
  standDealer,
  canPlayerAct,
};

if (typeof module !== 'undefined') {
  module.exports = gameLogic;
}

if (typeof window !== 'undefined') {
  window.gameLogic = gameLogic;
}
