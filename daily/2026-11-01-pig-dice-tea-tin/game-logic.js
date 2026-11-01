(function(root,factory){const api=factory();if(typeof module!=='undefined')module.exports=api;root.PigDiceLogic=api;})(globalThis,function(){
  const createGame=(target=30)=>({target,scores:[0,0],player:0,turnScore:0,winner:null,lastRoll:null});
  const ensureActive=game=>{if(game.winner!==null)throw new Error('끝난 게임입니다');};
  const roll=(game,value)=>{ensureActive(game);if(!Number.isInteger(value)||value<1||value>6)throw new Error('주사위는 1에서 6 사이여야 합니다');if(value===1)return {...game,player:1-game.player,turnScore:0,lastRoll:value};return {...game,turnScore:game.turnScore+value,lastRoll:value};};
  const hold=game=>{ensureActive(game);const total=game.scores[game.player]+game.turnScore;const scores=game.scores.map((score,index)=>index===game.player?total:score);return {...game,scores,turnScore:0,winner:total>=game.target?game.player:null,player:total>=game.target?game.player:1-game.player};};
  const isComplete=game=>game.winner!==null;return{createGame,roll,hold,isComplete};
});
