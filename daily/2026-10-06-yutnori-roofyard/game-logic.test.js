const assert=require('assert');
const Yutnori=require('./game-logic.js');

assert.strictEqual(Yutnori.stepsFor('do'),1);
assert.strictEqual(Yutnori.stepsFor('gae'),2);
assert.strictEqual(Yutnori.stepsFor('geol'),3);
assert.strictEqual(Yutnori.stepsFor('yut'),4);
assert.strictEqual(Yutnori.stepsFor('mo'),5);
assert.strictEqual(Yutnori.move(18,3),1);
assert.deepStrictEqual(Yutnori.advance({position:17,distance:17,turns:0,finished:false},'mo'),{position:0,distance:22,turns:1,finished:true,bonus:true});
assert.deepStrictEqual(Yutnori.advance({position:18,distance:18,turns:4,finished:false},'do'),{position:19,distance:19,turns:5,finished:false,bonus:false});
assert.strictEqual(Yutnori.isWin({position:0,distance:20,turns:4,finished:true}),true);
assert.strictEqual(Yutnori.isWin({position:0,distance:19,turns:8,finished:false}),false);
console.log('윷놀이 기와마당 로직 테스트 통과');
