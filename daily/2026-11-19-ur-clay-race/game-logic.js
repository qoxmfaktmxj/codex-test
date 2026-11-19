(function(root, factory) { const api = factory(); if (typeof module !== 'undefined') module.exports = api; root.UrClayRaceLogic = api; })(globalThis, function() {
  const createGame = () => ({ turn: '남빛', phase: '던지기', dice: [], steps: 0, pieces: { indigo: [-1,-1,-1,-1,-1,-1,-1], terracotta: [-1,-1,-1,-1,-1,-1,-1] }, finished: { indigo: 0, terracotta: 0 }, message: '남빛 말이 먼저 갑니다 · 막대 주사위를 던지세요', winner: null });
  const key = color => color === '남빛' ? 'indigo' : 'terracotta';
  const other = color => color === '남빛' ? '토빛' : '남빛';
  const rollSticks = (game, values) => {
    if (game.phase !== '던지기' || game.winner) return game;
    const dice = values || Array.from({ length: 4 }, () => Math.random() > .5 ? 1 : 0);
    if (!Array.isArray(dice) || dice.length !== 4 || dice.some(v => v !== 0 && v !== 1)) throw new Error('막대 주사위 값이 올바르지 않습니다');
    const steps = dice.reduce((a,b) => a+b, 0);
    if (!steps) return { ...game, dice, steps, turn: other(game.turn), message: '빈 면만 나왔습니다 · 차례를 넘깁니다' };
    return { ...game, dice, steps, phase: '이동', message: game.turn + ' 말 하나를 ' + steps + '칸 움직이세요' };
  };
  const movePiece = (game, index) => {
    if (game.phase !== '이동' || game.winner || !Number.isInteger(index)) return game;
    const mine = key(game.turn), theirs = key(other(game.turn)), from = game.pieces[mine][index];
    if (from === undefined || from === 14 || from + game.steps > 14) return { ...game, message: '정확한 눈이 필요합니다 · 다른 말을 고르세요' };
    const target = from + game.steps, pieces = { indigo: [...game.pieces.indigo], terracotta: [...game.pieces.terracotta] }, finished = { ...game.finished };
    pieces[mine][index] = target;
    if (target < 14) { const captured = pieces[theirs].indexOf(target); if (captured >= 0) pieces[theirs][captured] = -1; }
    if (target === 14) finished[mine]++;
    const rosette = [3, 7, 12].includes(target);
    const winner = finished[mine] === 7 ? game.turn : null;
    return { ...game, pieces, finished, winner, phase: winner ? '끝' : '던지기', turn: rosette && !winner ? game.turn : other(game.turn), message: winner ? game.turn + '의 일곱 말이 모두 도착했습니다' : rosette ? '로제트 칸입니다 · 한 번 더 던지세요' : other(game.turn) + ' 차례입니다 · 막대 주사위를 던지세요' };
  };
  return { createGame, rollSticks, movePiece, resetGame: createGame };
});
