const assert=require('assert');
const Fifteen=require('./game-logic.js');

let state=Fifteen.createState([1,2,3,4,5,6,7,8,9,10,11,12,13,14,0,15]);
assert.strictEqual(state.phase,'playing');
assert.strictEqual(Fifteen.isLegalMove(state,15),true);
assert.strictEqual(Fifteen.isLegalMove(state,0),false);
assert.strictEqual(Fifteen.isLegalMove(Fifteen.createState([1,2,3,0,4,5,6,7,8,9,10,11,12,13,14,15]),4),false);
state=Fifteen.play(state,15);
assert.deepStrictEqual(state.board,[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0]);
assert.strictEqual(state.phase,'finished');
assert.throws(()=>Fifteen.play(state,14),/움직일 수 없습니다/);

const shuffled=Fifteen.shuffle(()=>0.4);
assert.strictEqual(shuffled.length,16);
assert.strictEqual(new Set(shuffled).size,16);
assert.strictEqual(Fifteen.isSolvable(shuffled),true);
assert.strictEqual(Fifteen.isSolvable([2,1,3,4,5,6,7,8,9,10,11,12,13,14,15,0]),false);
assert.strictEqual(Fifteen.isSolved(shuffled),false);
assert.strictEqual(Fifteen.isSolved([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0]),true);
console.log('열다섯 로직 테스트 통과');
