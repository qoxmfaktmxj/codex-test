(function(root,factory){const api=factory();if(typeof module!=='undefined')module.exports=api;root.CribbageLogic=api;})(globalThis,function(){
  const createGame=values=>({cards:values.map((value,index)=>({id:index+1,value,scored:false})),selectedIds:[],scoredIds:[],score:0});
  const chooseCard=(game,id)=>{const card=game.cards.find(item=>item.id===id);if(!card||card.scored)throw new Error('이미 점수에 반영한 카드');const selected=game.selectedIds.includes(id)?game.selectedIds.filter(item=>item!==id):game.selectedIds.length===2?[id]:[...game.selectedIds,id];const sum=selected.reduce((total,item)=>total+game.cards.find(card=>card.id===item).value,0);if(sum!==15)return {...game,selectedIds:selected};return {...game,cards:game.cards.map(item=>selected.includes(item.id)?{...item,scored:true}:item),selectedIds:[],scoredIds:[...game.scoredIds,...selected],score:game.score+2};};
  const isComplete=game=>game.cards.every(card=>card.scored);return{createGame,chooseCard,isComplete};
});
