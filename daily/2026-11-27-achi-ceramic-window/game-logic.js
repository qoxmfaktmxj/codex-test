(function(root,factory){const api=factory();if(typeof module!=='undefined')module.exports=api;root.AchiLogic=api;})(globalThis,function(){
  const blue='푸른 유약',terracotta='살구 유약',players=[blue,terracotta];
  const winningLines=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  const other=p=>p===blue?terracotta:blue;
  const row=i=>Math.floor(i/3),col=i=>i%3;
  const neighbors=i=>Array.from({length:9},(_,j)=>j).filter(j=>j!==i&&Math.abs(row(i)-row(j))<=1&&Math.abs(col(i)-col(j))<=1);
  const winner=board=>players.find(player=>winningLines.some(line=>line.every(i=>board[i]===player)))||null;
  const createGame=()=>({board:Array(9).fill(null),turn:blue,phase:'놓기',selected:null,winner:null,message:'푸른 유약 차례 · 빈 타일을 누르세요'});
  const select=(game,from)=>game.winner||game.phase!=='이동'||game.board[from]!==game.turn?{...game,message:'지금 움직일 유약 말을 고르세요'}:{...game,selected:from,message:'이웃한 빈 타일로 옮기세요'};
  const play=(game,to)=>{
    if(game.winner||!Number.isInteger(to)||to<0||to>8||game.board[to])return {...game,message:'비어 있는 타일을 고르세요'};
    let board=game.board.slice();
    if(game.phase==='놓기') board[to]=game.turn;
    else { if(game.selected===null)return {...game,message:'먼저 움직일 유약 말을 고르세요'}; if(!neighbors(game.selected).includes(to))return {...game,message:'이웃한 타일로만 옮길 수 있어요'}; board[to]=game.turn;board[game.selected]=null; }
    const won=winner(board), next=other(game.turn), full=board.every(Boolean), nextPhase=game.phase==='놓기'&&board.filter(Boolean).length===6?'이동':game.phase;
    return {...game,board,turn:won?game.turn:next,phase:nextPhase,selected:null,winner:won,message:won?game.turn+'의 승리입니다!':full?'비겼습니다. 새 창을 열어 다시 해보세요.':next+' 차례 · '+(nextPhase==='놓기'?'빈 타일을 누르세요':'유약 말을 움직이세요')};
  };
  return {createGame,select,play,winningLines,players,resetGame:createGame,neighbors};
});
