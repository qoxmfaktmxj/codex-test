(() => {
  const tableauElement = document.querySelector('#tableau');
  const cellsElement = document.querySelector('#cells');
  const foundationsElement = document.querySelector('#foundations');
  const message = document.querySelector('#message');
  const suitNames = { clubs: '클로버', diamonds: '다이아', hearts: '하트', spades: '스페이드' };
  const suitMarks = { clubs: '♣', diamonds: '♦', hearts: '♥', spades: '♠' };
  let state;
  let selected = null;

  function shuffledDeck() {
    const cards = Freecell.SUITS.flatMap((suit) => [1, 2, 3, 4].map((rank) => ({ suit, rank })));
    for (let index = cards.length - 1; index > 0; index -= 1) {
      const random = Math.floor(Math.random() * (index + 1));
      [cards[index], cards[random]] = [cards[random], cards[index]];
    }
    return cards;
  }

  function startGame() {
    const cards = shuffledDeck();
    state = Freecell.createState({
      tableau: [cards.splice(0, 4), cards.splice(0, 4), cards.splice(0, 4), cards.splice(0, 4)],
      cells: [null, null],
      foundations: { clubs: 0, diamonds: 0, hearts: 0, spades: 0 },
    });
    selected = null;
    message.textContent = '맨 위 카드를 골라 움직일 곳을 선택하세요.';
    render();
  }

  function cardText(card) { return `${card.rank === 1 ? 'A' : card.rank}${suitMarks[card.suit]}`; }
  function cardDescription(card) { return `${suitNames[card.suit]} ${card.rank === 1 ? '에이스' : card.rank} 카드`; }

  function selectSource(source) {
    if (Freecell.getStatus(state) !== 'playing') return;
    try {
      const card = Freecell.sourceCard(state, source);
      selected = selected === source ? null : source;
      message.textContent = selected ? `${cardDescription(card)}를 골랐습니다. 움직일 곳을 선택하세요.` : '선택을 취소했습니다.';
      render();
    } catch (error) { message.textContent = error.message; }
  }

  function move(action) {
    if (!selected || Freecell.getStatus(state) !== 'playing') {
      message.textContent = '먼저 움직일 카드를 고르세요.';
      return;
    }
    try {
      state = action(state, selected);
      selected = null;
      if (Freecell.getStatus(state) === 'won') message.textContent = '성공! 모든 카드를 기초 더미에 모았습니다.';
      else message.textContent = '카드를 옮겼습니다. 다음 수를 고르세요.';
      render();
    } catch (error) { message.textContent = error.message; }
  }

  function sourceButton(card, source) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `card ${card.suit} ${selected === source ? 'selected' : ''}`;
    button.textContent = cardText(card);
    button.setAttribute('aria-label', `${cardDescription(card)} 선택`);
    button.addEventListener('click', () => selectSource(source));
    return button;
  }

  function targetButton(label, className, onClick) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.textContent = label;
    button.addEventListener('click', onClick);
    return button;
  }

  function renderCells() {
    cellsElement.replaceChildren(...state.cells.map((card, index) => {
      const cell = document.createElement('div');
      cell.className = 'cell-slot';
      cell.append(card ? sourceButton(card, `c${index}`) : document.createTextNode('비어 있음'));
      cell.append(targetButton('여기에 놓기', 'place-button', () => move((current, source) => Freecell.moveToCell(current, source, index))));
      return cell;
    }));
  }

  function renderFoundations() {
    foundationsElement.replaceChildren(...Freecell.SUITS.map((suit) => {
      const rank = state.foundations[suit];
      const button = targetButton(rank ? `${rank === 1 ? 'A' : rank}${suitMarks[suit]}` : suitMarks[suit], `foundation ${suit}`, () => move((current, source) => Freecell.moveToFoundation(current, source)));
      button.setAttribute('aria-label', `${suitNames[suit]} 기초 더미${rank ? ` ${rank}까지` : ''}`);
      return button;
    }));
  }

  function renderTableau() {
    tableauElement.replaceChildren(...state.tableau.map((pile, index) => {
      const column = document.createElement('div');
      column.className = 'column';
      const cards = document.createElement('div');
      cards.className = 'card-stack';
      if (pile.length) {
        pile.slice(0, -1).forEach((card) => {
          const fixed = document.createElement('span');
          fixed.className = `card fixed ${card.suit}`;
          fixed.textContent = cardText(card);
          cards.append(fixed);
        });
        cards.append(sourceButton(pile.at(-1), `t${index}`));
      } else cards.textContent = '빈 줄';
      column.append(cards, targetButton('이 줄에 놓기', 'place-button', () => move((current, source) => Freecell.moveToTableau(current, source, index))));
      return column;
    }));
  }

  function render() {
    renderCells();
    renderFoundations();
    renderTableau();
  }

  document.querySelector('#reset').addEventListener('click', startGame);
  startGame();
})();
