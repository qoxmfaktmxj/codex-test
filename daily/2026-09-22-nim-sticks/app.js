(()=>{'use strict';
  const board=document.querySelector('#workbench'),status=document.querySelector('#status');
  let state=Nim.createState(),busy=false,timer=null;
  const names=['첫째 더미','둘째 더미','셋째 더미'];
  function render(){
    board.innerHTML='';
    state.piles.forEach((count,pile)=>{
      const tray=document.createElement('section');
      tray.className='pile';
      tray.innerHTML=`<div class="pile-label"><span>${names[pile]}</span><b>${count}</b></div><div class="sticks" aria-label="${names[pile]} ${count}개"></div>`;
      const sticks=tray.querySelector('.sticks');
      for(let i=0;i<count;i++){
        const button=document.createElement('button');
        button.className='stick';button.type='button';button.disabled=state.turn!=='human'||busy;
        button.style.setProperty('--order',i);
        button.setAttribute('aria-label',`${names[pile]}에서 ${count-i}개 가져가기`);
        button.addEventListener('click',()=>play(pile,count-i));sticks.append(button);
      }
      board.append(tray);
    });
    if(state.phase==='finished')status.textContent=state.winner==='human'?'당신의 승리! 마지막 불씨를 가져갔습니다.':'컴퓨터의 승리! 새 성냥을 꺼내 보세요.';
    else status.textContent=state.turn==='human'?'당신 차례 — 성냥을 누르세요.':'컴퓨터가 고르고 있습니다…';
  }
  function play(pile,count){
    if(busy||state.turn!=='human'||!Nim.isLegalMove(state,pile,count))return;
    state=Nim.take(state,pile,count);render();status.focus();
    if(state.phase==='playing'){
      busy=true;render();
      timer=setTimeout(()=>{timer=null;state=Nim.computerMove(state).state;busy=false;render();status.focus()},520);
    }
  }
  document.querySelector('#reset').addEventListener('click',()=>{if(timer)clearTimeout(timer);timer=null;busy=false;state=Nim.createState();render();status.focus()});
  render();
})();
