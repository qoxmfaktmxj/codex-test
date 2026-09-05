const assert = require('node:assert/strict');
const Seega = require('./game-logic.js');

function stateWith(board, turn = 'sand', phase = 'moving') {
  return Seega.createState({ board, turn, phase, placed: { sand: 12, ink: 12 } });
}

{ const state = Seega.createState();
  assert.equal(state.phase, 'placing');
  assert.equal(state.board[12], null, '가운데 칸은 놓기 단계에서 비어 있어야 한다');
  assert.equal(Seega.getPlacements(state).includes(12), false);
}

{ let state = Seega.createState();
  state = Seega.place(state, 0);
  assert.equal(state.board[0], 'sand');
  assert.equal(state.turn, 'sand');
  state = Seega.place(state, 1);
  assert.equal(state.turn, 'ink');
  assert.throws(() => Seega.place(state, 0), /빈 칸/);
}

{ const board = Array(25).fill(null);
  board[0] = 'sand'; board[7] = 'sand'; board[23] = 'ink'; board[24] = 'ink';
  const state = Seega.createState({ board, turn: 'sand', phase: 'moving', placed: { sand: 12, ink: 12 }, forceCenter: true });
  assert.deepEqual(Seega.getDestinations(state, 7), [12], '첫 이동은 가운데 칸으로만 해야 한다');
  const next = Seega.move(state, 7, 12);
  assert.equal(next.forceCenter, false);
  assert.equal(next.turn, 'ink');
}

{ const board = Array(25).fill(null);
  board[5] = 'sand'; board[7] = 'ink'; board[8] = 'sand';
  board[15] = 'sand'; board[17] = 'ink'; board[18] = 'sand'; board[24] = 'ink';
  const next = Seega.move(stateWith(board), 5, 6);
  assert.equal(next.turn, 'sand', '잡은 뒤 다시 잡을 수 있으면 같은 차례를 이어야 한다');
}

{ const board = Array(25).fill(null);
  board[5] = 'sand'; board[7] = 'ink'; board[8] = 'sand';
  const next = Seega.move(stateWith(board), 5, 6);
  assert.equal(next.board[7], null, '양쪽으로 끼인 상대 말은 잡아야 한다');
  assert.equal(next.board[6], 'sand');
}

{ const board = Array(25).fill(null);
  board[5] = 'sand'; board[11] = 'ink'; board[16] = 'sand';
  const next = Seega.move(stateWith(board), 5, 6);
  assert.equal(next.board[11], null, '세로로 끼인 상대 말도 잡아야 한다');
}

{ const board = Array(25).fill(null);
  board[11] = 'sand'; board[12] = 'ink'; board[13] = 'sand';
  const next = Seega.move(stateWith(board), 11, 6);
  assert.equal(next.board[12], 'ink', '가운데 칸의 말은 잡히지 않는다');
}

{ const board = Array(25).fill(null);
  board[0] = 'sand'; board[24] = 'ink';
  const state = stateWith(board);
  assert.deepEqual(Seega.getDestinations(state, 0), [1, 5]);
  assert.throws(() => Seega.move(state, 0, 6), /인접/);
}

{ const board = Array(25).fill(null);
  board[0] = 'sand'; board[24] = 'ink';
  assert.equal(Seega.getWinner(stateWith(board)), 'sand');
  assert.equal(Seega.getStatus(stateWith(board)), 'won');
}

console.log('시가 로직 테스트 통과');
