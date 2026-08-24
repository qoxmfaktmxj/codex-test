const assert = require('assert');
const Freecell = require('./game-logic');

function card(suit, rank) { return { suit, rank }; }

function state(overrides = {}) {
  return Freecell.createState({
    tableau: [
      [card('spades', 4), card('hearts', 3)],
      [card('clubs', 4)],
      [card('spades', 2)],
      [],
    ],
    cells: [null, null],
    foundations: { clubs: 0, diamonds: 0, hearts: 0, spades: 0 },
    ...overrides,
  });
}

function testMovesOnlyTopCardAndChecksAlternatingStack() {
  const current = state();
  const next = Freecell.moveToTableau(current, 't0', 1);
  assert.deepStrictEqual(next.tableau[0], [card('spades', 4)]);
  assert.deepStrictEqual(next.tableau[1], [card('clubs', 4), card('hearts', 3)]);
  assert.throws(() => Freecell.moveToTableau(current, 't0', 2), /놓을 수 없는/);
}

function testUsesFreeCellAndReturnsFromIt() {
  const current = state();
  const stored = Freecell.moveToCell(current, 't0', 0);
  assert.deepStrictEqual(stored.cells[0], card('hearts', 3));
  assert.deepStrictEqual(stored.tableau[0], [card('spades', 4)]);
  assert.throws(() => Freecell.moveToCell(stored, 't1', 0), /비어 있지/);
  const returned = Freecell.moveToTableau(stored, 'c0', 1);
  assert.strictEqual(returned.cells[0], null);
  assert.deepStrictEqual(returned.tableau[1].at(-1), card('hearts', 3));
}

function testBuildsFoundationsInSuitOrder() {
  const current = state({
    tableau: [[card('clubs', 1)], [], [], []],
    cells: [card('hearts', 2), null],
    foundations: { clubs: 0, diamonds: 0, hearts: 1, spades: 0 },
  });
  const clubs = Freecell.moveToFoundation(current, 't0');
  assert.strictEqual(clubs.foundations.clubs, 1);
  const hearts = Freecell.moveToFoundation(clubs, 'c0');
  assert.strictEqual(hearts.foundations.hearts, 2);
  assert.throws(() => Freecell.moveToFoundation(state({ cells: [card('hearts', 2), null] }), 'c0'), /기초 더미/);
}

function testRecognizesWinAndRejectsMissingSource() {
  const won = state({
    tableau: [[], [], [], []],
    cells: [null, null],
    foundations: { clubs: 4, diamonds: 4, hearts: 4, spades: 4 },
  });
  assert.strictEqual(Freecell.getStatus(won), 'won');
  assert.throws(() => Freecell.moveToCell(won, 't0', 0), /옮길 카드/);
}

testMovesOnlyTopCardAndChecksAlternatingStack();
testUsesFreeCellAndReturnsFromIt();
testBuildsFoundationsInSuitOrder();
testRecognizesWinAndRejectsMissingSource();

console.log('미니 프리셀 로직 테스트 통과');
