(function(root, factory) {
  const api = factory();
  if (typeof module !== 'undefined') module.exports = api;
  root.YahtzeeLogic = api;
})(globalThis, function() {
  const categories = ['한 개', '두 개', '세 개', '네 개', '다섯 개', '여섯 개', '트리플', '포 카드', '풀하우스', '작은 스트레이트', '큰 스트레이트', '야추'];
  const freshScores = () => Object.fromEntries(categories.map(category => [category, null]));
  const createGame = random => ({ dice: Array.from({ length: 5 }, () => Math.floor(random() * 6) + 1), held: [false, false, false, false, false], rollsLeft: 3, scores: freshScores(), round: 1, status: '준비' });
  const roll = (game, random) => {
    if (game.rollsLeft === 0 || game.status === '끝') return game;
    return { ...game, dice: game.dice.map((die, i) => game.held[i] ? die : Math.floor(random() * 6) + 1), rollsLeft: game.rollsLeft - 1, status: '굴리는 중' };
  };
  const toggleHold = (game, index) => game.status === '끝' ? game : { ...game, held: game.held.map((held, i) => i === index ? !held : held) };
  const valueFor = (dice, category) => {
    const counts = dice.reduce((map, die) => ({ ...map, [die]: (map[die] || 0) + 1 }), {});
    const sum = dice.reduce((total, die) => total + die, 0);
    const number = categories.indexOf(category) + 1;
    if (number <= 6) return dice.filter(die => die === number).reduce((total, die) => total + die, 0);
    const amount = Object.values(counts);
    if (category === '트리플') return amount.some(count => count >= 3) ? sum : 0;
    if (category === '포 카드') return amount.some(count => count >= 4) ? sum : 0;
    if (category === '풀하우스') return amount.includes(3) && amount.includes(2) ? 25 : 0;
    const unique = [...new Set(dice)].sort().join('');
    if (category === '작은 스트레이트') return /1234|2345|3456/.test(unique) ? 30 : 0;
    if (category === '큰 스트레이트') return unique === '12345' || unique === '23456' ? 40 : 0;
    return amount.includes(5) ? 50 : 0;
  };
  const scoreCategory = (game, category) => {
    if (!categories.includes(category) || game.scores[category] !== null || game.status === '끝') return game;
    const scores = { ...game.scores, [category]: valueFor(game.dice, category) };
    const finished = Object.values(scores).every(score => score !== null);
    return { ...game, scores, held: [false, false, false, false, false], rollsLeft: 3, round: game.round + 1, status: finished ? '끝' : '준비' };
  };
  return { categories, createGame, roll, toggleHold, scoreCategory, valueFor };
});
