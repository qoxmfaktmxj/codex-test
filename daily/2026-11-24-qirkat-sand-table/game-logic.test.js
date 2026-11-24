const assert=require('node:assert/strict');
const {createGame,select,move,resetGame,players}=require('./game-logic');

let game=createGame();
assert.equal(game.board.length,25);
assert.equal(game.turn,players[0]);
assert.equal(game.board.filter(x=>x===players[0]).length,10);
assert.equal(game.board.filter(x=>x===players[1]).length,10);

game=select(game,15);
assert.equal(game.selected,15);
game=move(game,10);
assert.equal(game.board[10],players[0]);
assert.equal(game.board[15],null);
assert.equal(game.turn,players[1]);
const backward={...createGame(),board:[...Array(25)].fill(null).map((_,i)=>i===15?players[0]:null)};
assert.equal(move(select(backward,15),20).message,'이웃한 선으로만 움직일 수 있습니다');

const capture={...createGame(),turn:players[0],board:[null,null,null,null,null,null,null,null,null,null,players[1],null,null,null,null,players[0],null,players[1],null,null,null,null,null,null,null]};
game=move(select(capture,15),5);
assert.equal(game.board[5],players[0]);
assert.equal(game.board[10],null);
assert.equal(game.board[15],null);
assert.equal(game.captured[players[0]],1);

const mustCapture={...createGame(),turn:players[0],board:[null,null,null,null,null,null,null,null,null,null,players[1],null,null,null,null,players[0],null,players[1],null,null,null,null,null,null,null]};
assert.equal(move(select(mustCapture,15),14).message,'잡을 수 있을 때는 반드시 뛰어넘어야 합니다');
const chained={...createGame(),turn:players[0],board:[players[0],null,null,null,null,null,null,null,null,null,null,null,null,null,null,players[0],players[1],null,players[1],null,null,null,null,null,null]};
game=move(select(chained,15),17);
assert.equal(game.chain,true);
assert.equal(select(game,0).message,'같은 안료 조각으로 계속 뛰어넘으세요');
assert.deepEqual(resetGame(),createGame());
console.log('키르캇 모래 탁자 로직 테스트 통과');
