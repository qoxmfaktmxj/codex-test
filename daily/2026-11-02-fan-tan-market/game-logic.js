(function(root,factory){const api=factory();if(typeof module!=='undefined')module.exports=api;root.FanTanLogic=api;})(globalThis,function(){
  const createGame=cards=>({cards:cards.map(card=>({...card})),rows:{red:{min:2,max:2},blue:{min:2,max:2}},played:[]});
  const playableCards=game=>game.cards.filter(card=>{if(game.played.includes(card.id))return false;if(card.rank===2)return true;const started=game.played.some(id=>id===`${card.suit}-2`);return started&&(card.rank===game.rows[card.suit].min-1||card.rank===game.rows[card.suit].max+1);});
  const playCard=(game,id)=>{const card=game.cards.find(item=>item.id===id);if(!card||game.played.includes(id))throw new Error('찾을 수 없는 패');if(!playableCards(game).some(item=>item.id===id))throw new Error('놓을 수 없는 패');const row={...game.rows[card.suit]};if(card.rank<row.min)row.min=card.rank;if(card.rank>row.max)row.max=card.rank;return {...game,rows:{...game.rows,[card.suit]:row},played:[...game.played,id]};};
  const isComplete=game=>game.played.length===game.cards.length;return{createGame,playableCards,playCard,isComplete};
});
