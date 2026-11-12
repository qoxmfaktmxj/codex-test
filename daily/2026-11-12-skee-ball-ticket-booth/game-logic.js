(function(root,factory){const api=factory();if(typeof module!=='undefined')module.exports=api;root.SkeeLogic=api;})(globalThis,function(){
  const createGame=seed=>{if(!Number.isInteger(seed)||seed<1)throw new Error('씨앗은 1 이상 정수여야 합니다');return {seed,balls:9,score:0,last:null,finished:false,message:'공을 굴려 티켓을 모으세요'};};
  const rollBall=(game,points)=>{if(game.finished)return game;if(![10,20,30,50,100].includes(points))throw new Error('점수는 정해진 포켓 점수여야 합니다');const balls=game.balls-1;const score=game.score+points;return {...game,balls,score,last:points,finished:balls===0,message:balls===0?`마감! 티켓 ${score}장입니다`:`${points}점 포켓! 다음 공을 굴리세요`};};
  const pointsForPocket=name=>({보너스:100,중앙:50,중간:30,안쪽:20,바깥:10}[name]||0);
  return {createGame,rollBall,resetGame:createGame,pointsForPocket};
});
