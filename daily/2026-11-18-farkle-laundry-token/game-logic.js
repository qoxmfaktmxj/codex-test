(function(root, factory) { const api = factory(); if (typeof module !== 'undefined') module.exports = api; root.LaundryFarkleLogic = api; })(globalThis, function() {
  const scoreDice = dice => {
    const count = value => dice.filter(die => die === value).length;
    let score = 0;
    for (let value = 1; value <= 6; value++) { const copies = count(value); if (copies >= 3) score += value === 1 ? 1000 : value * 100; else if (value === 1) score += copies * 100; else if (value === 5) score += copies * 50; }
    return score;
  };
  const createGame = () => ({ total: 0, turnPoints: 0, dice: [], kept: [], rolls: 0, turn: '굴리기', finished: false, message: '주사위를 굴려 교환권을 모으세요' });
  const rollDice = (game, values) => {
    if (game.finished) return game;
    const dice = values || Array.from({ length: game.kept.length === 6 ? 6 : 6 - game.kept.length }, () => Math.floor(Math.random() * 6) + 1);
    if (!Array.isArray(dice) || !dice.length || dice.some(d => !Number.isInteger(d) || d < 1 || d > 6)) throw new Error('주사위 값이 올바르지 않습니다');
    if (scoreDice(dice) === 0) return { ...game, dice, kept: [], turnPoints: 0, rolls: game.rolls + 1, turn: '굴리기', message: '점수 없는 눈입니다 · 이번 교환권은 사라졌습니다' };
    return { ...game, dice, rolls: game.rolls + 1, turn: '고르기', message: '점수가 되는 주사위를 고르세요' };
  };
  const keepDice = (game, indexes) => {
    if (game.finished || game.turn !== '고르기') return game;
    const picked = indexes.map(index => game.dice[index]);
    const valid = picked.length && !picked.some(d => !d) && picked.every(die => die === 1 || die === 5 || picked.filter(value => value === die).length >= 3);
    if (!valid) throw new Error('점수가 되는 주사위만 골라야 합니다');
    const kept = game.kept.concat(picked); const turnPoints = game.turnPoints + scoreDice(picked); return { ...game, kept, dice: [], turnPoints, turn: '굴리기', message: turnPoints + '점 교환권 · 더 굴리거나 보관하세요' };
  };
  const bankPoints = game => { if (game.finished || !game.turnPoints) return game; const total = game.total + game.turnPoints; const finished = total >= 1000; return { ...game, total, turnPoints: 0, dice: [], kept: [], rolls: 0, turn: '굴리기', finished, message: finished ? '교환 완료 · 천점을 채웠습니다' : total + '점 보관 · 다음 교환을 시작하세요' }; };
  return { scoreDice, createGame, rollDice, keepDice, bankPoints, resetGame: createGame };
});
