const assert=require('assert');
const Four=require('./game-logic.js');

let state=Four.createState();
assert.strictEqual(state.board.length,6);
assert.strictEqual(state.turn,1);
assert.strictEqual(Four.isLegalMove(state,0),true);
state=Four.play(state,0);
assert.strictEqual(state.board[5][0],1);
assert.strictEqual(state.turn,2);
assert.throws(()=>Four.play(state,9),/열을 고를 수 없습니다/);

state=Four.createState();
[0,6,1,6,2,6,3].forEach(column=>{state=Four.play(state,column);});
assert.strictEqual(state.phase,'finished');
assert.strictEqual(state.winner,1);
assert.deepStrictEqual(state.winningCells,[[5,0],[5,1],[5,2],[5,3]]);
assert.throws(()=>Four.play(state,4),/끝난 판입니다/);

state=Four.createState([[1,1,2,2,1,1,2],[2,2,1,1,2,2,1],[1,1,2,2,1,1,2],[2,2,1,1,2,2,1],[1,1,2,2,1,1,2],[2,2,1,1,2,2,1]]);
assert.strictEqual(state.phase,'draw');
assert.strictEqual(Four.isLegalMove(state,0),false);
console.log('사목 로직 테스트 통과');
