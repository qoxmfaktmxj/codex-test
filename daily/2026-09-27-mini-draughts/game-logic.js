(function(root){'use strict';
const size=6,clone=b=>b.map(r=>r.slice()),inside=(r,c)=>r>=0&&r<size&&c>=0&&c<size,owner=v=>v>2?v-2:v,isKing=v=>v>2;
function initialBoard(){const b=Array.from({length:size},()=>Array(size).fill(0));for(let r=0;r<2;r++)for(let c=(r+1)%2;c<size;c+=2)b[r][c]=1;for(let r=4;r<6;r++)for(let c=(r+1)%2;c<size;c+=2)b[r][c]=2;return b;}
function dirs(v){return isKing(v)?[-1,1]:owner(v)===1?[1]:[-1];}
function raw(board,turn,r,c,captures){if(!inside(r,c)||owner(board[r][c])!==turn)return [];const out=[];for(const dr of dirs(board[r][c]))for(const dc of[-1,1]){const nr=r+dr,nc=c+dc,jr=r+dr*2,jc=c+dc*2;if(!captures&&inside(nr,nc)&&board[nr][nc]===0)out.push([nr,nc]);if(inside(jr,jc)&&owner(board[nr][nc])===3-turn&&board[jr][jc]===0)out.push([jr,jc]);}return out;}
function hasCapture(board,turn,only){for(let r=0;r<size;r++)for(let c=0;c<size;c++)if((!only||r===only[0]&&c===only[1])&&raw(board,turn,r,c,true).length)return true;return false;}
function hasMove(board,turn){const forced=hasCapture(board,turn);for(let r=0;r<size;r++)for(let c=0;c<size;c++)if(raw(board,turn,r,c,forced).length)return true;return false;}
function make(board,turn,captured,forced){const one=board.some(r=>r.some(v=>owner(v)===1)),two=board.some(r=>r.some(v=>owner(v)===2));let winner=!one?2:!two?1:null;if(!winner&&!hasMove(board,turn))winner=3-turn;return {board:clone(board),turn,phase:winner?'finished':'playing',winner,captured:captured||0,forced:forced||null};}
function createState(board,turn){return make(board||initialBoard(),turn||1,0,null);}
function legalMoves(s,r,c){if(s.phase!=='playing'||s.forced&&(s.forced[0]!==r||s.forced[1]!==c))return[];const forced=hasCapture(s.board,s.turn,s.forced);return raw(s.board,s.turn,r,c,forced);}
function move(s,fr,fc,tr,tc){if(!legalMoves(s,fr,fc).some(([r,c])=>r===tr&&c===tc))throw Error('움직일 수 없습니다.');const b=clone(s.board),jump=Math.abs(tr-fr)===2;let piece=b[fr][fc];b[fr][fc]=0;if(owner(piece)===1&&tr===size-1||owner(piece)===2&&tr===0)piece+=2;b[tr][tc]=piece;if(jump)b[(tr+fr)/2][(tc+fc)/2]=0;const forced=jump&&hasCapture(b,s.turn,[tr,tc])?[tr,tc]:null;return make(b,forced?s.turn:3-s.turn,s.captured+(jump?1:0),forced);}
const api={createState,legalMoves,move};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.Draughts=api;
})(globalThis);
