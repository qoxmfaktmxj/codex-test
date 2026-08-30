(function defineChopsticks(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Chopsticks = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const PLAYERS = ['blue', 'orange'];

  function copyHands(hands) { return { blue: [...hands.blue], orange: [...hands.orange] }; }

  function createState(input = {}) {
    const hands = input.hands === undefined ? { blue: [1, 1], orange: [1, 1] } : input.hands;
    const turn = input.turn === undefined ? 'blue' : input.turn;
    if (!hands || !PLAYERS.every((player) => Array.isArray(hands[player]) && hands[player].length === 2 && hands[player].every((value) => Number.isInteger(value) && value >= 0 && value <= 4))) throw new Error('손가락 정보가 올바르지 않습니다.');
    if (!PLAYERS.includes(turn)) throw new Error('차례 정보가 올바르지 않습니다.');
    return { hands: copyHands(hands), turn };
  }

  function opponent(player) { return player === 'blue' ? 'orange' : 'blue'; }
  function isHand(index) { return Number.isInteger(index) && index >= 0 && index < 2; }

  function getStatus(state) {
    const current = createState(state);
    if (current.hands.orange.every((value) => value === 0)) return 'blue-won';
    if (current.hands.blue.every((value) => value === 0)) return 'orange-won';
    return 'playing';
  }

  function hit(state, ownHand, targetHand) {
    const next = createState(state);
    if (getStatus(next) !== 'playing') throw new Error('게임이 이미 끝났습니다.');
    if (!isHand(ownHand) || !isHand(targetHand)) throw new Error('손을 선택하세요.');
    const enemy = opponent(next.turn);
    if (next.hands[next.turn][ownHand] === 0) throw new Error('쓸 수 없는 손입니다.');
    if (next.hands[enemy][targetHand] === 0) throw new Error('상대의 쓸 수 있는 손을 고르세요.');
    next.hands[enemy][targetHand] = (next.hands[enemy][targetHand] + next.hands[next.turn][ownHand]) % 5;
    next.turn = enemy;
    return next;
  }

  function split(state, first, second) {
    const next = createState(state);
    if (getStatus(next) !== 'playing') throw new Error('게임이 이미 끝났습니다.');
    if (![first, second].every((value) => Number.isInteger(value) && value >= 1 && value <= 4)) throw new Error('각 손에는 1부터 4까지 나눠야 합니다.');
    const player = next.turn;
    const total = next.hands[player][0] + next.hands[player][1];
    if (first + second !== total) throw new Error('손가락 수를 보존해 나누세요.');
    if (first === next.hands[player][0] && second === next.hands[player][1]) throw new Error('현재와 다른 모양으로 나누세요.');
    next.hands[player] = [first, second];
    next.turn = opponent(player);
    return next;
  }

  return { createState, getStatus, hit, split };
}));
