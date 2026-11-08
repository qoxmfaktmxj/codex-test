const assert = require('node:assert/strict');
const { createRound, togglePick, settleRound, countHits } = require('./game-logic');

let round = createRound([2, 7, 11, 18, 24]);
assert.deepEqual(round.drawn, [2, 7, 11, 18, 24]);
assert.deepEqual(round.picks, []);
round = togglePick(round, 2); round = togglePick(round, 7); round = togglePick(round, 19); round = togglePick(round, 1); round = togglePick(round, 3);
assert.deepEqual(round.picks, [2, 7, 19, 1, 3]);
assert.equal(countHits(round.picks, round.drawn), 2);
round = settleRound(round);
assert.equal(round.hits, 2);
assert.equal(round.message, '두 칸 적중!');
round = togglePick(round, 7);
assert.deepEqual(round.picks, [2, 7, 19, 1, 3]);
assert.equal(settleRound(createRound([1, 2, 3, 4, 5])).message, '다섯 칸을 모두 고르세요');
assert.throws(() => createRound([1, 2]), /다섯/);
console.log('키노 벽보국 로직 테스트 통과');
