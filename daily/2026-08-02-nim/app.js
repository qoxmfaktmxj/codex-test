const pilesNode = document.querySelector('[data-piles]');
const messageNode = document.querySelector('[data-message]');
let game = Nim.createGame();
let selectedPile = null;

function render() {
  pilesNode.innerHTML = '';
  game.piles.forEach((size, pile) => {
    const group = document.createElement('section');
    group.className = `pile${selectedPile === pile ? ' selected' : ''}`;
    const title = document.createElement('h2'); title.textContent = `${pile + 1}번 더미 · ${size}개`;
    const stones = document.createElement('div'); stones.className = 'stones';
    for (let index = 0; index < size; index += 1) {
      const stone = document.createElement('button'); stone.type = 'button'; stone.className = 'stone';
      stone.disabled = game.status !== '진행 중' || game.turn !== Nim.PLAYER; stone.setAttribute('aria-label', `${pile + 1}번 더미의 돌 ${index + 1}`);
      stone.addEventListener('click', () => selectPile(pile)); stones.appendChild(stone);
    }
    group.append(title, stones);
    if (selectedPile === pile && game.turn === Nim.PLAYER && game.status === '진행 중') {
      const choices = document.createElement('div'); choices.className = 'choices';
      for (let count = 1; count <= size; count += 1) { const choice = document.createElement('button'); choice.type = 'button'; choice.textContent = `${count}개 가져가기`; choice.addEventListener('click', () => play({ pile, count })); choices.appendChild(choice); }
      group.appendChild(choices);
    }
    pilesNode.appendChild(group);
  });
  messageNode.textContent = game.message;
}
function selectPile(pile) { selectedPile = selectedPile === pile ? null : pile; render(); }
function computerTurn() { if (game.status === '진행 중' && game.turn === Nim.COMPUTER) { game = Nim.remove(game, Nim.chooseComputerMove(game)); render(); } }
function play(move) { game = Nim.remove(game, move); selectedPile = null; render(); if (game.status === '진행 중') window.setTimeout(computerTurn, 450); }
document.querySelector('[data-reset]').addEventListener('click', () => { game = Nim.createGame(); selectedPile = null; render(); });
render();
