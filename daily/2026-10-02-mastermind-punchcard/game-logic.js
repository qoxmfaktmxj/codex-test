(function(root){'use strict';
function createState(answer,maxTurns){return {answer:[...(answer||[0,1,2,3])],maxTurns:maxTurns||10,guesses:[],phase:'playing',message:'네 색을 골라 천공 카드를 제출하세요.'};}
function score(answer,guess){let exact=0;const a=[],g=[];answer.forEach((v,i)=>v===guess[i]?exact++:(a.push(v),g.push(guess[i])));let misplaced=0;g.forEach(v=>{const i=a.indexOf(v);if(i>=0){misplaced++;a.splice(i,1);}});return {exact,misplaced};}
function submit(state,guess){if(state.phase!=='playing')return state;if(!Array.isArray(guess)||guess.length!==4)throw Error('네 개의 색을 고르세요.');const result=score(state.answer,guess),guesses=[...state.guesses,{colors:[...guess],score:result}],won=result.exact===4,lost=!won&&guesses.length>=state.maxTurns;return {...state,guesses,phase:won?'won':lost?'lost':'playing',message:won?'해독 성공! 정답 카드를 맞혔습니다.':lost?'카드 묶음이 끝났습니다.':'검산 핀을 확인하고 다음 줄을 입력하세요.'};}
const api={createState,score,submit};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.Mastermind=api;
})(globalThis);
