const assert = require('node:assert/strict');
const Hasami = require('./game-logic.js');

function stateWith(board, turn = 'white') {
  return Hasami.createState({ board, turn });
}

{ const state = Hasami.createState();
  assert.deepEqual(state.board.slice(0, 5), ['black', 'black', 'black', 'black', 'black']);
  assert.deepEqual(state.board.slice(20), ['white', 'white', 'white', 'white', 'white']);
  assert.equal(state.turn, 'white');
}

{ const board = Array(25).fill(null);
  board[20] = 'white'; board[4] = 'black'; board[12] = 'black';
  const state = stateWith(board);
  assert.deepEqual(Hasami.getDestinations(state, 20), [0, 5, 10, 15, 21, 22, 23, 24]);
  assert.throws(() => Hasami.move(state, 20, 4), /빈 칸/);
}

{ const board = Array(25).fill(null);
  board[10] = 'white'; board[12] = 'black'; board[13] = 'black'; board[14] = 'white'; board[24] = 'black';
  const next = Hasami.move(stateWith(board), 10, 11);
  assert.equal(next.board[12], null, '가로로 낀 상대 말은 잡아야 한다');
  assert.equal(next.board[13], null, '연속으로 낀 상대 말은 모두 잡아야 한다');
  assert.equal(next.turn, 'black');
}

{ const board = Array(25).fill(null);
  board[1] = 'white'; board[11] = 'black'; board[16] = 'black'; board[21] = 'white'; board[24] = 'black';
  const next = Hasami.move(stateWith(board), 1, 6);
  assert.equal(next.board[11], null, '세로로 낀 상대 말도 잡아야 한다');
  assert.equal(next.board[16], null);
}

{ const board = Array(25).fill(null);
  board[10] = 'white'; board[12] = 'black'; board[13] = 'black'; board[24] = 'black';
  const next = Hasami.move(stateWith(board), 10, 11);
  assert.equal(next.board[12], 'black', '반대편 내 말이 없으면 잡지 않는다');
}

{ const board = Array(25).fill(null);
  board[10] = 'white'; board[12] = 'black'; board[13] = 'white';
  const next = Hasami.move(stateWith(board), 10, 11);
  assert.equal(Hasami.getWinner(next), 'white');
  assert.equal(Hasami.getStatus(next), 'won');
}

{ const board = Array(25).fill(null);
  board[0] = 'white'; board[1] = 'black'; board[5] = 'black';
  assert.equal(Hasami.getStatus(stateWith(board)), 'stuck');
}

console.log('미니 하사미 장기 로직 테스트 통과');
