(() => {
  const suits = ['♥', '♦', '♣', '♠'];
  const rankText = { 1: 'A', 11: 'J', 12: 'Q', 13: 'K' };
  const tableauElement = document.querySelector('#tableau');
  const foundationsElement = document.querySelector('#foundations');
  const messageElement = document.querySelector('#message');
  let selectedPile = null;
  let state;

  function card(rank, suit, faceUp = true) {
    return { rank, suit, faceUp };
  }

  function startingState() {
    return Klondike.createState({
      tableau: [
        [card(5, '♥', false), card(1, '♥')],
        [card(4, '♠', false), card(1, '♠')],
        [card(3, '♦', false), card(1, '♦')],
        [card(2, '♣', false), card(1, '♣')],
        [card(5, '♣')],
        [card(4, '♥')],
        [card(3, '♠')],
        [card(2, '♦')],
        [card(2, '♥')],
        [card(2, '♠')],
        [card(3, '♥')],
        [card(3, '♣')],
        [card(4, '♦')],
        [card(4, '♣')],
        [card(5, '♦')],
        [card(5, '♠')],
      ],
      foundations: { '♥': [], '♦': [], '♣': [], '♠': [] },
    });
  }

  function label(cardInfo) {
    return `${rankText[cardInfo.rank] || cardInfo.rank}${cardInfo.suit}`;
  }

  function render() {
    tableauElement.replaceChildren();
    foundationsElement.replaceChildren();
    const won = Klondike.getStatus(state) === 'won';

    suits.forEach((suit) => {
      const pile = state.foundations[suit];
      const button = document.createElement('button');
      const top = pile.at(-1);
      button.type = 'button';
      button.className = `foundation ${suit === '♥' || suit === '♦' ? 'red' : ''}`;
      button.textContent = top ? label(top) : `${suit} 기초`;
      button.setAttribute('aria-label', `${suit} 기초 더미${top ? `, 맨 위 ${label(top)}` : ', 비어 있음'}`);
      button.disabled = won;
      button.addEventListener('click', () => moveSelectedToFoundation());
      foundationsElement.append(button);
    });

    state.tableau.forEach((pile, pileIndex) => {
      const column = document.createElement('div');
      column.className = 'pile-column';
      const title = document.createElement('span');
      title.className = 'pile-title';
      title.textContent = `${pileIndex + 1}번 더미`;
      column.append(title);
      const cards = document.createElement('button');
      cards.type = 'button';
      cards.className = `pile${selectedPile === pileIndex ? ' selected' : ''}`;
      cards.setAttribute('aria-label', `${pileIndex + 1}번 카드 더미`);
      cards.addEventListener('click', () => selectOrMove(pileIndex));
      if (!pile.length) cards.classList.add('empty');
      pile.forEach((cardInfo) => {
        const cardElement = document.createElement('span');
        cardElement.className = `card ${cardInfo.faceUp === false ? 'face-down' : ''} ${cardInfo.suit === '♥' || cardInfo.suit === '♦' ? 'red' : ''}`;
        cardElement.textContent = cardInfo.faceUp === false ? '✦' : label(cardInfo);
        cards.append(cardElement);
      });
      column.append(cards);
      tableauElement.append(column);
    });
  }

  function reportError(error) {
    messageElement.textContent = error.message;
  }

  function selectOrMove(pileIndex) {
    if (Klondike.getStatus(state) === 'won') return;
    if (selectedPile === null) {
      const top = state.tableau[pileIndex].at(-1);
      if (!top || top.faceUp === false) return reportError('열린 맨 위 카드를 골라 주세요.');
      selectedPile = pileIndex;
      messageElement.textContent = `${pileIndex + 1}번 더미를 골랐습니다. 놓을 더미나 기초 더미를 누르세요.`;
    } else if (selectedPile === pileIndex) {
      selectedPile = null;
      messageElement.textContent = '카드 선택을 취소했습니다.';
    } else {
      try {
        state = Klondike.moveTableauCard(state, selectedPile, pileIndex);
        messageElement.textContent = '카드를 옮겼습니다. 기초 더미에 올릴 카드도 찾아보세요.';
      } catch (error) {
        reportError(error);
      }
      selectedPile = null;
    }
    render();
  }

  function moveSelectedToFoundation() {
    if (selectedPile === null) return reportError('먼저 옮길 카드 더미를 골라 주세요.');
    try {
      state = Klondike.moveToFoundation(state, selectedPile);
      messageElement.textContent = Klondike.getStatus(state) === 'won'
        ? '성공! 모든 카드를 기초 더미에 모았습니다.'
        : '기초 더미에 카드를 올렸습니다.';
    } catch (error) {
      reportError(error);
    }
    selectedPile = null;
    render();
  }

  document.querySelector('#reset').addEventListener('click', () => {
    state = startingState();
    selectedPile = null;
    messageElement.textContent = '새 게임을 시작했습니다. A부터 기초 더미에 올려 보세요.';
    render();
  });

  state = startingState();
  render();
})();
