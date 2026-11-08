(function(root,factory){const api=factory();if(typeof module!=='undefined')module.exports=api;root.KenoLogic=api;})(globalThis,function(){
  const validDrawn=drawn=>Array.isArray(drawn)&&drawn.length===5&&new Set(drawn).size===5;
  const createRound=drawn=>{if(!validDrawn(drawn))throw new Error('다섯 개의 서로 다른 추첨 번호가 필요합니다');return {drawn:[...drawn],picks:[],hits:null,message:'번호를 고르세요'};};
  const togglePick=(round,number)=>round.hits!==null?round:({ ...round,picks:round.picks.includes(number)?round.picks.filter(n=>n!==number):round.picks.length<5?[...round.picks,number]:round.picks,hits:null,message:'번호를 고르세요'});
  const countHits=(picks,drawn)=>picks.filter(n=>drawn.includes(n)).length;
  const settleRound=round=>{if(round.picks.length!==5)return {...round,message:'다섯 칸을 모두 고르세요'};const hits=countHits(round.picks,round.drawn);const words=['아쉽습니다. 다시 골라 보세요','한 칸 적중!','두 칸 적중!','세 칸 적중!','네 칸 적중!','대성공! 다섯 칸 적중!'];return {...round,hits,message:words[hits]};};
  return {createRound,togglePick,countHits,settleRound};
});
