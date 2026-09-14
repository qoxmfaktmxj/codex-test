'use strict';
(() => {
  const G=globalThis.Shuffleboard;
  const $=id=>document.getElementById(id);
  let state=G.createState(),frame=0,lastTime=0,centerY=160;
  const compact=matchMedia('(max-width:700px)');
  function layoutCourt(){
    // Increase mobile court height in SVG coordinates, never stretch the puck.
    const mobile=compact.matches,bottom=mobile?497:277;
    centerY=mobile?270:160;
    document.querySelector('.court svg').setAttribute('viewBox',`0 0 1000 ${mobile?550:320}`);
    $('lane').setAttribute('height',bottom-41);
    document.querySelectorAll('.zone').forEach(zone=>zone.setAttribute('height',bottom-43));
    $('dividers').setAttribute('d',`M620 43V${bottom}M720 43V${bottom}M820 43V${bottom}`);
    $('guide').setAttribute('d',`M130 43V${bottom}M20 ${centerY}H980`);
    $('direction').setAttribute('d',`M185 ${centerY}H460M440 ${centerY-13}L460 ${centerY}L440 ${centerY+13}`);
    $('lane-note').setAttribute('y',centerY+(mobile?65:43));
    $('edge').setAttribute('d',`M980 35V${bottom+8}`);
    $('edge-label').setAttribute('y',bottom+(mobile?45:33));
    document.querySelectorAll('.zone-labels text').forEach(label=>label.setAttribute('y',mobile?170:111));
    document.querySelectorAll('.zone-names text').forEach(label=>label.setAttribute('y',bottom-37));
    paint();
  }
  compact.addEventListener('change',layoutCourt);
  function paint(){
    $('puck').setAttribute('transform',`translate(${state.puck.x} ${centerY})`);
    $('puck').style.opacity=state.fell?'0.25':'1';
    $('trail').setAttribute('d',`M80 ${centerY}H${state.puck.x}`);
  }
  function render(){
    document.body.dataset.phase=state.phase;
    $('score').textContent=String(state.score).padStart(2,'0');
    $('remaining').textContent=`남은 기회 ${state.remaining}번`;
    $('launch').disabled=state.phase!=='ready';
    $('power').disabled=state.phase!=='ready';
    $('launch').firstChild.textContent=state.phase==='sliding'?'미끄러지는 중 ':state.phase==='finished'?'연습 완료 ':'퍽 밀기 ';
    [...$('history').children].forEach((item,i)=>{const done=i<state.history.length;item.textContent=done?`${state.history[i]}점`:'대기';item.classList.toggle('done',done);item.setAttribute('aria-label',`${i+1}번째: ${item.textContent}`);});
    if(state.phase==='sliding')$('message').textContent='손을 떠난 퍽, 어디에 멈출까요?';
    else if(state.phase==='finished')$('message').textContent=`연습 끝! 총 ${state.score}점 / 15점. 새 판에서 다시 도전하세요.`;
    else if(state.history.length){const points=state.history.at(-1);$('message').textContent=state.fell?'끝을 넘었어요. 0점! 힘을 조금 줄여 보세요.':points?`${points}점! 멈춘 거리를 기억하고 다음 퍽을 밀어 보세요.`:'득점선에 못 미쳤어요. 힘을 조금 더 주세요.';}
    else $('message').textContent='첫 번째 퍽을 밀어 보세요.';
    paint();
  }
  function animate(time){
    if(state.phase!=='sliding')return;
    const dt=lastTime?Math.min((time-lastTime)/1000,.05):1/60;
    lastTime=time;
    if(dt>0)state=G.step(state,dt);
    paint();
    if(state.phase==='sliding')frame=requestAnimationFrame(animate);
    else {frame=0;render();}
  }
  $('power').addEventListener('input',()=>{$('power-value').value=$('power').value;});
  $('launch').addEventListener('click',()=>{
    if(state.phase!=='ready')return;
    state=G.launch(state,Number($('power').value));lastTime=0;render();frame=requestAnimationFrame(animate);
  });
  $('reset').addEventListener('click',()=>{
    cancelAnimationFrame(frame);frame=0;lastTime=0;state=G.createState();$('power').value='65';$('power-value').value='65';render();
  });
  layoutCourt();
  render();
})();
