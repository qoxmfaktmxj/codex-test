(function(root){'use strict';
  const lines=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  function createState(){return {board:Array(9).fill(null),turn:'X',phase:'playing',winner:null};}
  function isLegalMove(s,cell){return s.phase==='playing'&&Number.isInteger(cell)&&cell>=0&&cell<9&&!s.board[cell];}
  function result(board){for(const [a,b,c] of lines)if(board[a]&&board[a]===board[b]&&board[a]===board[c])return board[a];return board.every(Boolean)?'draw':null;}
  function play(s,cell){if(!isLegalMove(s,cell))throw Error('그 칸에는 놓을 수 없습니다.');const board=s.board.slice();board[cell]=s.turn;const winner=result(board);return {board,turn:winner?s.turn:(s.turn==='X'?'O':'X'),phase:winner?'finished':'playing',winner};}
  const api={createState,isLegalMove,play,result};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.TicTacToe=api;
})(globalThis);
