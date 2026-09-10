const assert = require('node:assert/strict');
const Fanorona = require('./game-logic.js');

{ const state = Fanorona.createState();
  assert.equal(state.board.length, 25);
  assert.equal(state.board[12], null);
  assert.equal(state.turn, 'white');
}

{ assert.deepEqual(Fanorona.neighbors(12), [6, 7, 8, 11, 13, 16, 17, 18]);
  assert.deepEqual(Fanorona.neighbors(1), [0, 2, 6]);
}

{ const board = [null, null, null, null, null, null, null, null, null, null, 'white', null, 'black', 'black', null, null, null, null, null, null, null, null, null, null, null];
  const state = Fanorona.createState({ board, turn: 'white' });
  assert.deepEqual(Fanorona.getLegalMoves(state), [{ from: 10, to: 11, mode: 'approach', captured: [12, 13] }]);
}

{ const board = [null, null, null, null, null, null, null, null, null, null, 'black', 'white', null, null, null, 'black', null, null, null, null, null, null, null, null, null];
  const state = Fanorona.createState({ board, turn: 'white' });
  assert.deepEqual(Fanorona.getLegalMoves(state), [{ from: 11, to: 12, mode: 'withdrawal', captured: [10] }]);
}

{ const board = [null, null, null, null, null, null, null, null, null, null, 'white', null, null, null, null, null, null, null, null, null, null, null, null, null, null];
  const state = Fanorona.createState({ board, turn: 'white' });
  assert.deepEqual(Fanorona.getLegalMoves(state).map(({ from, to }) => ({ from, to })), [{ from: 10, to: 5 }, { from: 10, to: 6 }, { from: 10, to: 11 }, { from: 10, to: 15 }, { from: 10, to: 16 }]);
}

{ const board = [null, null, null, null, null, null, null, null, null, null, 'white', null, 'black', 'black', null, null, null, null, null, null, null, null, null, null, null];
  const next = Fanorona.move(Fanorona.createState({ board, turn: 'white' }), 10, 11);
  assert.equal(next.board[10], null);
  assert.equal(next.board[11], 'white');
  assert.equal(next.board[12], null);
  assert.equal(next.board[13], null);
  assert.equal(next.turn, 'black');
  assert.equal(Fanorona.getWinner(next), 'white');
}

{ const board = [null, 'black', null, null, null, null, null, null, null, null, 'black', null, 'white', null, null, null, null, null, null, null, null, null, null, null, null];
  const first = Fanorona.move(Fanorona.createState({ board, turn: 'white' }), 12, 11);
  assert.equal(first.turn, 'white');
  assert.equal(first.chainFrom, 11);
  assert.deepEqual(Fanorona.getLegalMoves(first), [{ from: 11, to: 6, mode: 'approach', captured: [1] }]);
  const last = Fanorona.move(first, 11, 6);
  assert.equal(last.turn, 'black');
  assert.equal(last.chainFrom, null);
  assert.equal(Fanorona.getWinner(last), 'white');
}

{ const state = Fanorona.createState({ board: Array(25).fill('black'), turn: 'white' });
  assert.equal(Fanorona.getStatus(state), 'finished');
  assert.equal(Fanorona.getWinner(state), 'black');
  assert.throws(() => Fanorona.move(state, 0, 1), /이미 끝난/);
}

console.log('미니 파노로나 로직 테스트 통과');
