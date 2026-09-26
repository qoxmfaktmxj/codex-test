(function(root){'use strict';
  const size=5;
  const clone=board=>board.map(row=>row.slice());
  function emptyBoard(){return Array.from({length:size},()=>Array(size).fill(0));}
  function initialBoard(){const board=emptyBoard();for(let r=0;r<2;r++)board[r].fill(1);board[2][0]=board[2][2]=1;for(let r=3;r<5;r++)board[r].fill(2);board[2][3]=board[2][4]=2;return board;}
  function directions(row,column){const base=[[1,0],[-1,0],[0,1],[0,-1]];return (row+column)%2===0?base.concat([[1,1],[1,-1],[-1,1],[-1,-1]]):base;}
  function inBoard(row,column){return row>=0&&row<size&&column>=0&&column<size;}
  function winner(board){const one=board.some(row=>row.includes(1)),two=board.some(row=>row.includes(2));return one&&!two?1:two&&!one?2:null;}
  function build(board,turn,captured){const who=winner(board);return {board:clone(board),turn,phase:who?'finished':'playing',winner:who,captured:captured||0};}
  function createState(board,turn){return build(board||initialBoard(),turn||1,0);}
  function rawMoves(state,row,column,capturesOnly){if(state.phase!=='playing'||!inBoard(row,column)||state.board[row][column]!==state.turn)return [];const moves=[];for(const [dr,dc] of directions(row,column)){const nr=row+dr,nc=column+dc,jr=row+dr*2,jc=column+dc*2;if(!capturesOnly&&inBoard(nr,nc)&&state.board[nr][nc]===0)moves.push([nr,nc]);if(inBoard(jr,jc)&&state.board[nr][nc]===3-state.turn&&state.board[jr][jc]===0)moves.push([jr,jc]);}return moves;}
  function hasCapture(state){for(let r=0;r<size;r++)for(let c=0;c<size;c++)if(rawMoves(state,r,c,true).length)return true;return false;}
  function legalMoves(state,row,column){const forced=hasCapture(state);return rawMoves(state,row,column,forced).filter(([r,c])=>!forced||Math.abs(r-row)===2||Math.abs(c-column)===2);}
  function move(state,fromRow,fromColumn,toRow,toColumn){const legal=legalMoves(state,fromRow,fromColumn);if(!legal.some(([r,c])=>r===toRow&&c===toColumn))throw Error('움직일 수 없습니다.');const board=clone(state.board),jump=Math.abs(toRow-fromRow)===2||Math.abs(toColumn-fromColumn)===2;board[toRow][toColumn]=state.turn;board[fromRow][fromColumn]=0;if(jump)board[(fromRow+toRow)/2][(fromColumn+toColumn)/2]=0;return build(board,3-state.turn,state.captured+(jump?1:0));}
  const api={createState,legalMoves,move};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.Alquerque=api;
})(globalThis);
