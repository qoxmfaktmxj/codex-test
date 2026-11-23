const assert=require('node:assert/strict');
const {createGame,place,select,move,removePiece,resetGame,players}=require('./game-logic');

let game=createGame();
assert.equal(game.turn,players[0]);
assert.equal(game.phase,'배치');
assert.equal(game.board.length,24);
game=place(game,0);
assert.equal(game.board[0],players[0]);
assert.equal(game.turn,players[1]);
assert.equal(place(game,0).message,'이미 유리말이 있습니다');

const almostMill={...createGame(),board:[players[0],players[0],null,...Array(21).fill(null)],placed:{[players[0]]:2,[players[1]]:2},turn:players[0]};
game=place(almostMill,2);
assert.equal(game.pendingRemove,true);
assert.equal(game.turn,players[0]);
game=removePiece({...game,board:[players[0],players[0],players[0],players[1],...Array(20).fill(null)]},3);
assert.equal(game.board[3],null);
assert.equal(game.turn,players[1]);
const protectedPiece={...createGame(),pendingRemove:true,turn:players[0],board:[players[0],players[0],players[0],players[1],players[1],players[1],players[1],...Array(17).fill(null)]};
assert.equal(removePiece(protectedPiece,3).message,'줄 밖의 상대 유리말을 먼저 고르세요');
assert.equal(removePiece(protectedPiece,6).board[6],null);

const moving={...createGame(),phase:'이동',board:[players[0],null,null,players[1],null,null,null,null,null,players[0],null,null,players[1],null,null,null,players[0],null,players[0],null,null,players[1],null,null],placed:{[players[0]]:9,[players[1]]:9},turn:players[0]};
assert.equal(select(moving,0).selected,0);
assert.equal(select(moving,3).message,'내 유리말을 고르세요');
game=move(select(moving,0),1);
assert.equal(game.board[0],null);
assert.equal(game.board[1],players[0]);
assert.equal(game.turn,players[1]);
assert.equal(move(select(moving,0),2).message,'연결된 빈 자리로만 움직입니다');
const flying={...moving,board:[players[0],null,null,players[1],null,null,null,null,null,players[0],null,null,players[1],null,null,null,null,null,players[0],null,null,players[1],null,null]};
assert.equal(move(select(flying,0),23).board[23],players[0]);
assert.deepEqual(resetGame(),createGame());
console.log('나인 맨즈 모리스 유리 회랑 로직 테스트 통과');
