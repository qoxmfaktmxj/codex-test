const assert=require('assert');
const Lander=require('./game-logic.js');
assert.deepStrictEqual(Lander.step({x:50,y:10,vx:0,vy:0,fuel:5}, {left:false,right:false,thrust:false}),{x:50,y:10.18,vx:0,vy:.18,fuel:5});
assert.deepStrictEqual(Lander.step({x:50,y:10,vx:0,vy:1,fuel:2}, {left:true,right:false,thrust:true}),{x:49.82,y:10.48,vx:-.18,vy:.48,fuel:1});
assert.strictEqual(Lander.landingResult({x:51,y:92,vx:.4,vy:1.1}, {start:45,end:57}), '착륙 성공');
assert.strictEqual(Lander.landingResult({x:40,y:92,vx:.2,vy:1}, {start:45,end:57}), '착륙 실패');
assert.strictEqual(Lander.landingResult({x:50,y:92,vx:1.2,vy:1}, {start:45,end:57}), '착륙 실패');
assert.strictEqual(Lander.isOver({y:100}),true); assert.strictEqual(Lander.isOver({y:99.9}),false);
console.log('달 착륙선 연 축제 로직 테스트 통과');
