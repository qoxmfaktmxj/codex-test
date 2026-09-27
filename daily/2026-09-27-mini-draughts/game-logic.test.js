const assert=require('assert');
const Draughts=require('./game-logic.js');

let state=Draughts.createState();
assert.strictEqual(state.board.length,6);
assert.strictEqual(state.turn,1);
assert.deepStrictEqual(Draughts.legalMoves(state,1,0),[[2,1]]);

state=Draughts.createState([[0,0,0,0,0,0],[0,0,0,0,0,0],[0,1,0,0,0,0],[0,0,2,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]],1);
assert.deepStrictEqual(Draughts.legalMoves(state,2,1),[[4,3]]);
state=Draughts.move(state,2,1,4,3);
assert.strictEqual(state.board[3][2],0);
assert.strictEqual(state.captured,1);

state=Draughts.createState([[0,0,0,0,0,0],[1,0,0,0,0,0],[0,2,0,0,0,0],[0,0,0,0,0,0],[0,0,0,2,0,0],[0,0,0,0,0,0]],1);
state=Draughts.move(state,1,0,3,2);
assert.strictEqual(state.turn,1);
assert.deepStrictEqual(state.forced,[3,2]);
state=Draughts.move(state,3,2,5,4);
assert.strictEqual(state.board[5][4],3);

state=Draughts.createState([[0,0,0,0,0,0],[0,0,0,0,2,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,1,0,0,0,0]],1);
assert.strictEqual(state.phase,'finished');
assert.strictEqual(state.winner,2);

state=Draughts.createState([[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[1,0,0,0,0,0]],1);
assert.strictEqual(state.phase,'finished');
assert.strictEqual(state.winner,1);
assert.throws(()=>Draughts.move(state,5,0,4,1),/움직일 수 없습니다/);
console.log('미니 다마 로직 테스트 통과');
