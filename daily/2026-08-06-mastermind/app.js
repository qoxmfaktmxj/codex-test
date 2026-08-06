const paletteNode = document.querySelector('[data-palette]');
const currentNode = document.querySelector('[data-current]');
const historyNode = document.querySelector('[data-history]');
const answerNode = document.querySelector('[data-answer]');
const messageNode = document.querySelector('[data-message]');
const countNode = document.querySelector('[data-count]');
const remainingNode = document.querySelector('[data-remaining]');
let game = Mastermind.createGame();
let selected = [];

function peg(color, hidden = false) {
  const node = document.createElement('span');
  node.className = `peg ${hidden ? 'hidden' : color}`;
  node.setAttribute('aria-label', hidden ? '숨겨진 색' : color);
  return node;
}
function render() {
  paletteNode.innerHTML = ''; currentNode.innerHTML = ''; historyNode.innerHTML = ''; answerNode.innerHTML = '';
  Mastermind.COLORS.forEach((color) => {
    const button = document.createElement('button'); button.type = 'button'; button.className = `color-button ${color}`; button.setAttribute('aria-label', `${color} 선택`);
    button.disabled = game.status !== '진행 중' || selected.includes(color);
    button.addEventListener('click', () => { selected.push(color); render(); }); paletteNode.appendChild(button);
  });
  selected.forEach((color, index) => { const button = document.createElement('button'); button.type = 'button'; button.className = 'selected-peg'; button.append(peg(color)); button.setAttribute('aria-label', `${index + 1}번째 ${color} 빼기`); button.addEventListener('click', () => { selected.splice(index, 1); render(); }); currentNode.appendChild(button); });
  while (currentNode.children.length < Mastermind.CODE_SIZE) currentNode.appendChild(peg('', true));
  game.guesses.forEach((guess, index) => {
    const row = document.createElement('div'); row.className = 'guess-row';
    const number = document.createElement('span'); number.className = 'round'; number.textContent = `${index + 1}`;
    const colors = document.createElement('div'); colors.className = 'pegs'; guess.colors.forEach((color) => colors.appendChild(peg(color)));
    const score = document.createElement('span'); score.className = 'score'; score.textContent = `자리 ${guess.score.exact} · 색 ${guess.score.colorOnly}`;
    row.append(number, colors, score); historyNode.appendChild(row);
  });
  game.secret.forEach((color) => answerNode.appendChild(peg(color, game.status === '진행 중')));
  messageNode.textContent = game.message; countNode.textContent = `${selected.length}/4 선택`; remainingNode.textContent = `남은 기회 ${game.remaining}번`;
  document.querySelector('[data-submit]').disabled = selected.length !== 4 || game.status !== '진행 중';
  document.querySelector('[data-clear]').disabled = !selected.length || game.status !== '진행 중';
}
document.querySelector('[data-submit]').addEventListener('click', () => { game = Mastermind.submitGuess(game, selected); selected = []; render(); });
document.querySelector('[data-clear]').addEventListener('click', () => { selected = []; render(); });
document.querySelector('[data-reset]').addEventListener('click', () => { game = Mastermind.createGame(); selected = []; render(); });
render();
