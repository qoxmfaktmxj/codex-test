(function(root){'use strict';
  const solved=[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0];
  function isSolved(board){return board.every((value,index)=>value===solved[index]);}
  function isSolvable(board){const values=board.filter(Boolean);let inversions=0;for(let i=0;i<values.length;i++)for(let j=i+1;j<values.length;j++)if(values[i]>values[j])inversions++;const blankRow=4-Math.floor(board.indexOf(0)/4);return (inversions+blankRow)%2===1;}
  function createState(board){const next=(board||solved).slice();return {board:next,phase:isSolved(next)?'finished':'playing'};}
  function isLegalMove(state,index){if(state.phase!=='playing'||!Number.isInteger(index)||index<0||index>15)return false;const blank=state.board.indexOf(0);const row=Math.floor(index/4),col=index%4,blankRow=Math.floor(blank/4),blankCol=blank%4;return Math.abs(row-blankRow)+Math.abs(col-blankCol)===1;}
  function play(state,index){if(!isLegalMove(state,index))throw Error('그 활자는 움직일 수 없습니다.');const board=state.board.slice(),blank=board.indexOf(0);[board[index],board[blank]]=[board[blank],board[index]];return {board,phase:isSolved(board)?'finished':'playing'};}
  function shuffle(random){const board=solved.slice();do{for(let i=board.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[board[i],board[j]]=[board[j],board[i]];}}while(isSolved(board)||!isSolvable(board));return board;}
  const api={createState,isSolved,isSolvable,isLegalMove,play,shuffle};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.Fifteen=api;
})(globalThis);
