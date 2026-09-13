(function(root,factory){
  if(typeof module==='object'&&module.exports) module.exports=factory();
  else root.Bagatelle=factory();
})(globalThis,()=>{
  'use strict';
  const DT=1/120,RADIUS=8,GRAVITY=680,SHOTS=5;
  const SCORES=Object.freeze([10,20,50,100,50,20,10]);
  const PEGS=Object.freeze([
    [88,170],[180,138],[288,145],[368,185],
    [125,250],[170,220],[215,250],[170,290],
    [288,280],[334,312],[288,345],[245,312],
    [75,350],[120,390],[170,355],
    [190,445],[240,410],[290,450],[355,415],
    [66,480],[120,510],[162,485],[220,530],[277,505],[335,525],[378,480],
    [78,574],[135,574],[191,574],[248,574],[305,574],[363,574]
  ].map(([x,y])=>Object.freeze({x,y,r:5})));
  const WALLS=Object.freeze([
    {ax:20,ay:100,bx:20,by:690},{ax:20,ay:100,bx:64,by:18},
    {ax:64,ay:18,bx:420,by:18},{ax:420,ay:18,bx:464,by:100},
    {ax:464,ay:100,bx:464,by:690},{ax:420,ay:150,bx:420,by:690},
    ...Array.from({length:6},(_,i)=>({ax:24+(i+1)*56,ay:620,bx:24+(i+1)*56,by:700}))
  ].map(Object.freeze));
  function createState(){return {remaining:SHOTS,score:0,history:[],phase:'ready',ball:{x:442,y:630,vx:0,vy:0},elapsed:0,hit:null};}
  function launch(state,power){
    if(!Number.isFinite(power)||power<20||power>100)throw Error('발사 세기는 20부터 100 사이여야 합니다.');
    if(state.phase!=='ready'||state.remaining<=0)throw Error('지금은 발사할 수 없습니다.');
    return {...state,remaining:state.remaining-1,phase:'rolling',elapsed:0,hit:null,ball:{x:442,y:630,vx:0,vy:-(870+power*3)}};
  }
  function reflect(ball,nx,ny,depth,restitution){
    const dot=ball.vx*nx+ball.vy*ny;
    return {...ball,x:ball.x+nx*depth,y:ball.y+ny*depth,
      vx:dot<0?ball.vx-(1+restitution)*dot*nx:ball.vx,
      vy:dot<0?ball.vy-(1+restitution)*dot*ny:ball.vy};
  }
  function collidePeg(ball,peg){
    const dx=ball.x-peg.x,dy=ball.y-peg.y,d=Math.hypot(dx,dy),limit=RADIUS+peg.r;
    if(d>=limit)return ball;
    // An exactly balanced ball gets a tiny physical sideways bias, never a drain teleport.
    const nx=d>1e-8?dx/d:1,ny=d>1e-8?dy/d:0;
    const next=reflect(ball,nx,ny,limit-d,0.64);
    if(Math.abs(next.vx)<0.35&&ny<-.8)next.vx=1.5;
    return next;
  }
  function collideWall(ball,w){
    const dx=w.bx-w.ax,dy=w.by-w.ay;
    const t=Math.max(0,Math.min(1,((ball.x-w.ax)*dx+(ball.y-w.ay)*dy)/(dx*dx+dy*dy)));
    const px=w.ax+t*dx,py=w.ay+t*dy,ox=ball.x-px,oy=ball.y-py,d=Math.hypot(ox,oy);
    if(d>=RADIUS+2)return ball;
    const len=Math.hypot(dx,dy);
    return reflect(ball,d>1e-8?ox/d:-dy/len,d>1e-8?oy/d:dx/len,RADIUS+2-d,0.72);
  }
  function step(state,dt=DT){
    if(!Number.isFinite(dt)||dt<=0||dt>1/60)throw Error('물리 시간 간격이 올바르지 않습니다.');
    if(state.phase!=='rolling')return state;
    let ball={...state.ball},hit=null;
    // Substeps prevent fast launches from passing through narrow rails or pins.
    const n=Math.ceil(dt/DT),h=dt/n;
    for(let j=0;j<n;j++){
      ball.vy+=GRAVITY*h;ball.vx*=Math.exp(-0.12*h);
      ball.x+=ball.vx*h;ball.y+=ball.vy*h;
      for(const w of WALLS)ball=collideWall(ball,w);
      for(let i=0;i<PEGS.length;i++){const next=collidePeg(ball,PEGS[i]);if(next!==ball)hit=i;ball=next;}
    }
    if(ball.y>=680&&ball.vy>0){
      const points=ball.x>420?0:SCORES[Math.max(0,Math.min(6,Math.floor((ball.x-24)/56)))];
      return {...state,ball,hit,elapsed:state.elapsed+dt,score:state.score+points,history:[...state.history,points],phase:state.remaining===0?'finished':'ready'};
    }
    return {...state,ball,hit,elapsed:state.elapsed+dt};
  }
  return {DT,RADIUS,SHOTS,SCORES,PEGS,WALLS,createState,launch,step,collidePeg,collideWall};
});
