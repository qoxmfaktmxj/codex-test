(function defineNim(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Nim = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const PLAYER = '나';
  const COMPUTER = '상대';
  const other = (player) => player === PLAYER ? COMPUTER : PLAYER;
  const nimSum = (piles) => piles.reduce((sum, pile) => sum ^ pile, 0);

  function validatePiles(piles) {
    if (!Array.isArray(piles) || piles.length !== 3 || piles.some((pile) => !Number.isInteger(pile) || pile < 0)) throw new Error('더미 정보가 올바르지 않습니다.');
    if (piles.every((pile) => pile === 0)) throw new Error('돌이 하나 이상 필요합니다.');
  }
  function buildGame(piles, turn) {
    const game = { piles, turn, status: '진행 중' };
    return { ...game, message: `${turn} 차례입니다. 한 더미에서 돌을 하나 이상 가져가세요.` };
  }
  function createGame(options = {}) {
    const piles = options.piles ? options.piles.slice() : [3, 4, 5];
    validatePiles(piles);
    const turn = options.turn || PLAYER;
    if (turn !== PLAYER && turn !== COMPUTER) throw new Error('차례 정보가 올바르지 않습니다.');
    return buildGame(piles, turn);
  }
  function remove(game, move) {
    if (game.status !== '진행 중') throw new Error('이미 끝난 게임입니다.');
    if (!move || !Number.isInteger(move.pile) || move.pile < 0 || move.pile > 2) throw new Error('더미를 올바르게 선택하세요.');
    if (!Number.isInteger(move.count) || move.count < 1 || move.count > game.piles[move.pile]) throw new Error('가져갈 수 있는 돌 수를 선택하세요.');
    const piles = game.piles.slice();
    piles[move.pile] -= move.count;
    if (piles.every((pile) => pile === 0)) {
      const status = game.turn === PLAYER ? '승리' : '패배';
      const message = game.turn === PLAYER ? '마지막 돌을 가져왔습니다. 승리!' : '상대가 마지막 돌을 가져갔습니다. 다음 판에 다시 도전하세요.';
      return { piles, turn: game.turn, status, message };
    }
    return buildGame(piles, other(game.turn));
  }
  function chooseComputerMove(game) {
    const sum = nimSum(game.piles);
    if (sum) {
      const pile = game.piles.findIndex((size) => (size ^ sum) < size);
      if (pile !== -1) return { pile, count: game.piles[pile] - (game.piles[pile] ^ sum) };
    }
    const pile = game.piles.findIndex((size) => size > 0);
    return pile === -1 ? null : { pile, count: 1 };
  }
  return { PLAYER, COMPUTER, createGame, remove, chooseComputerMove };
}));
