const boardElement = document.getElementById('board');
const pairsElement = document.getElementById('pairs');
const stockElement = document.getElementById('stock');
const statusElement = document.getElementById('status');
const messageElement = document.getElementById('message');
const hintButton = document.getElementById('hint');
const resetButton = document.getElementById('reset');

let game = MonteCarloSolitaire.createGame();
let selectedIndex = null;
let hintedPair = null;

const suitNames = {
  '♠': '스페이드',
  '♥': '하트',
  '♦': '다이아몬드',
  '♣': '클럽',
};

function cardLabel(card) {
  return `${suitNames[card.suit]} ${card.rank}`;
}

function isHinted(index) {
  return hintedPair && (hintedPair.first === index || hintedPair.second === index);
}

function render() {
  pairsElement.textContent = `${game.removedPairs}쌍`;
  stockElement.textContent = `${game.stock.length}장`;
  statusElement.textContent = game.status;
  messageElement.textContent = game.message;
  hintButton.disabled = game.status !== '진행 중';
  boardElement.innerHTML = '';

  for (let index = 0; index < MonteCarloSolitaire.BOARD_SIZE; index += 1) {
    const card = game.board[index];
    const slot = document.createElement('button');
    slot.type = 'button';
    slot.className = 'card-slot';
    slot.disabled = !card || game.status !== '진행 중';
    slot.setAttribute('aria-label', card ? `${index + 1}번 ${cardLabel(card)}` : `${index + 1}번 빈자리`);

    if (card) {
      slot.classList.add(card.suit === '♥' || card.suit === '♦' ? 'red' : 'black');
      slot.innerHTML = `<span class="rank">${card.rank}</span><span class="suit">${card.suit}</span>`;
    } else {
      slot.classList.add('empty');
      slot.textContent = '빈자리';
    }

    if (selectedIndex === index) {
      slot.classList.add('selected');
    }
    if (isHinted(index)) {
      slot.classList.add('hinted');
    }

    slot.addEventListener('click', () => handleCard(index));
    boardElement.appendChild(slot);
  }
}

function clearGuide() {
  hintedPair = null;
}

function handleCard(index) {
  if (game.status !== '진행 중' || !game.board[index]) {
    return;
  }

  if (selectedIndex === null) {
    selectedIndex = index;
    clearGuide();
    game = { ...game, message: `${cardLabel(game.board[index])} 선택됨. 이웃한 같은 숫자를 고르세요.` };
    render();
    return;
  }

  if (selectedIndex === index) {
    selectedIndex = null;
    game = { ...game, message: '선택을 취소했습니다.' };
    render();
    return;
  }

  try {
    game = MonteCarloSolitaire.removePair(game, selectedIndex, index);
    selectedIndex = null;
    clearGuide();
  } catch (error) {
    game = { ...game, message: error.message };
    selectedIndex = index;
    clearGuide();
  }
  render();
}

hintButton.addEventListener('click', () => {
  const [pair] = MonteCarloSolitaire.findPairs(game);
  if (!pair) {
    game = MonteCarloSolitaire.evaluateGame({ ...game, message: '더 이상 가능한 쌍이 없습니다.' });
  } else {
    hintedPair = pair;
    selectedIndex = null;
    game = { ...game, message: `${pair.first + 1}번과 ${pair.second + 1}번 카드가 같은 숫자로 이웃합니다.` };
  }
  render();
});

resetButton.addEventListener('click', () => {
  game = MonteCarloSolitaire.createGame();
  selectedIndex = null;
  hintedPair = null;
  render();
});

render();
