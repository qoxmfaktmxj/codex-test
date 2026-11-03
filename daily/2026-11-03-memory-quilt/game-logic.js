(function(root,factory){const api=factory();if(typeof module!=='undefined')module.exports=api;root.MemoryQuiltLogic=api;})(globalThis,function(){
  const createGame=values=>({cards:values.map((value,index)=>({id:index,value,state:'hidden'})),turns:0});
  const revealCard=(game,id)=>{
    const target=game.cards[id];
    if(!target||target.state!=='hidden')throw new Error('뒤집을 수 없는 조각');
    const opened=game.cards.filter(card=>card.state==='open');
    if(opened.length===2)throw new Error('뒤집을 수 없는 조각');
    let cards=game.cards.map(card=>card.id===id?{...card,state:'open'}:card);
    const nowOpen=cards.filter(card=>card.state==='open');
    let turns=game.turns;
    if(nowOpen.length===2){
      turns+=1;
      if(nowOpen[0].value===nowOpen[1].value)cards=cards.map(card=>card.state==='open'?{...card,state:'matched'}:card);
      else cards=cards.map(card=>card.state==='open'?{...card,state:'hidden'}:card);
    }
    return {...game,cards,turns};
  };
  const isComplete=game=>game.cards.length>0&&game.cards.every(card=>card.state==='matched');
  return {createGame,revealCard,isComplete};
});
