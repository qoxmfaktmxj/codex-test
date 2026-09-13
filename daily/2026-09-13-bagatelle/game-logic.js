(function defineBagatelle(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Bagatelle = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  const SHOTS = 5;
  const SCORES = [10, 20, 50, 100];

  function createState(input = {}) {
    const shots = input.shots === undefined ? 0 : input.shots;
    const score = input.score === undefined ? 0 : input.score;
    if (!Number.isInteger(shots) || shots < 0 || shots > SHOTS) throw new Error('공 횟수 정보가 올바르지 않습니다.');
    if (!Number.isInteger(score) || score < 0) throw new Error('점수 정보가 올바르지 않습니다.');
    return { shots, score, remaining: SHOTS - shots };
  }

  function getStatus(state) { return createState(state).remaining === 0 ? 'finished' : 'playing'; }

  function play(state, points) {
    const current = createState(state);
    if (getStatus(current) === 'finished') throw new Error('공을 모두 사용했습니다.');
    if (!SCORES.includes(points)) throw new Error('올바른 점수 칸이 아닙니다.');
    return createState({ shots: current.shots + 1, score: current.score + points });
  }

  return { SHOTS, SCORES, createState, getStatus, play };
}));
