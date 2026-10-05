const assert=require('assert');
const Printshop2048=require('./game-logic.js');

assert.deepStrictEqual(Printshop2048.slide([2,0,2,2]),{line:[4,2,0,0],score:4,changed:true});
assert.deepStrictEqual(Printshop2048.slide([4,4,4,4]),{line:[8,8,0,0],score:16,changed:true});
assert.deepStrictEqual(Printshop2048.move([2,0,2,0,4,4,0,0,0,0,0,0,0,0,0,0],'left'),{board:[4,0,0,0,8,0,0,0,0,0,0,0,0,0,0,0],score:12,changed:true});
assert.strictEqual(Printshop2048.canMove([2,4,2,4,4,2,4,2,2,4,2,4,4,2,4,2]),false);
assert.strictEqual(Printshop2048.canMove([2,4,2,4,4,2,4,2,2,4,0,4,4,2,4,2]),true);
assert.deepStrictEqual(Printshop2048.spawn([2,0,0,0],()=>0),[2,2,0,0]);
assert.strictEqual(Printshop2048.has2048([2048,0,0,0,...Array(12).fill(0)]),true);
assert.strictEqual(Printshop2048.has2048([1024,1024,0,0,...Array(12).fill(0)]),false);
console.log('2048 인쇄소 로직 테스트 통과');
