const assert = require('node:assert/strict');
const Latrunculi = require('./game-logic.js');

{ const state = Latrunculi.createState();
  assert.equal(state.board.length, 25);
  assert.equal(state.turn, 'white');
  assert.equal(state.board.filter((piece) => piece === 'white').length, 5);
  assert.equal(state.board.filter((piece) => piece === 'black').length, 5);
}

{ const state = Latrunculi.createState();
  assert.deepEqual(Latrunculi.getDestinations(state, 20), [15]);
  assert.deepEqual(Latrunculi.getDestinations(Latrunculi.createState({ turn: 'black' }), 0), [5]);
}

{ const board = Array(25).fill(null);
  board[11] = 'white'; board[12] = 'black'; board[14] = 'white';
  const next = Latrunculi.move(Latrunculi.createState({ board, turn: 'white' }), 14, 13);
  assert.equal(next.board[12], null);
  assert.equal(next.board[13], 'white');
  assert.deepEqual(next.captured, [12]);
  assert.equal(next.turn, 'black');
}

{ const board = Array(25).fill(null);
  board[0] = 'white'; board[1] = 'black'; board[2] = 'white'; board[5] = 'white';
  const state = Latrunculi.createState({ board, turn: 'white' });
  assert.throws(() => Latrunculi.move(state, 0, 1), /빈 칸/);
  assert.throws(() => Latrunculi.move(state, 1, 6), /내 말/);
  assert.throws(() => Latrunculi.move(state, 0, 10), /이웃한/);
}

{ const board = Array(25).fill(null); board[12] = 'white';
  const state = Latrunculi.createState({ board, turn: 'black' });
  assert.equal(Latrunculi.getStatus(state), 'won');
  assert.equal(Latrunculi.getWinner(state), 'white');
}

{ const board = Array(25).fill('white'); board[0] = 'black';
  const state = Latrunculi.createState({ board, turn: 'black' });
  assert.equal(Latrunculi.getStatus(state), 'stuck');
  assert.equal(Latrunculi.getWinner(state), 'white');
}

console.log('라트룬쿨리 로직 테스트 통과');
