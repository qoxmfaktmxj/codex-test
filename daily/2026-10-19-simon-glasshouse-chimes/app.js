const { createGame, nextStep, press } = ChimeLogic;
const tones = [...document.querySelectorAll('.tone')];
const message = document.querySelector('#message'); const round = document.querySelector('#round'); const best = document.querySelector('#best'); const start = document.querySelector('#start');
let game; let timer;
const wait = ms => new Promise(resolve => { timer = setTimeout(resolve, ms); });
const paint = () => { round.textContent = game.round; best.textContent = `최고 ${game.best}번째`; message.textContent = game.status === '입력' ? '이제 순서대로 눌러 보세요.' : game.status === '성공' ? '정확해요! 다음 차임을 더합니다.' : game.status === '실패' ? '순서가 달라요. 다시 온실의 소리를 들어보세요.' : '차임의 빛을 기억하세요.'; };
async function showSequence(){ paint(); for(const index of game.sequence){ tones[index].classList.add('active'); await wait(480); tones[index].classList.remove('active'); await wait(180); } game=nextStep(game,Math.random); paint(); }
function begin(){ clearTimeout(timer); game=createGame(Math.random); start.textContent='처음부터 다시 듣기'; showSequence(); }
function play(index){ if(!game||game.status!=='입력')return; tones[index].classList.add('active'); setTimeout(()=>tones[index].classList.remove('active'),180); game=press(game,index); paint(); if(game.status==='성공')setTimeout(()=>{game=nextStep(game,Math.random);showSequence()},650); }
tones.forEach((button,index)=>button.addEventListener('click',()=>play(index))); start.addEventListener('click',begin); document.addEventListener('keydown',event=>{const n=Number(event.key);if(n>=1&&n<=4)play(n-1)});
