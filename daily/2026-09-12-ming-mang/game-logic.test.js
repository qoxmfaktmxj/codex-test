const assert = require('node:assert/strict');
const MingMang = require('./game-logic.js');

{ const state = MingMang.createState();
  assert.deepEqual(state.board, ['red', 'red', 'red', null, null, null, 'blue', 'blue', 'blue']);
  assert.equal(state.turn, 'red');
}

{ const state = MingMang.createState();
  assert.deepEqual(MingMang.getLegalMoves(state), [
    { from: 0, to: 3 }, { from: 1, to: 4 }, { from: 2, to: 5 },
  ]);
}

{ const state = MingMang.createState({ board: [null, 'blue', 'red', 'red', null, null, null, null, null], turn: 'red' });
  const next = MingMang.play(state, { from: 3, to: 0 });
  assert.equal(next.board[0], 'red');
  assert.equal(next.board[2], 'red');
  assert.equal(next.captures.red, 1);
  assert.equal(next.turn, 'blue');
}

{ const state = MingMang.createState();
  const next = MingMang.play(state, { from: 1, to: 4 });
  assert.equal(next.board[1], null);
  assert.equal(next.board[4], 'red');
  assert.equal(next.captures.red, 0);
}

{ const state = MingMang.createState({ board: ['red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'blue'], turn: 'blue' });
  assert.equal(MingMang.getStatus(state), 'finished');
  assert.equal(MingMang.getWinner(state), 'red');
}

{ const state = MingMang.createState({ board: ['red', 'blue', null, null, null, null, null, null, null], turn: 'red' });
  assert.throws(() => MingMang.play(state, { from: 0, to: 2 }), /인접/);
}

console.log('밍망 로직 테스트 통과');
