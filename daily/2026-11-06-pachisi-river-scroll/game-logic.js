(function(root,factory){const api=factory();if(typeof module!=='undefined')module.exports=api;root.PachisiLogic=api;})(globalThis,function(){
  const createGame=()=>({pieces:{reed:0,ink:0},turn:'reed',roll:null,turns:0});
  const roll=(game,value)=>{
    if(!Number.isInteger(value)||value<1||value>4)throw new Error('막대 값은 1부터 4까지입니다');
    if(game.roll!==null)throw new Error('이미 막대를 던졌습니다');
    return {...game,roll:value};
  };
  const move=game=>{
    if(game.roll===null)throw new Error('먼저 막대를 던지세요');
    const next=game.pieces[game.turn]+game.roll;
    if(next>10)return {...game,roll:null,turn:game.turn==='reed'?'ink':'reed',turns:game.turns+1,skipped:true};
    const pieces={...game.pieces,[game.turn]:next};
    return {...game,pieces,roll:null,turn:game.roll===4?game.turn:(game.turn==='reed'?'ink':'reed'),turns:game.turns+1,skipped:false};
  };
  const winner=game=>game.pieces.reed===10?'reed':game.pieces.ink===10?'ink':null;
  return {createGame,roll,move,winner};
});
