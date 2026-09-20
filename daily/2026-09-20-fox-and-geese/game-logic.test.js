const {test}=require('node:test');
const assert=require('node:assert/strict');
const G=require('./game-logic.js');
test('여우와 거위의 시작 배치와 차례',()=>{const s=G.createState();assert.equal(s.turn,'geese');assert.equal(s.fox,'3,0');assert.equal(s.geese.size,12);});
test('거위는 아래·가로로 한 칸, 여우는 어느 방향으로 한 칸 움직인다',()=>{let s=G.createState();s=G.move(s,'0,2','0,3');assert.equal(s.turn,'fox');s=G.move(s,'3,0','3,1');assert.equal(s.fox,'3,1');});
test('여우는 인접한 거위를 넘어 빈칸에 착지해 잡는다',()=>{let s=G.createState();s={...s,turn:'fox',fox:'3,2',geese:new Set(['3,3','2,4'])};s=G.move(s,'3,2','3,4');assert.equal(s.fox,'3,4');assert.equal(s.geese.has('3,3'),false);assert.equal(s.captured,1);});
test('불가능한 이동과 다른 말 선택은 거부한다',()=>{const s=G.createState();assert.throws(()=>G.move(s,'3,0','3,2'));assert.throws(()=>G.move(s,'2,2','2,1'));});
test('여우가 네 마리를 잡으면 끝난다',()=>{let s=G.createState();s={...s,turn:'fox',fox:'3,2',geese:new Set(['3,3']),captured:3};s=G.move(s,'3,2','3,4');assert.equal(s.phase,'finished');assert.equal(s.winner,'fox');});
