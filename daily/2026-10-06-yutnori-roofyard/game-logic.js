(function(root){'use strict';
function stepsFor(result){return {do:1,gae:2,geol:3,yut:4,mo:5}[result]||0;}
function move(position,steps){return (position+steps)%20;}
function advance(state,result){const steps=stepsFor(result),distance=state.distance+steps,finished=distance>=20;return {position:finished?0:move(state.position,steps),distance,turns:state.turns+1,finished,bonus:result==='yut'||result==='mo'};}
function isWin(state){return state.finished===true&&state.distance>=20;}
const api={stepsFor,move,advance,isWin};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.RoofyardYut=api;
})(globalThis);
