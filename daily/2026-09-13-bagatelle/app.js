(()=>{
  'use strict';
  const G=window.Bagatelle,$=id=>document.getElementById(id),NS='http://www.w3.org/2000/svg';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let state=G.createState(),raf=0,lastTime=null,accumulator=0,trail=[];
  function svg(tag,attrs,parent){const el=document.createElementNS(NS,tag);for(const [k,v]of Object.entries(attrs))el.setAttribute(k,v);parent.append(el);return el;}
  G.SCORES.forEach((points,i)=>{svg('rect',{x:26+i*56,y:618,width:52,height:81,rx:18,fill:i===3?'#9c3828':'#506350'},$('slots'));const t=svg('text',{x:52+i*56,y:659,class:'slot-label'},$('slots'));t.textContent=points;const unit=svg('text',{x:52+i*56,y:678,class:'slot-unit'},$('slots'));unit.textContent='점';});
  G.WALLS.forEach(w=>{svg('line',{x1:w.ax,y1:w.ay,x2:w.bx,y2:w.by,stroke:'#71563a','stroke-width':5,'stroke-linecap':'round'},$('rails'));svg('line',{x1:w.ax-1,y1:w.ay,x2:w.bx-1,y2:w.by,stroke:'#efe0ba','stroke-width':1.4,'stroke-linecap':'round'},$('rails'));});
  const pins=G.PEGS.map(p=>svg('circle',{cx:p.x,cy:p.y,r:p.r,fill:'url(#pin)',filter:'url(#shadow)'},$('pegs')));
  const ghosts=Array.from({length:5},()=>svg('circle',{r:4,fill:'#f8efdf',opacity:0},$('trail')));
  for(let i=0;i<G.SHOTS;i++)$('stock-balls').append(document.createElement('i'));
  function paint(){
    const b=state.ball;$('ball').setAttribute('cx',b.x);$('ball').setAttribute('cy',b.y);
    $('ball-shadow').setAttribute('cx',b.x+3);$('ball-shadow').setAttribute('cy',b.y+4);
    const active=state.phase==='rolling';
    if(active&&!reduced.matches){trail.unshift({x:b.x,y:b.y});trail=trail.slice(0,15);}else trail=[];
    ghosts.forEach((el,i)=>{const p=trail[i*3+2];el.setAttribute('opacity',p?(.25-i*.04):0);if(p){el.setAttribute('cx',p.x);el.setAttribute('cy',p.y);}});
    pins.forEach((pin,i)=>pin.classList.toggle('pin-hit',active&&state.hit===i));
  }
  function sync(){
    $('score').textContent=String(state.score).padStart(3,'0');$('remaining').textContent=state.remaining;
    [...$('stock-balls').children].forEach((b,i)=>b.classList.toggle('used',i>=state.remaining));
    [...$('history').children].forEach((li,i)=>{li.textContent=state.history[i]??'—';li.classList.toggle('played',i<state.history.length);li.setAttribute('aria-label',`${i+1}번째 공: ${state.history[i]===undefined?'대기':state.history[i]+'점'}`);});
    const active=state.phase==='rolling';$('launch').disabled=state.phase!=='ready';$('power').disabled=state.phase!=='ready';
    document.querySelector('.cabinet').classList.toggle('rolling',active);
    $('launch-label').textContent=active?'굴러가는 중':state.phase==='finished'?'한 판 완료':'공 쏘기';
    if(state.phase==='finished')$('message').textContent=`다섯 번의 작은 우연, 총 ${state.score}점! 새 판에 도전하세요.`;
    else if(active)$('message').textContent=`${G.SHOTS-state.remaining}번째 공, 어디에 멈출까요?`;
    else if(state.history.length)$('message').textContent=`${state.history.at(-1)}점! 다음 공의 세기를 정해 보세요.`;
    else $('message').textContent='첫 번째 공이 기다리고 있어요.';
    paint();
  }
  function frame(time){
    if(lastTime===null)lastTime=time;
    accumulator+=Math.min((time-lastTime)/1000,.05);lastTime=time;
    while(accumulator>=G.DT&&state.phase==='rolling'){state=G.step(state);accumulator-=G.DT;}
    paint();
    if(state.phase==='rolling')raf=requestAnimationFrame(frame);
    else{raf=0;lastTime=null;accumulator=0;sync();if(state.phase==='finished')$('reset').focus({preventScroll:true});}
  }
  $('controls').addEventListener('submit',event=>{
    event.preventDefault();if(state.phase!=='ready')return;
    state=G.launch(state,Number($('power').value));lastTime=null;accumulator=0;trail=[];sync();raf=requestAnimationFrame(frame);
  });
  $('power').addEventListener('input',()=>{$('power-value').textContent=$('power').value;});
  $('reset').addEventListener('click',()=>{cancelAnimationFrame(raf);raf=0;lastTime=null;accumulator=0;trail=[];state=G.createState();sync();});
  // Do not catch up hidden-tab time: returning resumes the same physical shot.
  document.addEventListener('visibilitychange',()=>{lastTime=null;accumulator=0;});
  sync();
})();
