const assert=require('node:assert/strict');const {createGame,play,resetGame}=require('./game-logic');
let g=createGame();assert.deepEqual(g.pits,Array(12).fill(4));assert.equal(g.turn,'남색');
g=play(g,0);assert.deepEqual(g.pits.slice(0,5),[0,5,5,5,5]);assert.equal(g.turn,'주홍');
const capture=play({...createGame(),turn:'남색',pits:[6,0,0,0,0,0,1,1,0,0,0,0]},0);assert.equal(capture.score.남색,2);assert.equal(capture.pits[6],0);
const noStarve=play({...createGame(),turn:'남색',pits:[6,0,0,0,0,0,1,0,0,0,0,0]},0);assert.equal(noStarve.pits[6],2);
const mustFeed=play({...createGame(),turn:'남색',pits:[1,0,0,0,0,0,0,0,0,0,0,0]},0);assert.equal(mustFeed.winner,'남색');
assert.deepEqual(play(createGame(),7),createGame());assert.deepEqual(resetGame(),createGame());console.log('오와레 베틀 로직 테스트 통과');
