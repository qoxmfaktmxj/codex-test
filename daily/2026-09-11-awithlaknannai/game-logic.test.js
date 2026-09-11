const assert = require('node:assert/strict');
const Awithlaknannai = require('./game-logic.js');

{ const state = Awithlaknannai.createState();
  assert.equal(state.board.length, 16);
  assert.equal(state.turn, 'sun');
  assert.equal(state.reserve.sun, 6);
  assert.equal(state.phase, 'place');
}

{ const state = Awithlaknannai.createState();
  assert.deepEqual(Awithlaknannai.getLegalMoves(state), Array.from({ length: 16 }, (_, to) => ({ type: 'place', to })));
}

{ const board = ['sun', 'moon', 'sun', 'moon', 'sun', 'moon', 'sun', 'moon', 'sun', 'moon', 'sun', null, null, null, null, null];
  const state = Awithlaknannai.createState({ board, turn: 'sun', reserve: { sun: 0, moon: 1 } });
  assert.deepEqual(Awithlaknannai.getLegalMoves(state), []);
}

{ const state = Awithlaknannai.createState({ board: ['sun', null, null, 'moon', null, null, null, 'moon', null, null, 'sun', 'moon', null, null, null, 'sun'], turn: 'sun', reserve: { sun: 0, moon: 0 } });
  assert.deepEqual(Awithlaknannai.getLegalMoves(state).filter((move) => move.from === 0), [{ type: 'move', from: 0, to: 1 }, { type: 'move', from: 0, to: 4 }]);
}

{ const board = ['sun', null, 'sun', null, 'moon', 'sun', null, 'moon', null, null, null, 'moon', null, null, null, null];
  const linedUp = Awithlaknannai.play(Awithlaknannai.createState({ board, turn: 'sun', reserve: { sun: 0, moon: 0 } }), { type: 'move', from: 5, to: 1 });
  assert.equal(linedUp.board[1], 'sun');
  assert.equal(linedUp.board[5], null);
  assert.equal(linedUp.turn, 'sun');
  assert.deepEqual(Awithlaknannai.getLegalMoves(linedUp), [{ type: 'capture', target: 4 }, { type: 'capture', target: 7 }, { type: 'capture', target: 11 }]);
  const next = Awithlaknannai.play(linedUp, { type: 'capture', target: 7 });
  assert.equal(next.board[7], null);
  assert.equal(next.captures.sun, 1);
  assert.equal(next.turn, 'moon');
}

{ const state = Awithlaknannai.createState({ board: ['sun', 'sun', null, 'moon', null, null, null, 'moon', null, null, null, 'moon', null, null, null, 'sun'], turn: 'sun', reserve: { sun: 0, moon: 0 } });
  assert.throws(() => Awithlaknannai.play(state, { type: 'move', from: 0, to: 2 }), /인접/);
}

{ const state = Awithlaknannai.createState({ board: ['sun', 'sun', 'sun', null, 'moon', 'moon', null, null, null, null, null, null, null, null, null, null], turn: 'moon', reserve: { sun: 0, moon: 0 } });
  assert.equal(Awithlaknannai.getStatus(state), 'finished');
  assert.equal(Awithlaknannai.getWinner(state), 'sun');
}

console.log('아위슬라크난나이 로직 테스트 통과');
