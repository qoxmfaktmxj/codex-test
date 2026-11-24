(function(root,factory){const api=factory();if(typeof module!=='undefined')module.exports=api;root.QirkatLogic=api;})(globalThis,function(){
const players=['청록 안료','적토 안료'];
const other=p=>p===players[0]?players[1]:players[0];
const row=i=>Math.floor(i/5),col=i=>i%5;
const inBoard=(r,c)=>r>=0&&r<5&&c>=0&&c<5;
const index=(r,c)=>r*5+c;
const directions=[[-1,0],[1,0],[0,-1],[0,1]];
const createBoard=()=>[...Array(25)].map((_,i)=>row(i)<2?players[1]:row(i)>2?players[0]:null);
const captures=(board,from,player)=>directions.map(([dr,dc])=>{const r=row(from),c=col(from),mid=index(r+dr,c+dc),land=index(r+dr*2,c+dc*2);return inBoard(r+dr*2,c+dc*2)&&board[mid]===other(player)&&!board[land]?{mid,land}:null;}).filter(Boolean);
const steps=(board,from,player)=>directions.filter(([dr,dc])=>dr===(player===players[0]?-1:1)||dr===0).map(([dr,dc])=>index(row(from)+dr,col(from)+dc)).filter(to=>inBoard(row(from)+Math.sign(row(to)-row(from)),col(from)+Math.sign(col(to)-col(from)))&&!board[to]);
const allCaptures=(board,player)=>board.flatMap((piece,i)=>piece===player?captures(board,i,player).map(x=>({from:i,...x})):[]);
const hasMoves=(board,player)=>allCaptures(board,player).length>0||board.some((piece,i)=>piece===player&&steps(board,i,player).length);
const createGame=()=>({board:createBoard(),turn:players[0],selected:null,chain:false,captured:{[players[0]]:0,[players[1]]:0},winner:null,message:players[0]+' 차례 · 안료 조각을 고르세요'});
const finish=(g,board,captured)=>{const opponent=other(g.turn);const winner=board.every(x=>x!==opponent)||!hasMoves(board,opponent)?g.turn:null;const turn=winner?g.turn:opponent;return {...g,board,captured,turn,selected:null,chain:false,winner,message:winner?g.turn+'이 모래 탁자를 지켰습니다!':turn+' 차례 · 안료 조각을 고르세요'};};
const select=(g,from)=>{if(g.winner||!Number.isInteger(from)||g.board[from]!==g.turn)return {...g,message:'지금 움직일 안료 조각을 고르세요'};if(g.chain&&from!==g.selected)return {...g,message:'같은 안료 조각으로 계속 뛰어넘으세요'};return {...g,selected:from,message:'빛나는 빈 자리를 고르세요'};};
const move=(g,to)=>{if(g.winner||g.selected===null||!Number.isInteger(to)||to<0||to>24||g.board[to])return {...g,message:'빈 착지점을 고르세요'};const from=g.selected,forced=allCaptures(g.board,g.turn),jump=captures(g.board,from,g.turn).find(x=>x.land===to);if(forced.length&&!jump)return {...g,message:'잡을 수 있을 때는 반드시 뛰어넘어야 합니다'};if(!forced.length&&!steps(g.board,from,g.turn).includes(to))return {...g,message:'이웃한 선으로만 움직일 수 있습니다'};const board=g.board.slice(),captured={...g.captured};board[to]=g.turn;board[from]=null;if(jump){board[jump.mid]=null;captured[g.turn]++;const more=captures(board,to,g.turn);if(more.length)return {...g,board,captured,selected:to,chain:true,message:'계속 뛰어넘을 수 있습니다 · 다음 착지점을 고르세요'};}return finish(g,board,captured);};
return{createGame,select,move,resetGame:createGame,players,captures,steps};
});
