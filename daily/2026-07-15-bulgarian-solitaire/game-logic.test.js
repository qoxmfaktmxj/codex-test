const assert = require('assert');
const BulgarianSolitaire = require('./game-logic');

function testCreateGameKeepsFortyFiveCards() {
  const game = BulgarianSolitaire.createGame({ piles: [20, 15, 10] });

  assert.deepStrictEqual(game.piles, [20, 15, 10]);
  assert.strictEqual(game.moves, 0);
  assert.strictEqual(game.status, '진행 중');
  assert.strictEqual(BulgarianSolitaire.countCards(game.piles), 45);
}

function testMoveTakesOneFromEachPileAndAddsNewPile() {
  const game = BulgarianSolitaire.createGame({ piles: [8, 6, 5, 4, 3, 2, 1, 16] });
  const next = BulgarianSolitaire.playMove(game);

  assert.deepStrictEqual(next.piles, [15, 7, 5, 4, 3, 2, 1, 8]);
  assert.strictEqual(next.moves, 1);
  assert.strictEqual(next.status, '진행 중');
  assert.strictEqual(BulgarianSolitaire.countCards(next.piles), 45);
}

function testGoalIsTriangularOneThroughNine() {
  const game = BulgarianSolitaire.createGame({ piles: [9, 8, 7, 6, 5, 4, 3, 2, 1] });
  const evaluated = BulgarianSolitaire.evaluateGame(game);

  assert.strictEqual(BulgarianSolitaire.isGoal(evaluated.piles), true);
  assert.strictEqual(evaluated.status, '승리');
  assert.strictEqual(evaluated.message, '1부터 9까지 계단 모양이 완성되었습니다.');
}

function testRejectsInvalidPiles() {
  assert.throws(() => BulgarianSolitaire.createGame({ piles: [44] }), /45장/);
  assert.throws(() => BulgarianSolitaire.createGame({ piles: [20, 20, 5.5] }), /정수/);
  assert.throws(() => BulgarianSolitaire.createGame({ piles: [20, 20, 5, 0] }), /양수/);
}

function testDeterministicDealUsesRandomSource() {
  const values = [0.1, 0.7, 0.2, 0.6, 0.4, 0.9, 0.3];
  let index = 0;
  const game = BulgarianSolitaire.createGame({
    random: () => values[index++ % values.length],
  });

  assert.strictEqual(BulgarianSolitaire.countCards(game.piles), 45);
  assert.ok(game.piles.length >= 4);
  assert.ok(game.piles.every((pile) => Number.isInteger(pile) && pile > 0));
}

testCreateGameKeepsFortyFiveCards();
testMoveTakesOneFromEachPileAndAddsNewPile();
testGoalIsTriangularOneThroughNine();
testRejectsInvalidPiles();
testDeterministicDealUsesRandomSource();

console.log('불가리아 솔리테어 로직 테스트 통과');
