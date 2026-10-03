const assert=require('assert');
const AtariGo=require('./game-logic.js');

let state=AtariGo.createState(5);
assert.strictEqual(state.phase,'playing');
assert.strictEqual(state.board.length,25);
state=AtariGo.place(state,12);
assert.strictEqual(state.board[12],1);
assert.strictEqual(state.turn,2);
assert.throws(()=>AtariGo.place(state,12),/이미 돌/);
state=AtariGo.createState(3);
state={...state,board:[0,1,0,1,2,1,0,0,0],turn:1};
state=AtariGo.place(state,7); // 흑: 백 4 포획
assert.strictEqual(state.phase,'won');
assert.strictEqual(state.winner,1);
assert.strictEqual(state.board[4],0);
state=AtariGo.createState(3);
state={...state,board:[0,2,0,2,0,2,0,2,0],turn:1};
assert.throws(()=>AtariGo.place(state,4),/자살수/);
console.log('아타리고 로직 테스트 통과');
