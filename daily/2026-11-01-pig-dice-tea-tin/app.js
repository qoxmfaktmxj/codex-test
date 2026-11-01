(() => {
  const { createGame, roll, hold } = window.PigDiceLogic;
  const scores = [document.querySelector('#score0'), document.querySelector('#score1')];
  const die = document.querySelector('#dice'), turn = document.querySelector('#turn'), pot = document.querySelector('#turn-score'), status = document.querySelector('#status');
  const rollButton = document.querySelector('#roll'), holdButton = document.querySelector('#hold');
  let game = createGame(30);
  const names = ['첫째 찻잔', '둘째 찻잔'];
  const face = value => { die.dataset.face = value || 0; die.classList.remove('toss'); void die.offsetWidth; die.classList.add('toss'); };
  const render = message => { scores.forEach((node,index)=>node.textContent=game.scores[index]); pot.textContent=game.turnScore; turn.textContent=game.winner===null?`${names[game.player]} 차례`:`${names[game.winner]} 승리`; rollButton.disabled=game.winner!==null; holdButton.disabled=game.winner!==null||game.turnScore===0; status.textContent=message; };
  const playRoll = () => { if(game.winner!==null)return; const value=Math.floor(Math.random()*6)+1; game=roll(game,value); face(value); render(value===1?'1이 나왔습니다. 이번 잔은 비고 상대에게 넘어갑니다.':`${value}이 나왔습니다. 더 굴리거나 점수를 넣으세요.`); };
  const playHold = () => { if(!game.turnScore||game.winner!==null)return; game=hold(game); render(game.winner===null?'점수를 은행에 넣었습니다. 다음 찻잔 차례입니다.':`${names[game.winner]}이 30점을 채웠습니다!`); };
  rollButton.addEventListener('click',playRoll); holdButton.addEventListener('click',playHold);
  document.querySelector('#reset').addEventListener('click',()=>{game=createGame(30);face(0);render('새 깡통을 열었습니다. 주사위를 굴리세요.');});
  window.addEventListener('keydown',event=>{if(event.key.toLowerCase()==='r')playRoll();if(event.key.toLowerCase()==='h')playHold();});
  face(0); render('주사위를 굴려 첫 잔을 따르세요.');
})();
