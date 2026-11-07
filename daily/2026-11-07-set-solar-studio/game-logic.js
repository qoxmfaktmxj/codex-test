(function(root,factory){const api=factory();if(typeof module!=='undefined')module.exports=api;root.SetLogic=api;})(globalThis,function(){
  const keys=['count','shape','fill','color'];
  const isSet=cards=>{if(cards.length!==3)throw new Error('세 장을 골라야 합니다');return keys.every(key=>new Set(cards.map(c=>c[key])).size!==2);};
  const createRound=cards=>({cards,selected:[],score:0,message:'세 장을 고르세요'});
  const choose=(round,index)=>{const selected=round.selected.includes(index)?round.selected.filter(i=>i!==index):round.selected.length<3?[...round.selected,index]:round.selected;return {...round,selected,message:selected.length===3?'선택을 확인하세요':'세 장을 고르세요'};};
  const resolve=round=>{if(round.selected.length!==3)return {...round,message:'세 장을 골라야 합니다'};const ok=isSet(round.selected.map(i=>round.cards[i]));return {...round,selected:[],score:round.score+(ok?1:0),message:ok?'세트를 찾았습니다':'이 조합은 세트가 아닙니다',last:ok?'good':'bad'};};
  return {isSet,createRound,choose,resolve};
});
