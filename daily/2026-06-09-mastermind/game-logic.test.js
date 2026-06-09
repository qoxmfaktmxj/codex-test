const assert = require('assert');
const {
  COLORS,
  STATUS,
  createGame,
  scoreGuess,
  submitGuess,
  setSlot,
  makeCode,
  remainingText,
  resultText,
} = require('./game-logic');

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}`);
    throw error;
  }
}

test('새 게임은 네 자리 비밀 코드와 빈 추측줄을 만든다', () => {
  const game = createGame(['빨강', '파랑', '초록', '노랑']);

  assert.deepStrictEqual(game.secret, ['빨강', '파랑', '초록', '노랑']);
  assert.deepStrictEqual(game.currentGuess, [null, null, null, null]);
  assert.strictEqual(game.history.length, 0);
  assert.strictEqual(game.turnsLeft, 8);
  assert.strictEqual(game.status, STATUS.PLAYING);
  assert.strictEqual(game.message, '색 네 칸을 채우고 정답을 확인하세요.');
});

test('정답 판정은 정확한 위치와 색만 맞은 개수를 따로 센다', () => {
  const score = scoreGuess(
    ['빨강', '파랑', '초록', '노랑'],
    ['빨강', '초록', '보라', '노랑'],
  );

  assert.deepStrictEqual(score, { exact: 2, colorOnly: 1 });
  assert.deepStrictEqual(scoreGuess(
    ['빨강', '빨강', '파랑', '노랑'],
    ['빨강', '파랑', '빨강', '초록'],
  ), { exact: 1, colorOnly: 2 });
});

test('슬롯에 색을 넣으면 현재 추측이 바뀌고 이전 게임은 보존된다', () => {
  const game = createGame(['빨강', '파랑', '초록', '노랑']);
  const next = setSlot(game, 2, '보라');

  assert.deepStrictEqual(game.currentGuess, [null, null, null, null]);
  assert.deepStrictEqual(next.currentGuess, [null, null, '보라', null]);
  assert.strictEqual(next.message, '세 번째 칸에 보라색을 골랐습니다.');
});

test('네 칸을 모두 채우지 않으면 제출하지 않는다', () => {
  const game = setSlot(createGame(['빨강', '파랑', '초록', '노랑']), 0, '빨강');
  const next = submitGuess(game);

  assert.strictEqual(next.history.length, 0);
  assert.strictEqual(next.turnsLeft, 8);
  assert.strictEqual(next.message, '비어 있는 칸 없이 네 색을 모두 고르세요.');
});

test('틀린 제출은 기록을 추가하고 다음 줄로 넘어간다', () => {
  let game = createGame(['빨강', '파랑', '초록', '노랑']);
  ['빨강', '초록', '보라', '검정'].forEach((color, index) => {
    game = setSlot(game, index, color);
  });
  const next = submitGuess(game);

  assert.strictEqual(next.history.length, 1);
  assert.deepStrictEqual(next.history[0].guess, ['빨강', '초록', '보라', '검정']);
  assert.deepStrictEqual(next.history[0].score, { exact: 1, colorOnly: 1 });
  assert.deepStrictEqual(next.currentGuess, [null, null, null, null]);
  assert.strictEqual(next.turnsLeft, 7);
  assert.strictEqual(next.status, STATUS.PLAYING);
});

test('정답을 맞히면 승리 상태가 되고 남은 차례를 보여준다', () => {
  let game = createGame(['빨강', '파랑', '초록', '노랑']);
  ['빨강', '파랑', '초록', '노랑'].forEach((color, index) => {
    game = setSlot(game, index, color);
  });
  const next = submitGuess(game);

  assert.strictEqual(next.status, STATUS.WON);
  assert.strictEqual(next.turnsLeft, 7);
  assert.strictEqual(next.message, '정답입니다! 비밀 코드를 풀었습니다.');
  assert.strictEqual(resultText(next), '성공 · 1번 만에 해결');
});

test('마지막 차례까지 실패하면 패배 상태가 된다', () => {
  let game = createGame(['빨강', '파랑', '초록', '노랑']);

  for (let turn = 0; turn < 8; turn += 1) {
    ['보라', '보라', '보라', '보라'].forEach((color, index) => {
      game = setSlot(game, index, color);
    });
    game = submitGuess(game);
  }

  assert.strictEqual(game.status, STATUS.LOST);
  assert.strictEqual(game.turnsLeft, 0);
  assert.strictEqual(game.message, '아쉽습니다. 비밀 코드는 빨강, 파랑, 초록, 노랑입니다.');
  assert.strictEqual(resultText(game), '실패 · 정답은 빨강, 파랑, 초록, 노랑');
});

test('무작위 코드는 지정 길이와 색 목록을 따른다', () => {
  const code = makeCode(() => 0.99, 4);

  assert.deepStrictEqual(code, [COLORS[COLORS.length - 1], COLORS[COLORS.length - 1], COLORS[COLORS.length - 1], COLORS[COLORS.length - 1]]);
  assert.strictEqual(remainingText(createGame(['빨강', '파랑', '초록', '노랑'])), '남은 기회 8번 · 기록 0줄');
});
