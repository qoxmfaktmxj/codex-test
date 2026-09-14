const {test}=require('node:test');
const assert=require('node:assert/strict');
const G=require('./game-logic.js');
function finish(power){let s=G.launch(G.createState(),power);for(let i=0;i<2000&&s.phase==='sliding';i++)s=G.step(s);assert.notEqual(s.phase,'sliding');return s;}
test('다섯 번의 독립적인 연습으로 시작한다',()=>{const a=G.createState(),b=G.createState();assert.equal(a.remaining,5);assert.equal(a.score,0);a.history.push(1);assert.deepEqual(b.history,[]);});
test('발사는 한 번만 소비하며 입력 상태를 보존한다',()=>{const a=G.createState(),b=G.launch(a,65);assert.equal(a.remaining,5);assert.equal(b.remaining,4);assert.ok(b.puck.v>0);assert.throws(()=>G.launch(b,65));});
test('유효하지 않은 세기와 시간 간격을 거부한다',()=>{for(const p of [0,101,-1,NaN,Infinity,'50'])assert.throws(()=>G.launch(G.createState(),p));for(const dt of [0,-1,NaN,Infinity,.2])assert.throws(()=>G.step(G.createState(),dt));});
test('마찰이 속도를 줄이고 원본 퍽은 보존한다',()=>{const a=G.launch(G.createState(),60),b=G.step(a);assert.ok(b.puck.x>a.puck.x);assert.ok(b.puck.v<a.puck.v);assert.equal(a.puck.x,80);});
test('퍽 전체가 선을 넘어야 높은 점수이며 끝을 넘으면 영점이다',()=>{assert.equal(G.scoreAt(639),0);assert.equal(G.scoreAt(640),1);assert.equal(G.scoreAt(739),1);assert.equal(G.scoreAt(740),2);assert.equal(G.scoreAt(839),2);assert.equal(G.scoreAt(840),3);assert.equal(G.scoreAt(960),3);assert.equal(G.scoreAt(960.001),0);});
test('멈출 때 한 번만 점수를 합산한다',()=>{let a=G.launch(G.createState(),70);a.puck={x:865,v:0.1};const b=G.step(a);assert.equal(b.score,3);assert.deepEqual(b.history,[3]);assert.deepEqual(G.step(b),b);});
test('모든 정수 세기는 유한하게 끝나며 네 종류 결과가 가능하다',()=>{const scores=new Set();for(let p=1;p<=100;p++){const s=finish(p);assert.ok(Number.isFinite(s.puck.x));assert.equal(s.history.length,1);assert.ok([0,1,2,3].includes(s.score));scores.add(s.score);}assert.deepEqual([...scores].sort(),[0,1,2,3]);});
test('과한 세기는 낙하로 영점 처리하고 활주를 끝낸다',()=>{const s=finish(100);assert.equal(s.score,0);assert.equal(s.fell,true);});
test('다섯 번 뒤 종료와 새 판 초기화',()=>{let s=G.createState();for(let n=0;n<5;n++){s=G.launch(s,72);while(s.phase==='sliding')s=G.step(s);}assert.equal(s.phase,'finished');assert.equal(s.remaining,0);assert.equal(s.history.length,5);assert.throws(()=>G.launch(s,72));assert.equal(G.createState().score,0);});
test('프레임 간격과 상관없이 같은 곳에서 멈춘다',()=>{let a=G.launch(G.createState(),73),b=G.launch(G.createState(),73);while(a.phase==='sliding')a=G.step(a,1/120);while(b.phase==='sliding')b=G.step(b,1/30);assert.ok(Math.abs(a.puck.x-b.puck.x)<1e-8);assert.equal(a.score,b.score);});
