(function defineSim(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Sim = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const PLAYER = '당신';
  const COMPUTER = '컴퓨터';

  function edgeKey(first, second) {
    return first < second ? `${first}-${second}` : `${second}-${first}`;
  }

  function createGame() {
    return { points: 6, edges: {}, turn: PLAYER, status: '진행 중', winner: null, message: '선 하나를 골라 당신의 색으로 칠하세요.' };
  }

  function getEdgeColor(game, first, second) {
    return game.edges[edgeKey(first, second)] || null;
  }

  function getAvailableMoves(game) {
    const moves = [];
    for (let first = 0; first < game.points; first += 1) {
      for (let second = first + 1; second < game.points; second += 1) {
        if (!getEdgeColor(game, first, second)) moves.push({ first, second });
      }
    }
    return moves;
  }

  function hasTriangle(game, color) {
    for (let first = 0; first < game.points; first += 1) {
      for (let second = first + 1; second < game.points; second += 1) {
        for (let third = second + 1; third < game.points; third += 1) {
          if (getEdgeColor(game, first, second) === color
            && getEdgeColor(game, first, third) === color
            && getEdgeColor(game, second, third) === color) return true;
        }
      }
    }
    return false;
  }

  function playMove(game, first, second) {
    if (game.status !== '진행 중') throw new Error('이미 끝난 게임입니다.');
    if (!Number.isInteger(first) || !Number.isInteger(second) || first === second || first < 0 || second < 0 || first >= game.points || second >= game.points) throw new Error('고를 수 없는 선입니다.');
    const key = edgeKey(first, second);
    if (game.edges[key]) throw new Error('이미 색칠한 선입니다.');
    const edges = { ...game.edges, [key]: game.turn };
    const moved = { ...game, edges };
    if (hasTriangle(moved, game.turn)) {
      const winner = game.turn === PLAYER ? COMPUTER : PLAYER;
      return { ...moved, status: '종료', winner, message: `${game.turn}이(가) 같은 색 삼각형을 만들어 ${winner}의 승리입니다!` };
    }
    const nextTurn = game.turn === PLAYER ? COMPUTER : PLAYER;
    return { ...moved, turn: nextTurn, message: `${nextTurn} 차례입니다.` };
  }

  return { PLAYER, COMPUTER, createGame, getEdgeColor, getAvailableMoves, hasTriangle, playMove };
}));
