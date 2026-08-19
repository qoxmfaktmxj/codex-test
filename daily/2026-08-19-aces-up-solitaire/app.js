(() => {
  const pilesElement = document.querySelector('#piles');
  const messageElement = document.querySelector('#message');
  const countElement = document.querySelector('#count');
  const dealButton = document.querySelector('#deal');
  const resetButton = document.querySelector('#reset');
  const SUIT_LABELS = { clubs: '♣', diamonds: '♦', hearts: '♥', spades: '♠' };
  const RANK_LABELS = { 11: 'J', 12: 'Q', 13: 'K', 14: 'A' };
  let piles;
  let deck;
  let selectedEmpty = null;
  let finished = false;

  function labelFor(card) {
    return `${RANK_LABELS[card.rank] || card.rank}${SUIT_LABELS[card.suit]}`;
  }

  function setMessage(message) {
    messageElement.textContent = message;
  }

  function startGame() {
    piles = [[], [], [], []];
    deck = AcesUp.shuffle(AcesUp.createDeck());
    ({ piles, deck } = AcesUp.deal(piles, deck));
    selectedEmpty = null;
    finished = false;
    setMessage('버릴 수 있는 카드를 눌러 보세요.');
    render();
  }

  function render() {
    pilesElement.innerHTML = '';
    piles.forEach((pile, pileIndex) => {
      const pileElement = document.createElement(pile.length ? 'div' : 'button');
      pileElement.className = `pile${pile.length ? '' : ' empty'}`;
      pileElement.setAttribute('aria-label', `${pileIndex + 1}번째 카드 더미`);
      if (!pile.length) {
        pileElement.type = 'button';
        pileElement.disabled = finished;
        pileElement.textContent = selectedEmpty === pileIndex ? '여기로 옮기기' : '빈 더미';
        pileElement.addEventListener('click', () => selectEmpty(pileIndex));
      }
      pile.forEach((card, cardIndex) => {
        const cardElement = document.createElement('button');
        const isTop = cardIndex === pile.length - 1;
        const red = card.suit === 'hearts' || card.suit === 'diamonds';
        cardElement.type = 'button';
        cardElement.className = `card${red ? ' red' : ''}${isTop ? ' top' : ''}`;
        cardElement.style.top = `${7 + cardIndex * 26}px`;
        cardElement.disabled = !isTop || finished;
        cardElement.setAttribute('aria-label', `${labelFor(card)} 카드`);
        if (isTop && AcesUp.canDiscardTop(piles, pileIndex)) cardElement.classList.add('discardable');
        if (isTop && selectedEmpty !== null) cardElement.classList.add('selected');
        cardElement.innerHTML = `<span class="rank">${RANK_LABELS[card.rank] || card.rank}</span><span class="suit">${SUIT_LABELS[card.suit]}</span>`;
        if (isTop) cardElement.addEventListener('click', () => selectTop(pileIndex));
        pileElement.append(cardElement);
      });
      pilesElement.append(pileElement);
    });
    countElement.textContent = `남은 카드 ${deck.length + piles.flat().length}장`;
    dealButton.disabled = finished || deck.length === 0;
    dealButton.textContent = deck.length ? `카드 나누기 (${deck.length}장)` : '카드 없음';
  }

  function selectEmpty(pileIndex) {
    if (finished) return;
    selectedEmpty = pileIndex;
    setMessage('옮길 더미의 맨 위 카드를 누르세요.');
    render();
  }

  function selectTop(pileIndex) {
    if (finished) return;
    if (selectedEmpty !== null) {
      try {
        piles = AcesUp.moveTopToEmpty(piles, pileIndex, selectedEmpty);
        setMessage('카드를 빈 더미로 옮겼습니다.');
      } catch (error) {
        setMessage(error.message);
      }
      selectedEmpty = null;
      render();
      return;
    }
    if (AcesUp.canDiscardTop(piles, pileIndex)) {
      piles = AcesUp.discardTop(piles, pileIndex);
      if (deck.length === 0 && AcesUp.isWon(piles)) {
        finished = true;
        setMessage('성공! 네 장의 에이스만 남겼습니다.');
      } else setMessage('낮은 카드를 버렸습니다. 계속하세요.');
    } else setMessage('같은 무늬의 더 높은 카드가 있을 때만 버릴 수 있습니다.');
    render();
  }

  dealButton.addEventListener('click', () => {
    ({ piles, deck } = AcesUp.deal(piles, deck));
    selectedEmpty = null;
    setMessage(deck.length ? '새 카드를 나눴습니다.' : '마지막 카드를 나눴습니다.');
    render();
  });
  resetButton.addEventListener('click', startGame);
  startGame();
})();
