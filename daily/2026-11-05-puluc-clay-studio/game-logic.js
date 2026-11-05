(function(root,factory){const api=factory();if(typeof module!=='undefined')module.exports=api;root.KonaneLogic=api;})(globalThis,function(){
  const SIZE=6;
  const createGame=()=>({board:Array.from({length:36},(_,i)=>(Math.floor(i/SIZE)+i)%2===0?'dark':'light'),turn:'dark',phase:'dark-remove',moves:0});
  const valid=index=>Number.isInteger(index)&&index>=0&&index<36;
  const adjacent=(a,b)=>Math.abs(a-b)===1&&Math.floor(a/SIZE)===Math.floor(b/SIZE)||Math.abs(a-b)===SIZE;
  const removeOpening=(game,index)=>{
    if(!valid(index)||game.board[index]!==game.turn)throw new Error('첫 돌은 내 색 돌만 고를 수 있습니다');
    if(game.phase==='dark-remove')return {...game,board:game.board.map((cell,i)=>i===index?null:cell),phase:'light-remove',opening:index,turn:'light'};
    if(game.phase!=='light-remove'||!adjacent(game.opening,index))throw new Error('밝은 돌은 빈칸 이웃에서 골라야 합니다');
    return {...game,board:game.board.map((cell,i)=>i===index?null:cell),phase:'play',turn:'dark'};
  };
  const legalJumps=(game,from)=>{
    if(game.phase!=='play'||game.board[from]!==game.turn)return [];
    const row=Math.floor(from/SIZE),col=from%SIZE,dirs=[[0,2],[0,-2],[2,0],[-2,0]];
    return dirs.map(([dr,dc])=>[row+dr,col+dc]).filter(([r,c])=>r>=0&&r<SIZE&&c>=0&&c<SIZE).map(([r,c])=>r*SIZE+c).filter(to=>{
      const mid=(from+to)/2; return game.board[mid]&&game.board[mid]!==game.turn&&game.board[to]===null;
    });
  };
  const move=(game,from,to)=>{
    if(!legalJumps(game,from).includes(to))throw new Error('상대 돌 하나를 넘어 빈칸에 착지하세요');
    const mid=(from+to)/2,board=game.board.map((cell,i)=>i===from||i===mid?null:i===to?game.turn:cell);
    return {...game,board,turn:game.turn==='dark'?'light':'dark',moves:game.moves+1};
  };
  const hasMoves=(game,player)=>game.board.some((cell,i)=>cell===player&&legalJumps({...game,turn:player},i).length);
  const winner=game=>game.phase==='play'&&!hasMoves(game,game.turn)?(game.turn==='dark'?'light':'dark'):null;
  return {createGame,removeOpening,legalJumps,move,hasMoves,winner};
});
