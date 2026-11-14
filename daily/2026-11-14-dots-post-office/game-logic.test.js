const assert = require('node:assert/strict');
const { createGame, drawLine, availableLines, resetGame } = require('./game-logic');

let game = createGame(2);
assert.deepEqual([game.size, game.turn, game.scores.나, game.scores.우체국, game.finished], [2, '나', 0, 0, false]);
assert.equal(availableLines(game).length, 12);
game = drawLine(game, 'h-0-0');
assert.equal(game.turn, '우체국');
assert.equal(game.lines['h-0-0'], '나');
assert.throws(() => drawLine(game, 'h-0-0'), /이미/);
assert.throws(() => drawLine(game, 'x-9-9'), /선택할 수/);

game = createGame(2);
for (const line of ['h-0-0', 'v-0-0', 'v-0-1']) game = drawLine(game, line);
game = drawLine(game, 'h-1-0');
assert.deepEqual([game.scores.우체국, game.turn, game.boxes['0-0']], [1, '우체국', '우체국']);

game = createGame(1);
for (const line of ['h-0-0', 'h-1-0', 'v-0-0']) game = drawLine(game, line);
game = drawLine(game, 'v-0-1');
assert.deepEqual([game.finished, game.winner, game.scores.우체국], [true, '우체국', 1]);
assert.deepEqual(resetGame(3), createGame(3));
assert.throws(() => createGame(0), /크기/);
console.log('점 잇기 우체국 로직 테스트 통과');
