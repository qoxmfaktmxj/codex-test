(()=>{
  const {createGame,rollDice,toggleTile,closeSelection,isComplete,hasMatch}=window.ShellBoxLogic;
  const board=document.querySelector('#board'),left=document.querySelector('#left'),roll=document.querySelector('#roll'),sum=document.querySelector('#sum'),status=document.querySelector('#status'),dice=document.querySelector('#dice'),close=document.querySelector('#close');
  let game=createGame();
  const total=()=>game.selected.reduce((n,value)=>n+value,0);
  function render(){
    board.innerHTML='';
    game.tiles.forEach((tile,index)=>{
      const button=document.createElement('button');button.type='button';button.className=`tile ${game.selected.includes(tile)?'selected':''}`;button.style.setProperty('--i',index);button.style.setProperty('--count',game.tiles.length);button.textContent=tile;button.setAttribute('aria-label',`${tile}번 자개 조각`);button.disabled=game.roll===null;
      button.addEventListener('click',()=>{try{game=toggleTile(game,tile);status.textContent='합이 이번 눈과 같아지면 조각을 접으세요.';render();}catch(error){status.textContent=error.message;}});board.append(button);
    });
    left.textContent=game.tiles.length;roll.textContent=game.roll===null?'—':game.roll;sum.textContent=total();
    dice.disabled=game.roll!==null||isComplete(game);close.disabled=game.roll===null||total()!==game.roll;
    if(isComplete(game))status.textContent=`부채를 모두 접었습니다! ${game.turns}번 만에 성공했어요.`;
  }
  dice.addEventListener('click',()=>{const value=1+Math.floor(Math.random()*6)+1+Math.floor(Math.random()*6);game=rollDice(game,value);roll.classList.remove('shake');void roll.offsetWidth;roll.classList.add('shake');status.textContent=hasMatch(game.tiles,value)?`합계 ${value}입니다. 숫자 조각을 고르세요.`:'맞는 조합이 없습니다. 이번 부채는 여기까지예요. 새 부채를 펼쳐 보세요.';render();});
  close.addEventListener('click',()=>{try{game=closeSelection(game);status.textContent='자개 조각이 부채 중심으로 접혔습니다.';render();}catch(error){status.textContent=error.message;}});
  document.querySelector('#reset').addEventListener('click',()=>{game=createGame();status.textContent='새 부채를 펼쳤습니다. 주사위를 굴려 보세요.';render();});render();
})();
