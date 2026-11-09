(function(root,factory){const api=factory();if(typeof module!=='undefined')module.exports=api;root.MarbleLogic=api;})(globalThis,function(){
  const createGame=seed=>{if(!Number.isInteger(seed)||seed<1)throw new Error('씨앗은 1 이상 정수여야 합니다');return {seed,player:0,computer:0,turn:'player',winner:null,message:'구슬 하나를 골라 손가락으로 튕겨 보세요'};};
  const takeShot=(game,playerRoll,computerRoll)=>{if(game.winner)return game;const player=Math.min(12,game.player+playerRoll);const computer=Math.min(12,game.computer+computerRoll);const winner=player>=12?'player':computer>=12?'computer':null;return {...game,player,computer,turn:'player',winner,message:winner==='player'?'당신의 구슬이 먼저 열두 칸을 채웠어요!':winner==='computer'?'상대 구슬이 먼저 열두 칸을 채웠어요. 다시 튕겨 볼까요?':`당신 +${playerRoll} · 상대 +${computerRoll} — 다음 구슬을 고르세요`};};
  const resetGame=seed=>createGame(seed);
  return {createGame,takeShot,resetGame};
});
