const assert = require('node:assert/strict');
const UmulGonu = require('./game-logic.js');

{ const state = UmulGonu.createState();
  assert.deepEqual(state.board, ['black', 'black', 'black', null, null, null, 'white', 'white', 'white']);
  assert.equal(state.turn, 'white');
}

{ const state = UmulGonu.createState();
  assert.deepEqual(UmulGonu.getDestinations(state, 6), [3, 4]);
  assert.deepEqual(UmulGonu.getDestinations(state, 7), [4]);
}

{ const next = UmulGonu.move(UmulGonu.createState(), 7, 4);
  assert.equal(next.board[7], null);
  assert.equal(next.board[4], 'white');
  assert.equal(next.turn, 'black');
}

{ const state = UmulGonu.createState();
  const distant = UmulGonu.createState({ board: [null, 'black', 'black', null, null, null, 'white', 'white', 'white'] });
  assert.throws(() => UmulGonu.move(distant, 8, 0), /이웃한/);
  assert.throws(() => UmulGonu.move(state, 7, 3), /이웃한/);
  assert.throws(() => UmulGonu.move(state, 0, 3), /내 말/);
  assert.throws(() => UmulGonu.move(state, 6, 7), /빈 칸/);
}

{ const board = ['black', 'black', 'black', 'black', 'black', 'black', 'black', 'black', 'white'];
  const state = UmulGonu.createState({ board, turn: 'white' });
  assert.equal(UmulGonu.getStatus(state), 'stuck');
  assert.equal(UmulGonu.getWinner(state), 'black');
}

console.log('우물고누 로직 테스트 통과');
