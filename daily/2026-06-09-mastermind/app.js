(() => {
  const {
    COLORS: gameColors,
    COLOR_CLASS: colorMap,
    createGame,
    remainingText,
    resultText,
    setSlot,
    submitGuess,
    STATUS: gameStatus,
  } = window.MastermindLogic;

  const historyEl = document.getElementById('history');
  const currentEl = document.getElementById('current');
  const paletteEl = document.getElementById('palette');
  const remainingEl = document.getElementById('remaining');
  const resultEl = document.getElementById('result');
  const messageEl = document.getElementById('message');
  const submitButton = document.getElementById('submit');
  const resetButton = document.getElementById('reset');

  let game = createGame();
  let activeSlot = 0;

  function colorClass(color) {
    return colorMap[color] || 'empty';
  }

  function renderHistory() {
    historyEl.innerHTML = '';

    if (game.history.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'empty-history';
      empty.textContent = '아직 기록이 없습니다.';
      historyEl.appendChild(empty);
      return;
    }

    game.history.slice().reverse().forEach((entry, index) => {
      const row = document.createElement('div');
      row.className = 'history-row';

      const turn = document.createElement('span');
      turn.className = 'turn';
      turn.textContent = `${game.history.length - index}회`;
      row.appendChild(turn);

      const guess = document.createElement('div');
      guess.className = 'guess';
      entry.guess.forEach((color) => {
        const peg = document.createElement('span');
        peg.className = `peg ${colorClass(color)}`;
        peg.textContent = color;
        guess.appendChild(peg);
      });
      row.appendChild(guess);

      const hints = document.createElement('span');
      hints.className = 'hints';
      hints.textContent = `검정 ${entry.score.exact} · 흰색 ${entry.score.colorOnly}`;
      row.appendChild(hints);

      historyEl.appendChild(row);
    });
  }

  function renderCurrent() {
    currentEl.innerHTML = '';

    game.currentGuess.forEach((color, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `slot ${color ? colorClass(color) : 'empty'}${index === activeSlot ? ' active' : ''}`;
      button.textContent = color || `${index + 1}`;
      button.setAttribute('aria-label', `${index + 1}번 칸`);
      button.addEventListener('click', () => {
        activeSlot = index;
        render();
      });
      currentEl.appendChild(button);
    });
  }

  function renderPalette() {
    paletteEl.innerHTML = '';

    gameColors.forEach((color) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `color-button ${colorClass(color)}`;
      button.textContent = color;
      button.disabled = game.status !== gameStatus.PLAYING;
      button.addEventListener('click', () => {
        game = setSlot(game, activeSlot, color);
        activeSlot = Math.min(activeSlot + 1, game.currentGuess.length - 1);
        render();
      });
      paletteEl.appendChild(button);
    });
  }

  function render() {
    remainingEl.textContent = remainingText(game);
    resultEl.textContent = resultText(game);
    messageEl.textContent = game.message;
    submitButton.disabled = game.status !== gameStatus.PLAYING;
    renderHistory();
    renderCurrent();
    renderPalette();
  }

  submitButton.addEventListener('click', () => {
    const nextGame = submitGuess(game);
    const submitted = nextGame.history.length > game.history.length;
    game = nextGame;
    activeSlot = submitted ? 0 : game.currentGuess.findIndex((color) => color === null);
    if (activeSlot === -1) activeSlot = 0;
    render();
  });

  resetButton.addEventListener('click', () => {
    game = createGame();
    activeSlot = 0;
    render();
  });

  render();
})();
