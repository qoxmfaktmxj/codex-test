(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.Bagatelle=factory();})(globalThis,()=>{
 const SCORES=[10,30,50,100,50,30,10];
 const PEGS=[];for(let row=0;row<7;row++)for(let col=0;col<6;col++)PEGS.push({x:45+col*60+(row%2)*25,y:150+row*48});
 function createState(){return {remaining:5,score:0};}
 function play(state,points){if(state.remaining<=0||!SCORES.includes(points))throw Error('발사할 수 없습니다.');return {remaining:state.remaining-1,score:state.score+points};}
 function simulate(start,power){
  if(!Number.isFinite(start)||start<30||start>370||!Number.isFinite(power)||power<20||power>100)throw Error('발사 설정이 올바르지 않습니다.');
  let x=start,y=45,vx=(start-200)*0.006,vy=power/25;const path=[{x,y}];
  for(let i=0;i<4000&&y<550;i++){
   vy+=0.085;x+=vx;y+=vy;
   if(x<8){x=8;vx=Math.abs(vx)*0.8;}if(x>392){x=392;vx=-Math.abs(vx)*0.8;}
   for(const p of PEGS){let dx=x-p.x,dy=y-p.y,d=Math.hypot(dx,dy);if(d<13){if(d<0.001){dx=0.1;dy=-1;d=Math.hypot(dx,dy);}const nx=dx/d,ny=dy/d;x=p.x+nx*13;y=p.y+ny*13;const dot=vx*nx+vy*ny;if(dot<0){vx-=1.75*dot*nx;vy-=1.75*dot*ny;}if(Math.abs(vx)<0.05)vx=0.12;}}
   vx*=0.998;path.push({x,y});
  }
  // A deterministic anti-stall drain prevents a ball balancing forever on a peg.
  if(y<550){y=550;path.push({x,y});}
  return {path,points:SCORES[Math.min(6,Math.floor(x/(400/7)))]};
 }
 return {SCORES,PEGS,createState,play,simulate};
});
