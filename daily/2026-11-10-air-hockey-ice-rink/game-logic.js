(function(root,factory){const api=factory();if(typeof module!=='undefined')module.exports=api;root.HockeyLogic=api;})(globalThis,function(){
  const WIDTH=400, HEIGHT=500, GOAL=92, WIN=5;
  const createGame=seed=>{if(!Number.isInteger(seed)||seed<1)throw new Error('씨앗은 1 이상 정수여야 합니다');return {seed,player:0,computer:0,winner:null,paddle:{x:200,y:430},cpu:{x:200,y:70},puck:{x:200,y:250,vx:2.8,vy:3.6},message:'퍽을 밀어 첫 골을 넣으세요'};};
  const movePaddle=(game,x,y)=>({...game,paddle:{x:Math.max(28,Math.min(WIDTH-28,x)),y:Math.max(275,Math.min(HEIGHT-28,y))}});
  const resetPuck=(game,vy)=>({...game,puck:{x:200,y:250,vx:game.seed%2?2.8:-2.8,vy}});
  const stepGame=game=>{
    if(game.winner)return game;
    let {x,y,vx,vy}=game.puck;
    x+=vx;y+=vy;
    if(x<14||x>WIDTH-14){vx*=-1;x=Math.max(14,Math.min(WIDTH-14,x));}
    const hit=(p,limit)=>Math.hypot(x-p.x,y-p.y)<limit;
    if(vy>0&&hit(game.paddle,34)){vy=-Math.abs(vy)-.25;vx+=(x-game.paddle.x)*.12;y=game.paddle.y-35;}
    const cpuX=Math.max(35,Math.min(365,game.cpu.x+(x-game.cpu.x)*.075));
    const cpuY=Math.max(45,Math.min(190,game.cpu.y+(y-game.cpu.y)*.035));
    if(vy<0&&hit({x:cpuX,y:cpuY},32)){vy=Math.abs(vy)+.18;vx+=(x-cpuX)*.1;y=cpuY+34;}
    const base={...game,cpu:{x:cpuX,y:cpuY},puck:{x,y,vx:Math.max(-7,Math.min(7,vx)),vy:Math.max(-8,Math.min(8,vy))}};
    if(y<8&&x>(WIDTH-GOAL)/2&&x<(WIDTH+GOAL)/2){const player=game.player+1;const won=player>=WIN;return {...resetPuck({...base,player,winner:won?'player':null},3.6),message:won?'당신의 승리! 새 경기를 시작해 보세요':'득점! 다음 퍽을 받아내세요'};}
    if(y>HEIGHT-8&&x>(WIDTH-GOAL)/2&&x<(WIDTH+GOAL)/2){const computer=game.computer+1;const won=computer>=WIN;return {...resetPuck({...base,computer,winner:won?'computer':null},-3.6),message:won?'상대가 5점을 먼저 냈어요. 다시 도전하세요':'상대 득점. 중앙으로 돌아갑니다'};}
    return base;
  };
  return {createGame,movePaddle,stepGame,resetGame:createGame,WIDTH,HEIGHT,WIN};
});
