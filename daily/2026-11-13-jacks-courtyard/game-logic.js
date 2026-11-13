(function(root,factory){const api=factory();if(typeof module!=='undefined')module.exports=api;root.JacksLogic=api;})(globalThis,function(){
  const createGame=count=>{if(!Number.isInteger(count)||count<1)throw new Error('공기알 수는 1 이상이어야 합니다');return {count,round:1,left:1,score:0,last:null,finished:false,message:'1단: 공기알 1개를 집으세요'};};
  const pickJack=(game,jack)=>{if(game.finished)return game;if(!Number.isInteger(jack)||jack<1||jack>game.count)throw new Error('공기알 번호가 올바르지 않습니다');const left=game.left-1;const score=game.score+game.round;if(left===0){if(game.round===5)return {...game,left:0,score,last:jack,finished:true,message:`완성! ${score}점을 얻었습니다`};const round=game.round+1;return {...game,round,left:round,score,last:jack,message:`${round}단: 공기알 ${round}개를 집으세요`};}return {...game,left,score,last:jack,message:`좋아요! ${left}개 남았습니다`};};
  return {createGame,pickJack,resetGame:createGame};
});
