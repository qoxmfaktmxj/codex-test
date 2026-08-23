(() => {
  const playerHand = document.querySelector('#player-hand');
  const opponentHand = document.querySelector('#opponent-hand');
  const boardElement = document.querySelector('#board');
  const message = document.querySelector('#message');
  const drawButton = document.querySelector('#draw');
  const endPicker = document.querySelector('#end-picker');
  let state;
  let selectedIndex = null;
  let computerTimer = null;

  function createSet() {
    const tiles = [];
    for (let left = 0; left <= 6; left += 1) for (let right = left; right <= 6; right += 1) tiles.push({ left, right });
    return tiles;
  }

  function shuffle(tiles) {
    const next = [...tiles];
    for (let index = next.length - 1; index > 0; index -= 1) {
      const random = Math.floor(Math.random() * (index + 1));
      [next[index], next[random]] = [next[random], next[index]];
    }
    return next;
  }

  function startState() {
    const tiles = shuffle(createSet());
    const hands = [tiles.splice(0, 7), tiles.splice(0, 7)];
    return Dominoes.createState({ hands, drawPile: tiles, board: [tiles.pop()], turn: 0, passes: 0 });
  }

  function tileLabel(tile) { return `${tile.left} | ${tile.right}`; }

  function renderTile(tile, hidden, playable, index) {
    const element = document.createElement(hidden ? 'span' : 'button');
    element.className = hidden ? 'back-tile' : `tile ${playable ? 'playable' : ''}`;
    element.textContent = hidden ? '● ●' : tileLabel(tile);
    if (!hidden) {
      element.type = 'button';
      element.disabled = !playable;
      element.setAttribute('aria-label', `${tileLabel(tile)} 도미노 놓기`);
      element.addEventListener('click', () => selectTile(index));
    }
    return element;
  }

  function render() {
    const status = Dominoes.getStatus(state);
    const moves = status === 'playing' && state.turn === 0 ? Dominoes.playableMoves(state, 0) : [];
    const playable = new Set(moves.map((move) => move.index));
    const ends = Dominoes.endpoints(state);
    document.querySelector('#player-count').textContent = `${state.hands[0].length}개`;
    document.querySelector('#opponent-count').textContent = `${state.hands[1].length}개`;
    document.querySelector('#draw-count').textContent = `${state.drawPile.length}개`;
    document.querySelector('#left-end').textContent = ends.left;
    document.querySelector('#right-end').textContent = ends.right;
    playerHand.replaceChildren(...state.hands[0].map((tile, index) => renderTile(tile, false, playable.has(index), index)));
    opponentHand.replaceChildren(...state.hands[1].map((tile) => renderTile(tile, true)));
    boardElement.replaceChildren(...state.board.map((tile) => {
      const element = document.createElement('span');
      element.className = 'tile';
      element.textContent = tileLabel(tile);
      return element;
    }));
    const canDraw = state.drawPile.length > 0;
    const canPass = !canDraw && !moves.length;
    document.querySelector('#draw-label').textContent = canPass ? '차례 넘기기' : '더미에서 뽑기';
    drawButton.disabled = state.turn !== 0 || status !== 'playing' || moves.length > 0 || (!canDraw && !canPass) || selectedIndex !== null;
  }

  function announceStatus() {
    const status = Dominoes.getStatus(state);
    if (status === 'player-won') message.textContent = '성공! 내 도미노를 모두 놓았습니다.';
    if (status === 'computer-won') message.textContent = '상대가 도미노를 모두 놓았습니다. 새 게임에 도전해 보세요.';
    if (status === 'blocked') {
      const mine = Dominoes.scoreHand(state.hands[0]);
      const theirs = Dominoes.scoreHand(state.hands[1]);
      message.textContent = mine === theirs ? `둘 다 막혔습니다. ${mine}점으로 비겼습니다.` : mine < theirs ? `둘 다 막혔지만 ${mine}점 대 ${theirs}점으로 이겼습니다!` : `둘 다 막혔고 ${mine}점 대 ${theirs}점으로 졌습니다.`;
    }
    return status;
  }

  function placePlayer(side) {
    state = Dominoes.playTile(state, 0, selectedIndex, side);
    selectedIndex = null;
    endPicker.hidden = true;
    if (announceStatus() === 'playing') {
      message.textContent = '도미노를 놓았습니다. 상대가 생각하고 있습니다.';
      render();
      scheduleComputer();
    } else render();
  }

  function selectTile(index) {
    const move = Dominoes.playableMoves(state, 0).find((item) => item.index === index);
    if (!move) return;
    selectedIndex = index;
    if (move.ends.length === 1) placePlayer(move.ends[0]);
    else {
      endPicker.hidden = false;
      message.textContent = '양쪽에 놓을 수 있습니다. 놓을 쪽을 고르세요.';
      render();
    }
  }

  function drawOrPass() {
    const canDraw = state.drawPile.length > 0;
    state = canDraw ? Dominoes.drawTile(state, 0) : Dominoes.passTurn(state, 0);
    message.textContent = canDraw ? '도미노를 한 개 뽑았습니다. 상대 차례입니다.' : '놓을 곳이 없어 차례를 넘겼습니다. 상대 차례입니다.';
    render();
    scheduleComputer();
  }

  function scheduleComputer() {
    window.clearTimeout(computerTimer);
    computerTimer = window.setTimeout(playComputer, 650);
  }

  function playComputer() {
    if (state.turn !== 1 || announceStatus() !== 'playing') return render();
    const moves = Dominoes.playableMoves(state, 1);
    if (moves.length) {
      const choice = moves.sort((a, b) => state.hands[1][b.index].left + state.hands[1][b.index].right - state.hands[1][a.index].left - state.hands[1][a.index].right)[0];
      state = Dominoes.playTile(state, 1, choice.index, choice.ends[0]);
      message.textContent = '상대가 도미노를 놓았습니다. 내 차례입니다.';
    } else if (state.drawPile.length) {
      state = Dominoes.drawTile(state, 1);
      message.textContent = '상대가 도미노를 한 개 뽑았습니다. 내 차례입니다.';
    } else {
      state = Dominoes.passTurn(state, 1);
      if (announceStatus() === 'playing') message.textContent = '상대가 놓지 못해 차례를 넘겼습니다. 내 차례입니다.';
    }
    announceStatus();
    render();
  }

  drawButton.addEventListener('click', drawOrPass);
  document.querySelector('#reset').addEventListener('click', () => {
    window.clearTimeout(computerTimer);
    state = startState();
    selectedIndex = null;
    endPicker.hidden = true;
    message.textContent = '새 게임을 시작했습니다. 내 도미노를 골라 양 끝에 이어 놓으세요.';
    render();
  });
  document.querySelectorAll('[data-side]').forEach((button) => button.addEventListener('click', () => placePlayer(button.dataset.side)));

  state = startState();
  render();
})();
