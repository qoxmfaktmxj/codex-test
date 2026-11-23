(function(root,factory){const api=factory();if(typeof module!=='undefined')module.exports=api;root.MorrisLogic=api;})(globalThis,function(){
const players=['청록 유리말','산호 유리말'];
const mills=[[0,1,2],[3,4,5],[6,7,8],[9,10,11],[12,13,14],[15,16,17],[18,19,20],[21,22,23],[0,9,21],[3,10,18],[6,11,15],[1,4,7],[16,19,22],[8,12,17],[5,13,20],[2,14,23]];
const links=[[1,9],[0,2,4],[1,14],[4,10],[1,3,5,7],[4,13],[7,11],[4,6,8],[7,12],[0,10,21],[3,9,11,18],[6,10,15],[8,13,17],[5,12,14,20],[2,13,23],[11,16],[15,17,19],[12,16],[10,19],[16,18,20,22],[13,19,23],[9,22],[19,21,23],[14,20,22]];
const other=p=>p===players[0]?players[1]:players[0];
const count=(board,p)=>board.filter(x=>x===p).length;
const hasMill=(board,p,i)=>mills.some(line=>line.includes(i)&&line.every(n=>board[n]===p));
const createGame=()=>({turn:players[0],board:Array(24).fill(null),placed:{[players[0]]:0,[players[1]]:0},phase:'배치',selected:null,pendingRemove:false,winner:null,message:players[0]+' 차례 · 빈 유리 조각을 누르세요'});
const advance=(g,board,placed)=>{const opponent=other(g.turn);const phase=placed[players[0]]===9&&placed[players[1]]===9?'이동':'배치';const winner=phase==='이동'&&count(board,opponent)<3?g.turn:null;const turn=winner?g.turn:opponent;return {...g,board,placed,phase,turn,selected:null,pendingRemove:false,winner,message:winner?g.turn+'이 회랑을 지켰습니다!':turn+' 차례 · '+(phase==='배치'?'빈 유리 조각을 누르세요':'내 유리말을 골라 연결선으로 옮기세요')};};
const afterAction=(g,board,placed,index)=>hasMill(board,g.turn,index)?{...g,board,placed,pendingRemove:true,selected:null,message:'한 줄의 빛을 만들었습니다 · 상대 유리말 하나를 누르세요'}:advance(g,board,placed);
const place=(g,index)=>{if(g.winner||g.pendingRemove||g.phase!=='배치'||!Number.isInteger(index)||index<0||index>23)return g;if(g.board[index])return {...g,message:'이미 유리말이 있습니다'};const board=g.board.slice();board[index]=g.turn;const placed={...g.placed,[g.turn]:g.placed[g.turn]+1};return afterAction(g,board,placed,index);};
const select=(g,index)=>{if(g.winner||g.pendingRemove||g.phase!=='이동'||g.board[index]!==g.turn)return {...g,message:'내 유리말을 고르세요'};return {...g,selected:index,message:'연결된 빈 자리를 고르세요'};};
const move=(g,index)=>{if(g.winner||g.pendingRemove||g.phase!=='이동'||g.selected===null)return {...g,message:'먼저 내 유리말을 고르세요'};const flying=count(g.board,g.turn)===3;if(!Number.isInteger(index)||index<0||index>23||g.board[index]||(!flying&&!links[g.selected].includes(index)))return {...g,message:flying?'빈 자리로만 날아갈 수 있습니다':'연결된 빈 자리로만 움직입니다'};const board=g.board.slice();board[index]=g.turn;board[g.selected]=null;return afterAction(g,board,g.placed,index);};
const removePiece=(g,index)=>{const opponent=other(g.turn);if(!g.pendingRemove||g.board[index]!==opponent)return {...g,message:'상대 유리말 하나를 고르세요'};const outsideMill=g.board.some((piece,i)=>piece===opponent&&!hasMill(g.board,opponent,i));if(outsideMill&&hasMill(g.board,opponent,index))return {...g,message:'줄 밖의 상대 유리말을 먼저 고르세요'};const board=g.board.slice();board[index]=null;return advance(g,board,g.placed);};
return{createGame,place,select,move,removePiece,resetGame:createGame,players,links,mills};
});
