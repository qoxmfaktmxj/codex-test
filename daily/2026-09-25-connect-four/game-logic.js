(function(root){'use strict';
  const rows=6,columns=7;
  function emptyBoard(){return Array.from({length:rows},()=>Array(columns).fill(0));}
  function findWinner(board){
    const directions=[[0,1],[1,0],[1,1],[1,-1]];
    for(let row=0;row<rows;row++)for(let column=0;column<columns;column++){
      const player=board[row][column]; if(!player)continue;
      for(const [dr,dc] of directions){const cells=[];for(let step=0;step<4;step++){const r=row+dr*step,c=column+dc*step;if(r<0||r>=rows||c<0||c>=columns||board[r][c]!==player)break;cells.push([r,c]);}if(cells.length===4)return {winner:player,cells};}
    } return null;
  }
  function createState(board){const next=board?board.map(row=>row.slice()):emptyBoard();const result=findWinner(next);const full=next.every(row=>row.every(Boolean));return {board:next,turn:1,phase:result?'finished':full?'draw':'playing',winner:result&&result.winner,winningCells:result?result.cells:[]};}
  function isLegalMove(state,column){return state.phase==='playing'&&Number.isInteger(column)&&column>=0&&column<columns&&state.board[0][column]===0;}
  function play(state,column){if(state.phase!=='playing')throw Error('끝난 판입니다.');if(!isLegalMove(state,column))throw Error('열을 고를 수 없습니다.');const board=state.board.map(row=>row.slice());let row=rows-1;while(board[row][column])row--;board[row][column]=state.turn;const result=findWinner(board),full=board.every(line=>line.every(Boolean));return {board,turn:state.turn===1?2:1,phase:result?'finished':full?'draw':'playing',winner:result&&result.winner,winningCells:result?result.cells:[]};}
  const api={createState,isLegalMove,play,findWinner};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ConnectFour=api;
})(globalThis);
