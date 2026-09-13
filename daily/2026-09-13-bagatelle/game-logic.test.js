const assert = require('node:assert/strict');
const Bagatelle = require('./game-logic.js');

{ const state = Bagatelle.createState();
  assert.equal(state.shots, 0);
  assert.equal(state.score, 0);
  assert.equal(state.remaining, 5);
}

{ const state = Bagatelle.createState();
  const next = Bagatelle.play(state, 50);
  assert.equal(next.shots, 1);
  assert.equal(next.score, 50);
  assert.equal(next.remaining, 4);
}

{ const state = Bagatelle.createState({ shots: 4, score: 170 });
  const next = Bagatelle.play(state, 100);
  assert.equal(next.score, 270);
  assert.equal(Bagatelle.getStatus(next), 'finished');
}

{ const state = Bagatelle.createState();
  assert.throws(() => Bagatelle.play(state, 35), /점수 칸/);
}

{ const state = Bagatelle.createState({ shots: 5, score: 100 });
  assert.throws(() => Bagatelle.play(state, 10), /모두 사용/);
}

console.log('바가텔 로직 테스트 통과');
