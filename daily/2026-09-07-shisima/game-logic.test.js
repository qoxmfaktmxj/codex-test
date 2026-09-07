const assert = require('node:assert/strict');
const Shisima = require('./game-logic.js');

{ const state = Shisima.createState();
  assert.deepEqual(state.board, ['black', 'black', 'black', null, null, null, 'white', 'white', 'white']);
  assert.equal(state.turn, 'white');
}

{ const board = ['black', 'black', 'black', null, null, null, 'white', 'white', 'white'];
  const state = Shisima.createState({ board, turn: 'white' });
  assert.deepEqual(Shisima.getDestinations(state, 7), [4]);
  assert.throws(() => Shisima.move(state, 7, 1), /빈 점/);
}

{ const board = ['black', null, 'black', null, 'white', null, 'white', 'white', 'black'];
  const next = Shisima.move(Shisima.createState({ board, turn: 'white' }), 4, 1);
  assert.equal(next.board[4], null);
  assert.equal(next.board[1], 'white');
  assert.equal(next.turn, 'black');
}

{ const board = ['black', 'black', 'black', 'black', 'white', 'black', 'black', 'black', 'black'];
  const state = Shisima.createState({ board, turn: 'white' });
  assert.equal(Shisima.getStatus(state), 'stuck');
  assert.equal(Shisima.getWinner(state), 'black');
}

{ const board = ['white', 'black', 'black', 'black', 'white', 'white', 'black', null, null];
  const next = Shisima.move(Shisima.createState({ board, turn: 'white' }), 5, 8);
  assert.equal(Shisima.getWinner(next), 'white');
  assert.equal(Shisima.getStatus(next), 'won');
}

{ const board = ['black', 'black', 'black', null, null, null, 'white', 'white', 'white'];
  const state = Shisima.createState({ board, turn: 'white', history: ['blackblackblack---whitewhitewhite:white', 'blackblackblack---whitewhitewhite:white', 'blackblackblack---whitewhitewhite:white'] });
  assert.equal(Shisima.getStatus(state), 'drawn');
  assert.equal(Shisima.getWinner(state), null);
}

{ const board = ['black', null, 'black', null, 'white', null, 'white', 'white', 'black'];
  const state = Shisima.createState({ board, turn: 'white' });
  assert.throws(() => Shisima.move(state, 7, 1), /이웃한 점/);
  assert.throws(() => Shisima.createState({ board: Array(9).fill('red') }), /말판 정보/);
}

console.log('시시마 로직 테스트 통과');
