const assert = require('node:assert/strict');
const { createGame, placeLetter, availableLetters, resetGame } = require('./game-logic');

let game = createGame(3);
assert.deepEqual([game.size, game.turn, game.scores.등대, game.scores.배], [3, '등대', 0, 0]);
assert.deepEqual(availableLetters(), ['S', 'O']);
game = placeLetter(game, 0, 0, 'S');
assert.equal(game.board[0][0], 'S');
assert.equal(game.turn, '배');
assert.throws(() => placeLetter(game, 0, 0, 'O'), /이미/);
assert.throws(() => placeLetter(game, 9, 0, 'S'), /범위를/);
assert.throws(() => placeLetter(game, 1, 1, 'A'), /S 또는 O/);

game = createGame(3);
game = placeLetter(game, 0, 0, 'S');
game = placeLetter(game, 1, 1, 'O');
game = placeLetter(game, 0, 2, 'S');
game = placeLetter(game, 0, 1, 'O');
assert.deepEqual([game.scores.배, game.turn, game.lastLines.length], [1, '배', 1]);
assert.deepEqual(game.lastLines[0], [[0, 0], [0, 1], [0, 2]]);

game = createGame(2);
for (const [row, col, letter] of [[0,0,'S'],[0,1,'O'],[1,0,'O'],[1,1,'S']]) game = placeLetter(game, row, col, letter);
assert.equal(game.finished, true);
assert.equal(game.winner, '무승부');
assert.deepEqual(resetGame(4), createGame(4));
assert.throws(() => createGame(1), /크기는/);
console.log('SOS 폭풍 등대국 로직 테스트 통과');
