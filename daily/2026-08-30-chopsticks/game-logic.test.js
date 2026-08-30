const assert = require('assert');
const Chopsticks = require('./game-logic');

function testStartsWithOneFingerOnEachHand() {
  const state = Chopsticks.createState();
  assert.deepStrictEqual(state.hands, { blue: [1, 1], orange: [1, 1] });
  assert.strictEqual(state.turn, 'blue');
}

function testHitAddsFingersAndWrapsAtFive() {
  const state = Chopsticks.createState({ hands: { blue: [3, 1], orange: [2, 1] }, turn: 'blue' });
  const next = Chopsticks.hit(state, 0, 0);
  assert.deepStrictEqual(next.hands.orange, [0, 1]);
  assert.strictEqual(next.turn, 'orange');
  assert.throws(() => Chopsticks.hit(state, 2, 0), /손/);
  assert.throws(() => Chopsticks.hit(Chopsticks.createState({ hands: { blue: [0, 1], orange: [2, 1] } }), 0, 0), /쓸 수 없는/);
}

function testSplitRedistributesLiveHandsAndChangesTurn() {
  const state = Chopsticks.createState({ hands: { blue: [0, 4], orange: [2, 1] }, turn: 'blue' });
  const next = Chopsticks.split(state, 2, 2);
  assert.deepStrictEqual(next.hands.blue, [2, 2]);
  assert.strictEqual(next.turn, 'orange');
  assert.throws(() => Chopsticks.split(state, 1, 2), /보존/);
  assert.throws(() => Chopsticks.split(state, 0, 4), /1부터 4/);
}

function testDeclaresWinWhenBothOpponentHandsAreDead() {
  assert.strictEqual(Chopsticks.getStatus(Chopsticks.createState({ hands: { blue: [2, 1], orange: [0, 0] } })), 'blue-won');
  assert.strictEqual(Chopsticks.getStatus(Chopsticks.createState({ hands: { blue: [0, 0], orange: [2, 1] } })), 'orange-won');
}

testStartsWithOneFingerOnEachHand();
testHitAddsFingersAndWrapsAtFive();
testSplitRedistributesLiveHandsAndChangesTurn();
testDeclaresWinWhenBothOpponentHandsAreDead();
console.log('젓가락 게임 로직 테스트 통과');
