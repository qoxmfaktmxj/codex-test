const assert=require('assert');
const Kalaha=require('./game-logic.js');

let state=Kalaha.createState();
assert.deepStrictEqual(state.pits,[4,4,4,4,4,4,0,4,4,4,4,4,4,0]);
assert.strictEqual(state.turn,1);

state=Kalaha.move(state,2);
assert.deepStrictEqual(state.pits,[4,4,0,5,5,5,1,4,4,4,4,4,4,0]);
assert.strictEqual(state.turn,1);

state=Kalaha.createState([0,0,0,0,0,1,10,4,4,4,4,4,4,0],1);
state=Kalaha.move(state,5);
assert.strictEqual(state.pits[6],11);
assert.strictEqual(state.turn,1);

state=Kalaha.createState([0,0,1,0,0,0,0,4,4,4,4,4,4,0],1);
state=Kalaha.move(state,2);
assert.strictEqual(state.pits[3],0);
assert.strictEqual(state.pits[9],0);
assert.strictEqual(state.pits[6],5);

state=Kalaha.createState([0,0,1,0,0,0,20,4,4,4,4,4,4,0],1);
state=Kalaha.move(state,2);
assert.strictEqual(state.phase,'finished');
assert.strictEqual(state.winner,1);
assert.throws(()=>Kalaha.move(state,0),/고를 수 없습니다/);
console.log('칼라하 로직 테스트 통과');
