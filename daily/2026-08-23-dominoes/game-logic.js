(function defineDominoes(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Dominoes = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  function cloneTile(tile) {
    return { left: tile.left, right: tile.right };
  }

  function assertTile(tile) {
    if (!tile || !Number.isInteger(tile.left) || !Number.isInteger(tile.right) || tile.left < 0 || tile.left > 6 || tile.right < 0 || tile.right > 6) {
      throw new Error('도미노 정보가 올바르지 않습니다.');
    }
  }

  function cloneState(state) {
    return {
      hands: state.hands.map((hand) => hand.map(cloneTile)),
      drawPile: state.drawPile.map(cloneTile),
      board: state.board.map(cloneTile),
      turn: state.turn,
      passes: state.passes,
    };
  }

  function createState(state) {
    if (!state || !Array.isArray(state.hands) || state.hands.length !== 2 || !Array.isArray(state.drawPile) || !Array.isArray(state.board) || !state.board.length || !Number.isInteger(state.turn) || state.turn < 0 || state.turn > 1 || !Number.isInteger(state.passes) || state.passes < 0) {
      throw new Error('게임 정보가 올바르지 않습니다.');
    }
    [...state.hands.flat(), ...state.drawPile, ...state.board].forEach(assertTile);
    return cloneState(state);
  }

  function endpoints(state) {
    const current = createState(state);
    return { left: current.board[0].left, right: current.board.at(-1).right };
  }

  function canPlayOn(tile, value) {
    assertTile(tile);
    if (!Number.isInteger(value) || value < 0 || value > 6) throw new Error('끝 숫자가 올바르지 않습니다.');
    return tile.left === value || tile.right === value;
  }

  function playableMoves(state, player) {
    const current = createState(state);
    if (!current.hands[player]) throw new Error('플레이어 정보를 확인하세요.');
    const ends = endpoints(current);
    return current.hands[player].flatMap((tile, index) => {
      const places = [];
      if (canPlayOn(tile, ends.left)) places.push('left');
      if (ends.right !== ends.left && canPlayOn(tile, ends.right)) places.push('right');
      return places.length ? [{ index, ends: places }] : [];
    });
  }

  function orientForEnd(tile, value, side) {
    if (!canPlayOn(tile, value)) throw new Error('놓을 수 없는 도미노입니다.');
    if (side === 'left') return tile.right === value ? cloneTile(tile) : { left: tile.right, right: tile.left };
    return tile.left === value ? cloneTile(tile) : { left: tile.right, right: tile.left };
  }

  function playTile(state, player, index, side) {
    const next = createState(state);
    if (next.turn !== player || !Number.isInteger(index) || !['left', 'right'].includes(side)) throw new Error('차례를 확인하세요.');
    const tile = next.hands[player][index];
    if (!tile) throw new Error('도미노를 확인하세요.');
    const end = side === 'left' ? next.board[0].left : next.board.at(-1).right;
    const oriented = orientForEnd(tile, end, side);
    next.hands[player].splice(index, 1);
    if (side === 'left') next.board.unshift(oriented);
    else next.board.push(oriented);
    next.turn = player === 0 ? 1 : 0;
    next.passes = 0;
    return next;
  }

  function drawTile(state, player) {
    const next = createState(state);
    if (next.turn !== player) throw new Error('차례를 확인하세요.');
    if (playableMoves(next, player).length) throw new Error('놓을 수 있는 도미노가 있습니다.');
    const tile = next.drawPile.pop();
    if (!tile) throw new Error('뽑을 도미노가 없습니다.');
    next.hands[player].push(tile);
    next.turn = player === 0 ? 1 : 0;
    next.passes = 0;
    return next;
  }

  function passTurn(state, player) {
    const next = createState(state);
    if (next.turn !== player || next.drawPile.length || playableMoves(next, player).length) throw new Error('아직 차례를 넘길 수 없습니다.');
    next.turn = player === 0 ? 1 : 0;
    next.passes += 1;
    return next;
  }

  function scoreHand(hand) {
    if (!Array.isArray(hand)) throw new Error('손패 정보가 올바르지 않습니다.');
    hand.forEach(assertTile);
    return hand.reduce((total, tile) => total + tile.left + tile.right, 0);
  }

  function getStatus(state) {
    const current = createState(state);
    if (!current.hands[0].length) return 'player-won';
    if (!current.hands[1].length) return 'computer-won';
    if (current.passes >= 2) return 'blocked';
    return 'playing';
  }

  return { createState, endpoints, canPlayOn, playableMoves, playTile, drawTile, passTurn, scoreHand, getStatus };
}));
