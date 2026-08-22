(() => {
  const playerHandElement = document.querySelector('#player-hand');
  const opponentHandElement = document.querySelector('#opponent-hand');
  const messageElement = document.querySelector('#message');
  const suitPicker = document.querySelector('#suit-picker');
  const drawButton = document.querySelector('#draw-pile');
  let state;
  let pendingEightIndex = null;
  let computerTimer = null;

  function createDeck() {
    return CrazyEights.SUITS.flatMap((suit) => Array.from({ length: 8 }, (_, index) => ({ rank: index + 1, suit })));
  }

  function shuffle(cards) {
    const next = [...cards];
    for (let index = next.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [next[index], next[randomIndex]] = [next[randomIndex], next[index]];
    }
    return next;
  }

  function startingState() {
    const deck = shuffle(createDeck());
    const hands = [deck.splice(0, 5), deck.splice(0, 5)];
    let firstCard = deck.pop();
    if (firstCard.rank === 8) {
      deck.unshift(firstCard);
      firstCard = deck.pop();
    }
    return CrazyEights.createState({ hands, drawPile: deck, discardPile: [firstCard], activeSuit: firstCard.suit, turn: 0 });
  }

  function label(card) {
    return `${card.rank}${card.suit}`;
  }

  function isRed(card) {
    return card.suit === '♥' || card.suit === '♦';
  }

  function renderHand(element, hand, hidden) {
    element.replaceChildren();
    const playable = !hidden && state.turn === 0 && CrazyEights.getStatus(state) === 'playing'
      ? new Set(CrazyEights.playableIndexes(state, 0)) : new Set();
    hand.forEach((card, index) => {
      const cardElement = document.createElement(hidden ? 'span' : 'button');
      cardElement.className = hidden ? 'back-card' : `card ${isRed(card) ? 'red' : ''} ${playable.has(index) ? 'playable' : ''}`;
      cardElement.textContent = hidden ? '✦' : label(card);
      if (hidden) return element.append(cardElement);
      cardElement.type = 'button';
      cardElement.disabled = state.turn !== 0 || CrazyEights.getStatus(state) !== 'playing' || !playable.has(index);
      cardElement.setAttribute('aria-label', `${label(card)} 카드 내기`);
      cardElement.addEventListener('click', () => playPlayerCard(index));
      element.append(cardElement);
    });
  }

  function render() {
    const top = state.discardPile.at(-1);
    const status = CrazyEights.getStatus(state);
    document.querySelector('#player-count').textContent = `${state.hands[0].length}장`;
    document.querySelector('#opponent-count').textContent = `${state.hands[1].length}장`;
    document.querySelector('#draw-count').textContent = `${state.drawPile.length}장`;
    document.querySelector('#discard-card').textContent = label(top);
    document.querySelector('#discard-card').className = isRed(top) ? 'red' : '';
    document.querySelector('#active-suit').textContent = `현재 무늬 ${state.activeSuit}`;
    const canDraw = state.drawPile.length || state.discardPile.length > 1;
    const canPass = !canDraw && !CrazyEights.playableIndexes(state, 0).length;
    document.querySelector('#draw-label').textContent = canPass ? '차례 넘기기' : '카드 더미';
    drawButton.setAttribute('aria-label', canPass ? '차례 넘기기' : '카드 더미에서 한 장 뽑기');
    drawButton.disabled = state.turn !== 0 || (!canDraw && !canPass) || status !== 'playing' || pendingEightIndex !== null;
    renderHand(playerHandElement, state.hands[0], false);
    renderHand(opponentHandElement, state.hands[1], true);
  }

  function announceStatus() {
    const status = CrazyEights.getStatus(state);
    if (status === 'player-won') messageElement.textContent = '성공! 내 카드를 모두 없앴습니다.';
    if (status === 'computer-won') messageElement.textContent = '상대가 먼저 카드를 모두 없앴습니다. 새 게임에 도전해 보세요.';
    if (status === 'draw') messageElement.textContent = '더 이상 낼 카드가 없어 이번 게임은 무승부입니다.';
    return status;
  }

  function playPlayerCard(index, chosenSuit) {
    const card = state.hands[0][index];
    if (card.rank === 8 && !chosenSuit) {
      pendingEightIndex = index;
      suitPicker.hidden = false;
      messageElement.textContent = '팔자 카드입니다. 이어갈 무늬를 골라 주세요.';
      render();
      return;
    }
    state = CrazyEights.playCard(state, 0, index, chosenSuit);
    pendingEightIndex = null;
    suitPicker.hidden = true;
    if (announceStatus() === 'playing') {
      messageElement.textContent = '카드를 냈습니다. 상대가 생각하고 있습니다.';
      render();
      scheduleComputer();
    } else render();
  }

  function drawPlayerCard() {
    try {
      const canDraw = state.drawPile.length || state.discardPile.length > 1;
      state = canDraw ? CrazyEights.drawCard(state, 0) : CrazyEights.passTurn(state, 0);
      messageElement.textContent = canDraw ? '카드를 한 장 뽑았습니다. 상대 차례입니다.' : '뽑을 카드가 없어 차례를 넘겼습니다. 상대 차례입니다.';
      render();
      scheduleComputer();
    } catch (error) {
      messageElement.textContent = error.message;
    }
  }

  function scheduleComputer() {
    window.clearTimeout(computerTimer);
    computerTimer = window.setTimeout(playComputer, 650);
  }

  function playComputer() {
    if (state.turn !== 1 || announceStatus() !== 'playing') return render();
    const indexes = CrazyEights.playableIndexes(state, 1);
    if (indexes.length) {
      const index = indexes[0];
      const card = state.hands[1][index];
      const suit = card.rank === 8 ? CrazyEights.chooseSuit(state.hands[1].filter((_, cardIndex) => cardIndex !== index)) : undefined;
      state = CrazyEights.playCard(state, 1, index, suit);
      if (announceStatus() === 'playing') messageElement.textContent = card.rank === 8 ? `상대가 팔자를 내고 ${suit} 무늬를 골랐습니다.` : '상대가 카드를 냈습니다. 내 차례입니다.';
    } else if (state.drawPile.length || state.discardPile.length > 1) {
      state = CrazyEights.drawCard(state, 1);
      messageElement.textContent = '상대가 카드를 한 장 뽑았습니다. 내 차례입니다.';
    } else {
      state = CrazyEights.passTurn(state, 1);
      if (announceStatus() === 'playing') messageElement.textContent = '뽑을 카드가 없어 상대가 차례를 넘겼습니다.';
    }
    render();
  }

  drawButton.addEventListener('click', drawPlayerCard);
  document.querySelector('#reset').addEventListener('click', () => {
    window.clearTimeout(computerTimer);
    state = startingState();
    pendingEightIndex = null;
    suitPicker.hidden = true;
    messageElement.textContent = '새 게임을 시작했습니다. 같은 숫자나 무늬의 카드를 내세요.';
    render();
  });
  document.querySelectorAll('[data-suit]').forEach((button) => button.addEventListener('click', () => playPlayerCard(pendingEightIndex, button.dataset.suit)));

  state = startingState();
  render();
})();
