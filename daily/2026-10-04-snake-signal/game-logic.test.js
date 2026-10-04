const assert=require('assert');
const SnakeSignal=require('./game-logic.js');

let state=SnakeSignal.createState(8);
assert.strictEqual(state.size,8);
assert.deepStrictEqual(state.snake,[27,26,25]);
assert.strictEqual(state.direction,'right');
assert.strictEqual(state.phase,'playing');
assert.throws(()=>SnakeSignal.turn(state,'left'),/반대 방향/);
state=SnakeSignal.turn(state,'down');
assert.strictEqual(state.direction,'down');
state=SnakeSignal.step(state);
assert.deepStrictEqual(state.snake,[35,27,26]);

state={...SnakeSignal.createState(5),snake:[6,5,0],direction:'right',food:7};
state=SnakeSignal.step(state,()=>0.5);
assert.deepStrictEqual(state.snake,[7,6,5,0]);
assert.strictEqual(state.score,1);
assert.notStrictEqual(state.food,7);

state={...SnakeSignal.createState(5),snake:[4,3,2],direction:'right'};
state=SnakeSignal.step(state);
assert.strictEqual(state.phase,'lost');

state={...SnakeSignal.createState(5),snake:[6,7,12,11],direction:'down'};
state=SnakeSignal.step(state);
assert.strictEqual(state.phase,'lost');
console.log('스네이크 신호국 로직 테스트 통과');
