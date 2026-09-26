const assert=require('assert');
const Alquerque=require('./game-logic.js');

let state=Alquerque.createState();
assert.strictEqual(state.board.length,5);
assert.strictEqual(state.turn,1);
assert.deepStrictEqual(Alquerque.legalMoves(state,2,0),[[2,1]]);

state=Alquerque.move(state,2,0,2,1);
assert.strictEqual(state.board[2][0],0);
assert.strictEqual(state.board[2][1],1);
assert.strictEqual(state.turn,2);

state=Alquerque.createState([[0,0,0,0,0],[0,0,0,0,0],[1,2,0,0,0],[0,0,0,0,0],[0,0,0,0,0]],1);
assert.deepStrictEqual(Alquerque.legalMoves(state,2,0),[[2,2]]);
state=Alquerque.move(state,2,0,2,2);
assert.strictEqual(state.board[2][1],0);
assert.strictEqual(state.captured,1);
assert.throws(()=>Alquerque.move(state,2,2,2,3),/움직일 수 없습니다/);

state=Alquerque.createState([[1,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0],[0,0,0,0,0]],1);
assert.strictEqual(state.phase,'finished');
assert.strictEqual(state.winner,1);
console.log('알케르케 로직 테스트 통과');
