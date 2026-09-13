(()=>{
 const G=Bagatelle,$=id=>document.getElementById(id),ctx=$('board').getContext('2d');let state=G.createState(),frame=0,busy=false;
 function draw(ball={x:Number($('position').value),y:45}){
 ctx.clearRect(0,0,400,600);ctx.fillStyle='#203c40';ctx.fillRect(0,0,400,600);
 ctx.strokeStyle='#466166';ctx.lineWidth=1;for(let i=0;i<7;i++){const x=i*400/7;ctx.fillStyle=i===3?'#936d39':'#29474b';ctx.fillRect(x+2,550,400/7-4,50);ctx.fillStyle='#ffe1a4';ctx.font='bold 17px system-ui';ctx.textAlign='center';ctx.fillText(G.SCORES[i]+'점',x+400/14,581);}
 for(const p of G.PEGS){ctx.beginPath();ctx.arc(p.x,p.y,5,0,Math.PI*2);ctx.fillStyle='#e7b777';ctx.fill();}
 ctx.beginPath();ctx.arc(ball.x,ball.y,8,0,Math.PI*2);ctx.fillStyle='#fff5de';ctx.shadowColor='#fff4cc';ctx.shadowBlur=12;ctx.fill();ctx.shadowBlur=0;
 }
 function render(){ $('score').textContent=state.score+'점';$('remaining').textContent=state.remaining+'개';$('launch').disabled=busy||state.remaining===0;$('position').disabled=$('power').disabled=busy;}
 $('launch').onclick=()=>{if(busy||!state.remaining)return;busy=true;render();const result=G.simulate(Number($('position').value),Number($('power').value));$('message').textContent='공이 굴러갑니다…';let start;
 function animate(time){if(start===undefined)start=time;const i=Math.min(result.path.length-1,Math.floor((time-start)/8));draw(result.path[i]);if(i<result.path.length-1){frame=requestAnimationFrame(animate);return;}state=G.play(state,result.points);busy=false;render();$('message').textContent=state.remaining?`${result.points}점! 다음 공의 위치와 세기를 조절하세요.`:`게임 끝! 다섯 공으로 총 ${state.score}점입니다.`;}
 frame=requestAnimationFrame(animate);};
 $('reset').onclick=()=>{cancelAnimationFrame(frame);state=G.createState();busy=false;render();draw();$('message').textContent='새 게임입니다. 위치와 세기를 정해 주세요.';};
 for(const id of ['position','power'])$(id).oninput=()=>{$(id+'-value').textContent=$(id).value;if(!busy)draw();};render();draw();
})();
