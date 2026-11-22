(function(root,factory){const api=factory();if(typeof module!=='undefined')module.exports=api;root.RotaLogic=api;})(globalThis,function(){
const players=['붉은 시계말','푸른 시계말'];
const lines=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
const neighbors=[[1,3,4],[0,2,3,4,5],[1,4,5],[0,1,4,6,7],[0,1,2,3,5,6,7,8],[1,2,4,7,8],[3,4,7],[3,4,5,6,8],[4,5,7]];
const other=p=>p===players[0]?players[1]:players[0];
const createGame=()=>({turn:players[0],board:Array(9).fill(null),placed:{[players[0]]:0,[players[1]]:0},phase:'배치',selected:null,winner:null,message:players[0]+' 차례 · 빈 눈금을 누르세요'});
const won=(board,p)=>lines.some(line=>line.every(i=>board[i]===p));
const next=(g,board,placed)=>{const winner=won(board,g.turn)?g.turn:null;const turn=winner?g.turn:other(g.turn);const phase=placed[players[0]]===3&&placed[players[1]]===3?'이동':'배치';return {...g,board,placed,turn,phase,selected:null,winner,message:winner?g.turn+'이 정렬을 완성했습니다!':turn+' 차례 · '+(phase==='배치'?'빈 눈금을 누르세요':'시계말을 골라 이웃 칸으로 움직이세요')};};
const place=(g,index)=>{if(g.winner||g.phase!=='배치'||!Number.isInteger(index)||index<0||index>8)return g;if(g.board[index])return {...g,message:'이미 시계말이 있습니다'};const board=g.board.slice();board[index]=g.turn;const placed={...g.placed,[g.turn]:g.placed[g.turn]+1};return next(g,board,placed);};
const select=(g,index)=>{if(g.winner||g.phase!=='이동'||g.board[index]!==g.turn)return {...g,message:'내 시계말을 고르세요'};return {...g,selected:index,message:'이동할 이웃 눈금을 고르세요'};};
const move=(g,index)=>{if(g.winner||g.phase!=='이동'||g.selected===null)return {...g,message:g.winner?g.message:'먼저 내 시계말을 고르세요'};if(!Number.isInteger(index)||index<0||index>8||g.board[index]||!neighbors[g.selected].includes(index))return {...g,message:'이웃한 빈 칸으로만 움직입니다'};const board=g.board.slice();board[index]=g.turn;board[g.selected]=null;return next(g,board,g.placed);};
return{createGame,place,select,move,resetGame:createGame,players,neighbors};
});
