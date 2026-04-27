const CHOICES = ['rock', 'paper', 'scissors'];

const WINNING_CHOICES = {
  rock: 'scissors',
  paper: 'rock',
  scissors: 'paper',
};

function createGame() {
  return {
    score: {
      player: 0,
      computer: 0,
    },
    playerChoice: null,
    computerChoice: null,
    result: null,
  };
}

function isChoice(choice) {
  return CHOICES.includes(choice);
}

function getResult(playerChoice, computerChoice) {
  if (playerChoice === computerChoice) {
    return 'draw';
  }

  return WINNING_CHOICES[playerChoice] === computerChoice ? 'win' : 'lose';
}

function playRound(game, playerChoice, chooseComputer) {
  if (!isChoice(playerChoice)) {
    return game;
  }

  const computerChoice = chooseComputer();
  if (!isChoice(computerChoice)) {
    return game;
  }

  const result = getResult(playerChoice, computerChoice);
  const score = {
    player: game.score.player + (result === 'win' ? 1 : 0),
    computer: game.score.computer + (result === 'lose' ? 1 : 0),
  };

  return {
    score,
    playerChoice,
    computerChoice,
    result,
  };
}

const gameLogic = {
  CHOICES,
  createGame,
  playRound,
};

if (typeof module !== 'undefined') {
  module.exports = gameLogic;
}

if (typeof window !== 'undefined') {
  window.gameLogic = gameLogic;
}
