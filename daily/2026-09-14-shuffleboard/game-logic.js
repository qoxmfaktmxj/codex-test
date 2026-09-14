(function(root){
  'use strict';
  const RADIUS=20, FRICTION=400;
  function createState(){return {phase:'ready',remaining:5,score:0,history:[],puck:{x:80,v:0},fell:false};}
  function scoreAt(x){
    if(!Number.isFinite(x)||x+RADIUS>980)return 0;
    if(x-RADIUS>=820)return 3;
    if(x-RADIUS>=720)return 2;
    if(x-RADIUS>=620)return 1;
    return 0;
  }
  function launch(state,power){
    if(state.phase!=='ready'||!Number.isFinite(power)||power<1||power>100)throw new Error('지금은 밀 수 없거나 세기가 잘못되었습니다.');
    return {...state,phase:'sliding',remaining:state.remaining-1,puck:{x:80,v:power*11},fell:false};
  }
  function step(state,dt=1/60){
    if(!Number.isFinite(dt)||dt<=0||dt>0.1)throw new Error('시간 간격이 잘못되었습니다.');
    if(state.phase!=='sliding')return state;
    // Integrate only until stopping: equal distance at every frame rate.
    const t=Math.min(dt,state.puck.v/FRICTION);
    const x=state.puck.x+state.puck.v*t-FRICTION*t*t/2;
    const v=Math.max(0,state.puck.v-FRICTION*t);
    const fell=x+RADIUS>980;
    if(v===0||fell){
      const points=fell?0:scoreAt(x);
      return {...state,puck:{x:Math.min(x,1000),v:0},fell,phase:state.remaining?'ready':'finished',score:state.score+points,history:[...state.history,points]};
    }
    return {...state,puck:{x,v}};
  }
  const api={createState,launch,step,scoreAt,RADIUS};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  else root.Shuffleboard=api;
})(typeof globalThis!=='undefined'?globalThis:this);
