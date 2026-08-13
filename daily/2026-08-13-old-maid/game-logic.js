(function defineOldMaid(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.OldMaid = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const RANKS = ['1', '2', '3', '4', '5', '6', '7'];

  function createDeck() {
    return RANKS.flatMap((rank) => [
      { rank, id: `${rank}-햇살` }, { rank, id: `${rank}-달빛` },
    ]).concat({ rank: '조커', id: '조커' });
  }

  function shuffleDeck(deck, random = Math.random) {
    const shuffled = deck.map((item) => ({ ...item }));
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const other = Math.floor(random() * (index + 1));
      [shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]];
    }
    return shuffled;
  }

  function removePairs(hand) {
    const counts = hand.reduce((result, item) => ({ ...result, [item.rank]: (result[item.rank] || 0) + 1 }), {});
    return hand.filter((item) => item.rank === '조커' || counts[item.rank] % 2 === 1).map((item) => ({ ...item }));
  }

  function copyGame(game) {
    return {
      player: game.player.map((item) => ({ ...item })), computer: game.computer.map((item) => ({ ...item })),
      turn: game.turn, status: game.status, message: game.message, moves: game.moves,
    };
  }

  function updateStatus(game) {
    if (game.player.length === 0) {
      game.status = '승리';
      game.message = `모든 짝을 버렸습니다! ${game.moves}번 뽑아 승리했습니다.`;
    } else if (game.computer.length === 0) {
      game.status = '패배';
      game.message = '컴퓨터가 먼저 카드를 모두 버렸습니다. 조커를 피해서 다시 도전하세요.';
    } else {
      game.status = '진행 중';
      game.message = game.turn === '플레이어'
        ? '컴퓨터 카드 한 장을 골라 짝을 만드세요.'
        : '컴퓨터가 당신의 카드 한 장을 고르고 있습니다.';
    }
    return game;
  }

  function createGame(deck = createDeck()) {
    if (!Array.isArray(deck) || deck.length !== 15 || deck.filter((item) => item && item.rank === '조커').length !== 1) throw new Error('카드 정보가 올바르지 않습니다.');
    const player = removePairs(deck.filter((_, index) => index % 2 === 0));
    const computer = removePairs(deck.filter((_, index) => index % 2 === 1));
    return updateStatus({ player, computer, turn: '플레이어', status: '진행 중', message: '', moves: 0 });
  }

  function playerDraw(game, index) {
    if (!game || game.status !== '진행 중' || game.turn !== '플레이어' || !Number.isInteger(index) || index < 0 || index >= game.computer.length) throw new Error('고를 수 없는 카드입니다.');
    const next = copyGame(game);
    next.player.push(next.computer.splice(index, 1)[0]);
    next.player = removePairs(next.player);
    next.turn = '컴퓨터';
    next.moves += 1;
    return updateStatus(next);
  }

  function computerDraw(game, random = Math.random) {
    if (!game || game.status !== '진행 중' || game.turn !== '컴퓨터') throw new Error('컴퓨터 차례가 아닙니다.');
    const next = copyGame(game);
    const index = Math.min(next.player.length - 1, Math.floor(random() * next.player.length));
    next.computer.push(next.player.splice(index, 1)[0]);
    next.computer = removePairs(next.computer);
    next.turn = '플레이어';
    next.moves += 1;
    return updateStatus(next);
  }

  return { RANKS, createDeck, shuffleDeck, removePairs, createGame, playerDraw, computerDraw };
}));
