(()=>{
  const {createGame,drawLine,availableLines,resetGame}=window.DotsPostLogic;
  const size=4; let game=createGame(size); let timers=[];
  const board=document.querySelector('#board'),status=document.querySelector('#status'),my=document.querySelector('#my-score'),post=document.querySelector('#post-score');
  const clearTimers=()=>{timers.forEach(clearTimeout);timers=[];};
  const later=(fn,ms)=>{const id=setTimeout(()=>{timers=timers.filter(timer=>timer!==id);fn();},ms);timers.push(id);};
  const line=(id,axis)=>{const [,row,col]=id.split('-');const button=document.createElement('button');button.type='button';button.className=`line ${axis} ${game.lines[id]?'drawn '+game.lines[id]:''}`;button.dataset.id=id;button.setAttribute('aria-label',`${axis==='h'?'가로':'세로'} ${Number(row)+1}행 ${Number(col)+1}열 선 긋기`);button.disabled=!!game.lines[id]||game.turn!=='나'||game.finished;button.addEventListener('click',()=>play(id));return button;};
  const dot=()=>{const el=document.createElement('i');el.className='dot';return el;};
  function render(){board.innerHTML='';board.style.setProperty('--size',size);for(let row=0;row<=size;row++){const rowEl=document.createElement('div');rowEl.className='point-row';for(let col=0;col<=size;col++){rowEl.append(dot());if(col<size)rowEl.append(line(`h-${row}-${col}`,'h'));}board.append(rowEl);if(row<size){const middle=document.createElement('div');middle.className='middle-row';for(let col=0;col<=size;col++){middle.append(line(`v-${row}-${col}`,'v'));if(col<size){const box=document.createElement('div'),owner=game.boxes[`${row}-${col}`];box.className='stamp '+(owner||'');box.textContent=owner==='나'?'나':'우체국';box.setAttribute('aria-hidden',owner?'false':'true');middle.append(box);}}board.append(middle);}}my.textContent=game.scores.나;post.textContent=game.scores.우체국;status.textContent=game.message;}
  function computerTurn(){if(game.turn!=='우체국'||game.finished)return;const choices=availableLines(game);const pick=choices.find(candidate=>drawLine(game,candidate).scores.우체국>game.scores.우체국)||choices[0];if(!pick)return;game=drawLine(game,pick);render();if(game.turn==='우체국'&&!game.finished)later(computerTurn,350);}
  function play(id){if(game.turn!=='나'||game.finished)return;game=drawLine(game,id);render();if(game.turn==='우체국'&&!game.finished)later(computerTurn,420);}
  document.querySelector('#reset').addEventListener('click',()=>{clearTimers();game=resetGame(size);render();});render();
})();
