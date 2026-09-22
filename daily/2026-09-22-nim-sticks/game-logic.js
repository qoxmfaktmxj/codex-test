(function(root){'use strict';
  function createState(){return {piles:[3,5,7],turn:'human',phase:'playing',winner:null};}
  function isLegalMove(s,pile,count){return s.phase==='playing'&&Number.isInteger(pile)&&pile>=0&&pile<s.piles.length&&Number.isInteger(count)&&count>0&&count<=s.piles[pile];}
  function take(s,pile,count){if(!isLegalMove(s,pile,count))throw Error('그만큼 가져갈 수 없습니다.');const piles=s.piles.slice();piles[pile]-=count;const empty=piles.every(n=>n===0);return {piles,turn:empty?s.turn:(s.turn==='human'?'computer':'human'),phase:empty?'finished':'playing',winner:empty?s.turn:null};}
  function computerMove(s){if(s.phase!=='playing'||s.turn!=='computer')throw Error('컴퓨터 차례가 아닙니다.');const xor=s.piles.reduce((a,b)=>a^b,0);let pile=s.piles.findIndex(n=>(n^(xor))<n);if(pile<0)pile=s.piles.findIndex(n=>n>0);const count=xor&&pile>=0?s.piles[pile]-(s.piles[pile]^xor):1;return {move:{pile,count},state:take(s,pile,count)};}
  const api={createState,isLegalMove,take,computerMove};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.Nim=api;
})(globalThis);
