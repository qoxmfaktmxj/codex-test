(() => {
  const WIDTH = 12;
  const HEIGHT = 12;
  const boardElement = document.querySelector('#board');
  const generationElement = document.querySelector('#generation');
  const messageElement = document.querySelector('#message');
  const nextButton = document.querySelector('#next');
  const playButton = document.querySelector('#play');
  let board = LifeGame.createBoard(WIDTH, HEIGHT);
  let generation = 0;
  let timer = null;

  function aliveCount() {
    return board.flat().filter(Boolean).length;
  }

  function render() {
    boardElement.replaceChildren();
    board.forEach((row, y) => row.forEach((alive, x) => {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = `cell${alive ? ' alive' : ''}`;
      cell.setAttribute('aria-label', `${y + 1}행 ${x + 1}열 ${alive ? '살아 있음' : '비어 있음'}`);
      cell.addEventListener('click', () => {
        stop();
        board = LifeGame.toggleCell(board, x, y);
        messageElement.textContent = `현재 ${aliveCount()}개의 생명이 있습니다.`;
        render();
      });
      boardElement.append(cell);
    }));
    generationElement.textContent = generation;
  }

  function advance() {
    board = LifeGame.nextGeneration(board);
    generation += 1;
    messageElement.textContent = `${generation}세대: ${aliveCount()}개의 생명이 살아 있습니다.`;
    render();
  }

  function stop() {
    if (!timer) return;
    window.clearInterval(timer);
    timer = null;
    playButton.textContent = '자동 진행';
  }

  nextButton.addEventListener('click', () => {
    stop();
    advance();
  });
  playButton.addEventListener('click', () => {
    if (timer) {
      stop();
      return;
    }
    timer = window.setInterval(advance, 650);
    playButton.textContent = '멈추기';
  });
  document.querySelector('#clear').addEventListener('click', () => {
    stop();
    board = LifeGame.clearBoard(board);
    generation = 0;
    messageElement.textContent = '보드를 비웠습니다. 새 무늬를 만들어 보세요.';
    render();
  });
  document.querySelector('#sample').addEventListener('click', () => {
    stop();
    board = LifeGame.createBoard(WIDTH, HEIGHT);
    [[5, 4], [6, 5], [4, 6], [5, 6], [6, 6]].forEach(([x, y]) => { board = LifeGame.toggleCell(board, x, y); });
    generation = 0;
    messageElement.textContent = '글라이더 무늬를 준비했습니다. 자동 진행을 눌러 보세요.';
    render();
  });
  render();
}());
