(()=>{const L=window.NinepinsLogic,pins=document.querySelector('#pins'),ball=document.querySelector('#ball'),score=document.querySelector('#score'),throws=document.querySelector('#throws'),message=document.querySelector('#message'),lane=document.querySelector('#lane');let game=L.createGame(),aim=0;
 const targets={[-1]:[0,1,3,4],0:[1,2,4,5,7],1:[4,5,6,7,8]};
 const render=()=>{pins.innerHTML='';game.pins.forEach((up,i)=>{const p=document.createElement('i');p.className=\`pin \${up?'':'down'}\`;p.style.setProperty('--i',i);pins.append(p)});score.textContent=game.score;throws.textContent=Math.max(0,2-game.throws);lane.dataset.aim=aim;};
 const roll=()=>{if(L.isComplete(game)){message.textContent='게임이 끝났어요. 새 게임을 시작하세요.';return;}ball.classList.remove('run');void ball.offsetWidth;ball.classList.add('run');setTimeout(()=>{game=L.roll(game,targets[aim]);render();message.textContent=L.isComplete(game)?\`마침! \${game.score}개의 핀을 쓰러뜨렸어요.\`:'좋아요. 한 번 더 굴릴 수 있어요.'},480);};
 const setAim=n=>{aim=n;message.textContent=['왼쪽 핀을 겨냥했어요.','가운데를 겨냥했어요.','오른쪽 핀을 겨냥했어요.'][n+1];render();};
 document.querySelectorAll('[data-aim]').forEach(b=>b.onclick=()=>b.dataset.aim==='0'?roll():setAim(+b.dataset.aim));
 document.querySelector('#reset').onclick=()=>{game=L.createGame();aim=0;message.textContent='공의 방향을 골라 굴리세요.';render();};
 addEventListener('keydown',e=>{if(e.key==='ArrowLeft')setAim(-1);if(e.key==='ArrowRight')setAim(1);if(e.key==='Enter'||e.key===' '){e.preventDefault();roll();}});render();lane.focus();})();
