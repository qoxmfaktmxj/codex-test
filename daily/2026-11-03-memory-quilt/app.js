(()=>{
  const {createGame,revealCard,isComplete}=window.MemoryQuiltLogic;
  const values=['별','잎','집','물결','해','꽃','새','구름'];
  const board=document.querySelector('#board'),found=document.querySelector('#found'),turns=document.querySelector('#turns'),status=document.querySelector('#status');
  let game, preview=[], busy=false;
  const shuffled=()=>[...values,...values].sort(()=>Math.random()-.5);
  function render(){
    board.innerHTML='';
    game.cards.forEach(card=>{
      const button=document.createElement('button'); button.type='button'; button.className=`patch ${card.state}`;
      const shown=card.state!=='hidden'||preview.includes(card.id);
      button.setAttribute('aria-label',shown?`${card.value} 무늬 천 조각`:'뒤집힌 천 조각');
      button.disabled=card.state==='matched'||busy; button.innerHTML=`<span>${shown?card.value:'✦'}</span>`;
      if(shown)button.classList.add(card.state==='matched'?'matched':'open');
      button.addEventListener('click',()=>{try{const first=game.cards.find(item=>item.state==='open');const next=revealCard(game,card.id);if(first&&next.cards[first.id].state==='hidden'){preview=[first.id,card.id];busy=true;game=next;render();setTimeout(()=>{preview=[];busy=false;render();},650);return;}game=next;update();}catch(e){status.textContent=e.message;}}); board.append(button);
    });
    const matched=game.cards.filter(card=>card.state==='matched').length/2; found.textContent=`${matched} / 8`; turns.textContent=game.turns;
    if(isComplete(game))status.textContent=`이불 완성! ${game.turns}차례 만에 모든 무늬를 찾았어요.`;
    else if(game.cards.some(card=>card.state==='open'))status.textContent='한 장 더 뒤집어 같은 무늬를 찾으세요.';
    else status.textContent='천 조각을 두 장 뒤집어 보세요.';
  }
  const update=render;
  document.querySelector('#reset').addEventListener('click',()=>{preview=[];busy=false;game=createGame(shuffled());render();});
  game=createGame(shuffled());render();
})();
