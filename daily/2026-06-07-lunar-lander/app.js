(() => {
  const logic = window.LunarLanderLogic;
  const statusElement = document.getElementById('status');
  const resultElement = document.getElementById('result');
  const landerElement = document.getElementById('lander');
  const flameElement = document.getElementById('flame');
  const thrustElement = document.getElementById('thrust');
  const timerElement = document.getElementById('timer');
  const messageElement = document.getElementById('message');
  const thrustButton = document.getElementById('thrust-button');
  const resetButton = document.getElementById('reset');

  let game = logic.createGame();
  let thrusting = false;
  let timer = null;

  function render() {
    const top = 12 + ((150 - game.altitude) / 150) * 250;
    landerElement.style.transform = `translate(-50%, ${top}px)`;
    flameElement.classList.toggle('active', game.thrusting);
    statusElement.textContent = logic.statusText(game);
    resultElement.textContent = logic.resultText(game);
    thrustElement.textContent = logic.thrustText(game.thrusting);
    timerElement.textContent = `${game.seconds}초`;
    messageElement.textContent = game.message;
    thrustButton.disabled = game.status !== 'playing';
    document.body.dataset.status = game.status;
  }

  function tick() {
    game = logic.stepGame(game, thrusting);
    render();
    if (game.status !== 'playing') {
      clearInterval(timer);
      timer = null;
    }
  }

  function startTimer() {
    if (!timer) timer = setInterval(tick, 180);
  }

  function setThrust(value) {
    thrusting = value;
    startTimer();
  }

  thrustButton.addEventListener('pointerdown', () => setThrust(true));
  thrustButton.addEventListener('pointerup', () => setThrust(false));
  thrustButton.addEventListener('pointerleave', () => setThrust(false));
  thrustButton.addEventListener('touchend', () => setThrust(false));

  window.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
      event.preventDefault();
      setThrust(true);
    }
  });

  window.addEventListener('keyup', (event) => {
    if (event.code === 'Space') {
      event.preventDefault();
      setThrust(false);
    }
  });

  resetButton.addEventListener('click', () => {
    clearInterval(timer);
    timer = null;
    thrusting = false;
    game = logic.createGame();
    render();
  });

  render();
  startTimer();
})();
