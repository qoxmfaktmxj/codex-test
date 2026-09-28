(function(root){'use strict';
const own=(i,t)=>t===1?i>=0&&i<=5:i>=7&&i<=12,store=t=>t===1?6:13,otherStore=t=>t===1?13:6;
function finish(pits){return pits.slice(0,6).every(x=>x===0)||pits.slice(7,13).every(x=>x===0);}
function settle(pits){const p=pits.slice();for(let i=0;i<6;i++){p[6]+=p[i];p[i]=0;}for(let i=7;i<13;i++){p[13]+=p[i];p[i]=0;}return p;}
function make(pits,turn){const done=finish(pits);const p=done?settle(pits):pits.slice();const winner=done?(p[6]===p[13]?0:p[6]>p[13]?1:2):null;return {pits:p,turn,phase:done?'finished':'playing',winner};}
function createState(pits,turn){return make(pits||[4,4,4,4,4,4,0,4,4,4,4,4,4,0],turn||1);}
function legalMoves(s){return s.phase==='playing'?s.pits.map((v,i)=>own(i,s.turn)&&v>0?i:null).filter(i=>i!==null):[];}
function move(s,index){if(!legalMoves(s).includes(index))throw Error('고를 수 없습니다.');const p=s.pits.slice();let stones=p[index],i=index;p[index]=0;while(stones){i=(i+1)%14;if(i===otherStore(s.turn))continue;p[i]++;stones--;}
if(own(i,s.turn)&&p[i]===1&&p[12-i]>0){p[store(s.turn)]+=p[12-i]+1;p[i]=0;p[12-i]=0;}
return make(p,i===store(s.turn)?s.turn:3-s.turn);}
const api={createState,legalMoves,move};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.Kalaha=api;
})(globalThis);
