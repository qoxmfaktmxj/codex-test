(function(root){'use strict';
function slide(line){const compact=line.filter(Boolean);let score=0;const out=[];for(let i=0;i<compact.length;i++){if(compact[i]===compact[i+1]){const value=compact[i]*2;out.push(value);score+=value;i++;}else out.push(compact[i]);}while(out.length<line.length)out.push(0);return {line:out,score,changed:out.some((v,i)=>v!==line[i])};}
function indexes(direction,row){if(direction==='left')return [row*4,row*4+1,row*4+2,row*4+3];if(direction==='right')return [row*4+3,row*4+2,row*4+1,row*4];if(direction==='up')return [row,row+4,row+8,row+12];return [row+12,row+8,row+4,row];}
function move(board,direction){let next=board.slice(),score=0,changed=false;for(let row=0;row<4;row++){const ids=indexes(direction,row),result=slide(ids.map(i=>board[i]));ids.forEach((id,i)=>next[id]=result.line[i]);score+=result.score;changed=changed||result.changed;}return {board:next,score,changed};}
function canMove(board){if(board.includes(0))return true;return ['left','up'].some(direction=>move(board,direction).changed);}
function has2048(board){return board.includes(2048);}
function spawn(board,random){const empty=[];board.forEach((cell,i)=>{if(!cell)empty.push(i);});if(!empty.length)return board.slice();const next=board.slice(),randomFn=random||Math.random,index=empty[Math.floor(randomFn()*empty.length)];next[index]=randomFn()<.9?2:4;return next;}
const api={slide,move,canMove,has2048,spawn};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.Printshop2048=api;
})(globalThis);
