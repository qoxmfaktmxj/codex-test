(function(root,factory){const api=factory();if(typeof module!=='undefined')module.exports=api;root.GooseLogic=api;})(globalThis,function(){
  const last=24, names=['첫 번째 거위','두 번째 거위'];
  const createGame=()=>({players:names.map(name=>({name,position:0})),turn:0,winner:null,lastRoll:null,message:'첫 번째 거위 차례 · 주사위를 굴리세요'});
  const finishAt=(game,position)=>({...game,players:game.players.map((p,i)=>i===game.turn?{...p,position}:p),winner:game.turn,message:game.players[game.turn].name+'가 강 어귀에 도착했습니다!'});
  const roll=(game,random=Math.random)=>{
    if(game.winner!==null)return game;
    const value=Math.max(1,Math.min(6,Math.floor(random()*6)+1));
    const position=Math.min(last,game.players[game.turn].position+value);
    if(position===last)return {...finishAt(game,position),lastRoll:value};
    const turn=(game.turn+1)%2;
    return {...game,players:game.players.map((p,i)=>i===game.turn?{...p,position}:p),turn,lastRoll:value,message:names[turn]+' 차례 · 주사위를 굴리세요'};
  };
  return {createGame,roll,resetGame:createGame,finishAt,last};
});
