(() => {
  const boardElement = document.querySelector('#board');
  const message = document.querySelector('#message');
  const marks = { clubs: '♣', diamonds: '♦', hearts: '♥', spades: '♠' };
  const names = { clubs: '클로버', diamonds: '다이아', hearts: '하트', spades: '스페이드' };
  let board;
  let selected = null;

  function newBoard() {
    const cards = GapsSolitaire.SUITS.flatMap((suit) => Array.from({ length: 12 }, (_, index) => ({ suit, rank: index + 2 })));
    cards.push(null, null, null, null);
    for (let index = cards.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(Math.random() * (index + 1));
      [cards[index], cards[swap]] = [cards[swap], cards[index]];
    }
    return GapsSolitaire.createBoard(cards);
  }

  function cardLabel(card) { return `${card.rank === 1 ? 'A' : card.rank}${marks[card.suit]}`; }
  function cardDescription(card) { return `${names[card.suit]} ${card.rank === 1 ? '에이스' : card.rank} 카드`; }

  function startGame() {
    board = newBoard();
    selected = null;
    message.textContent = '카드를 고른 뒤, 이어질 수 있는 빈칸을 선택하세요.';
    render();
  }

  function chooseCard(index) {
    if (GapsSolitaire.getStatus(board) === 'won') return;
    selected = selected === index ? null : index;
    message.textContent = selected === null ? '선택을 취소했습니다.' : `${cardDescription(board[index])}를 골랐습니다. 빈칸을 선택하세요.`;
    render();
  }

  function chooseGap(index) {
    if (selected === null) {
      message.textContent = '먼저 움직일 카드를 고르세요.';
      return;
    }
    try {
      board = GapsSolitaire.moveCard(board, selected, index);
      selected = null;
      message.textContent = GapsSolitaire.getStatus(board) === 'won' ? '성공! 네 줄을 모두 완성했습니다.' : '카드를 옮겼습니다. 다음 카드를 고르세요.';
      render();
    } catch (error) { message.textContent = error.message; }
  }

  function render() {
    boardElement.replaceChildren(...board.map((card, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `slot ${card ? `card ${card.suit}` : 'gap'} ${selected === index ? 'selected' : ''}`;
      if (card) {
        button.textContent = cardLabel(card);
        button.setAttribute('aria-label', `${cardDescription(card)} 선택`);
        button.addEventListener('click', () => chooseCard(index));
      } else {
        button.textContent = '빈칸';
        button.setAttribute('aria-label', `${Math.floor(index / 13) + 1}번째 줄 빈칸에 놓기`);
        button.addEventListener('click', () => chooseGap(index));
      }
      return button;
    }));
  }

  document.querySelector('#reset').addEventListener('click', startGame);
  startGame();
})();
