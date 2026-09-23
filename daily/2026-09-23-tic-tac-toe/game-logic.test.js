const assert=require('assert');
const TicTacToe=require('./game-logic.js');

let state=TicTacToe.createState();
assert.deepStrictEqual(state.board,Array(9).fill(null));
assert.strictEqual(state.turn,'X');
assert.strictEqual(TicTacToe.isLegalMove(state,0),true);
assert.strictEqual(TicTacToe.isLegalMove(state,9),false);

state=TicTacToe.play(state,0);
assert.strictEqual(state.board[0],'X');
assert.strictEqual(state.turn,'O');
assert.throws(()=>TicTacToe.play(state,0),/놓을 수 없습니다/);

let win=TicTacToe.createState();
for(const cell of [0,3,1,4,2]) win=TicTacToe.play(win,cell);
assert.strictEqual(win.phase,'finished');
assert.strictEqual(win.winner,'X');

const draw={board:['X','O','X','X','O','O','O','X',null],turn:'X',phase:'playing',winner:null};
const finished=TicTacToe.play(draw,8);
assert.strictEqual(finished.phase,'finished');
assert.strictEqual(finished.winner,'draw');
console.log('삼목 로직 테스트 통과');
