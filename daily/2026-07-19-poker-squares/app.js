const boardNode = document.querySelector('[data-board]');
const rowScoresNode = document.querySelector('[data-row-scores]');
const columnScoresNode = document.querySelector('[data-column-scores]');
const totalScoreNode = document.querySelector('[data-total-score]');
const currentCardNode = document.querySelector('[data-current-card]');
const messageNode = document.querySelector('[data-message]');
const resetButton = document.querySelector('[data-reset]');

let game = PokerSquares.createGame();

function renderBoard() {
  boardNode.innerHTML = '';
  game.grid.forEach((row, rowIndex) => {
    row.forEach((card, colIndex) => {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = card ? `cell filled ${card.suit.toLowerCase()}` : 'cell';
      cell.disabled = Boolean(card) || game.status !== '진행 중';
      cell.textContent = card ? compactCard(card) : '';
      cell.setAttribute('aria-label', card ? PokerSquares.cardLabel(card) : `${rowIndex + 1}행 ${colIndex + 1}열 빈칸`);
      cell.addEventListener('click', () => {
        game = PokerSquares.placeCard(game, rowIndex, colIndex);
        render();
      });
      boardNode.appendChild(cell);
    });
  });
}

function renderScores(target, lines, prefix) {
  target.innerHTML = '';
  lines.forEach((line, index) => {
    const item = document.createElement('div');
    item.className = 'line-score';
    item.innerHTML = `<span>${prefix} ${index + 1}</span><strong>${line.score}</strong><em>${line.name}</em>`;
    target.appendChild(item);
  });
}

function compactCard(card) {
  const suits = {
    S: '♠',
    H: '♥',
    D: '◆',
    C: '♣',
  };
  return `${card.rank}${suits[card.suit]}`;
}

function render() {
  renderBoard();
  renderScores(rowScoresNode, game.rows, '행');
  renderScores(columnScoresNode, game.columns, '열');
  totalScoreNode.textContent = game.totalScore;
  currentCardNode.textContent = game.currentCard ? compactCard(game.currentCard) : '없음';
  currentCardNode.className = game.currentCard ? game.currentCard.suit.toLowerCase() : '';
  messageNode.textContent = game.message;
}

resetButton.addEventListener('click', () => {
  game = PokerSquares.createGame();
  render();
});

render();
