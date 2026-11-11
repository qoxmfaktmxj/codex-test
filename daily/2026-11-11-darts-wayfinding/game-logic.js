(function(root,factory){const api=factory();if(typeof module!=='undefined')module.exports=api;root.DartsLogic=api;})(globalThis,function(){
  const createGame=seed=>{if(!Number.isInteger(seed)||seed<1)throw new Error('씨앗은 1 이상 정수여야 합니다');return {seed,remaining:301,throws:0,last:null,bust:false,winner:false,message:'원판을 눌러 301점을 정확히 비우세요'};};
  const scoreThrow=(game,score)=>{
    if(!Number.isInteger(score)||score<0||score>60)throw new Error('점수는 0에서 60 사이 정수여야 합니다');
    if(game.winner)return game;
    const after=game.remaining-score;
    if(after<0)return {...game,throws:game.throws+1,last:score,bust:true,message:'버스트! 남은 점수보다 크게 던졌어요'};
    const winner=after===0;
    return {...game,remaining:after,throws:game.throws+1,last:score,bust:false,winner,message:winner?'정확히 0점! 길찾기 챔피언입니다':'좋아요. 다음 다트를 던지세요'};
  };
  return {createGame,scoreThrow,resetGame:createGame};
});
