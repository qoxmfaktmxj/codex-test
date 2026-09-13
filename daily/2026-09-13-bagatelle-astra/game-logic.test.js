const assert = require('node:assert/strict');
const G = require('./game-logic');
assert.equal(G.createState().remaining, 5);
for (const x of [30,100,200,300,370]) for (const power of [20,60,100]) {
 const result = G.simulate(x,power);
 assert.ok(result.path.length > 50);
 assert.ok(result.path.every(p => Number.isFinite(p.x) && p.x >= 8 && p.x <= 392));
 assert.ok(G.SCORES.includes(result.points));
 assert.ok(result.path.at(-1).y >= 550);
 assert.deepEqual(result,G.simulate(x,power));
}
assert.notDeepEqual(G.simulate(100,20).path,G.simulate(100,100).path);
let s=G.createState(); for(let i=0;i<5;i++) s=G.play(s,50);
assert.equal(s.score,250); assert.equal(s.remaining,0);
assert.throws(()=>G.play(s,50)); assert.throws(()=>G.play(G.createState(),999));
assert.throws(()=>G.simulate(NaN,50));
console.log('바가텔 비교판: 모든 로직 검증 통과');
