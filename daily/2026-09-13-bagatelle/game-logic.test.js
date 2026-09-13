const {test}=require('node:test');
const assert=require('node:assert/strict');
const G=require('./game-logic.js');
function finish(power){let s=G.launch(G.createState(),power);for(let i=0;i<7200&&s.phase==='rolling';i++){s=G.step(s);assert.ok(Object.values(s.ball).every(Number.isFinite));assert.ok(s.ball.x>=8&&s.ball.x<=472,`세기 ${power}: x=${s.ball.x}`);assert.ok(s.ball.y>=8&&s.ball.y<=700,`세기 ${power}: y=${s.ball.y}`);}return s;}
test('다섯 공과 빈 점수표로 시작한다',()=>{assert.equal(G.createState().remaining,5);assert.deepEqual(G.createState().history,[]);assert.equal(G.createState().phase,'ready');});
test('발사는 공 하나만 소비하고 실제 위쪽 속도를 부여한다',()=>{const before=G.createState(),s=G.launch(before,60);assert.equal(s.remaining,4);assert.ok(s.ball.vy<0);assert.equal(before.remaining,5);assert.equal(s.score,0);assert.throws(()=>G.launch(s,60));});
test('잘못된 발사 세기와 시간 간격을 거부한다',()=>{for(const p of [NaN,Infinity,19,101,'50'])assert.throws(()=>G.launch(G.createState(),p));for(const dt of [0,-1,NaN,0.5])assert.throws(()=>G.step(G.createState(),dt));});
test('중력은 속도를 바꾸며 스텝은 원본을 변형하지 않는다',()=>{const s=G.launch(G.createState(),60),n=G.step(s);assert.ok(n.ball.vy>s.ball.vy);assert.ok(n.ball.y<s.ball.y);assert.equal(s.ball.y,630);});
test('못 충돌은 공을 바깥으로 밀고 입사 속도를 반사한다',()=>{const b=G.collidePeg({x:103,y:100,vx:-80,vy:0},{x:100,y:100,r:5});assert.ok(b.x>=113);assert.ok(b.vx>0);});
test('못 정중앙의 충돌도 유한한 상태로 복구한다',()=>{const b=G.collidePeg({x:100,y:100,vx:0,vy:0},{x:100,y:100,r:5});assert.ok(Object.values(b).every(Number.isFinite));assert.ok(Math.hypot(b.x-100,b.y-100)>=13);});
test('경사진 가이드가 위로 쏜 공을 왼쪽으로 반사한다',()=>{const b=G.collideWall({x:444,y:74,vx:0,vy:-500},{ax:420,ay:18,bx:464,by:100});assert.ok(b.vx<0);});
test('우측 발사대로 돌아온 공은 영점으로 종료한다',()=>{let s=G.launch(G.createState(),60);s.ball={x:442,y:681,vx:0,vy:200};s=G.step(s);assert.equal(s.phase,'ready');assert.equal(s.score,0);assert.deepEqual(s.history,[0]);});
test('실제 도착 홈의 점수만 한 번 더한다',()=>{let s=G.launch(G.createState(),60);s.ball={x:220,y:681,vx:0,vy:120};s=G.step(s);assert.equal(s.score,100);assert.deepEqual(s.history,[100]);assert.deepEqual(G.step(s),s);});
test('공 다섯 개 뒤 종료하며 새 판은 독립적이다',()=>{let s=G.createState();for(let i=0;i<5;i++){s=G.launch(s,60);s.ball={x:220,y:681,vx:0,vy:120};s=G.step(s);}assert.equal(s.phase,'finished');assert.equal(s.score,500);assert.throws(()=>G.launch(s,60));assert.equal(G.createState().score,0);});
test('모든 정수 세기가 경계 내에서 유한 시간 종료한다',()=>{const scores=new Set();for(let p=20;p<=100;p++){const s=finish(p);assert.notEqual(s.phase,'rolling',`세기 ${p}`);assert.equal(s.history.length,1);assert.ok([0,...G.SCORES].includes(s.score));assert.ok(s.ball.x>=8&&s.ball.x<=472);assert.ok(Number.isFinite(s.ball.y));scores.add(s.score);}assert.ok(scores.size>=3);});
test('같은 세기는 같은 물리 결과이며 전 과정 순간이동이 없다',()=>{assert.deepEqual(finish(55),finish(55));let s=G.launch(G.createState(),80);for(let i=0;i<7200&&s.phase==='rolling';i++){const n=G.step(s);assert.ok(Math.hypot(n.ball.x-s.ball.x,n.ball.y-s.ball.y)<25);s=n;}});
