const assert=require('assert');
const Nim=require('./game-logic.js');

let state=Nim.createState();
assert.deepStrictEqual(state.piles,[3,5,7]);
assert.strictEqual(state.turn,'human');
assert.strictEqual(Nim.isLegalMove(state,1,3),true);
assert.strictEqual(Nim.isLegalMove(state,1,0),false);
assert.strictEqual(Nim.isLegalMove(state,3,1),false);

state=Nim.take(state,0,2);
assert.deepStrictEqual(state.piles,[1,5,7]);
assert.strictEqual(state.turn,'computer');
assert.throws(()=>Nim.take(state,0,2),/가져갈 수 없습니다/);

const answer=Nim.computerMove({piles:[1,3,5],turn:'computer',phase:'playing',winner:null});
assert.deepStrictEqual(answer.move,{pile:2,count:3});
assert.deepStrictEqual(answer.state.piles,[1,3,2]);
assert.strictEqual(answer.state.turn,'human');

const finish=Nim.take({piles:[0,0,1],turn:'human',phase:'playing',winner:null},2,1);
assert.strictEqual(finish.phase,'finished');
assert.strictEqual(finish.winner,'human');
console.log('님 로직 테스트 통과');
