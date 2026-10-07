(function(root){'use strict';
function round(n){return Math.round(n*100)/100;}
function step(s,input){var thrust=input.thrust&&s.fuel>0; var vx=s.vx+(input.left?-0.18:input.right?0.18:0); var vy=s.vy+0.18-(thrust?0.70:0); return {x:round(s.x+vx),y:round(s.y+vy),vx:round(vx),vy:round(vy),fuel:s.fuel-(thrust?1:0)};}
function landingResult(s,pad){return s.x>=pad.start&&s.x<=pad.end&&Math.abs(s.vx)<=0.8&&s.vy<=1.4?'착륙 성공':'착륙 실패';}
function isOver(s){return s.y>=100;}
var api={step:step,landingResult:landingResult,isOver:isOver}; if(typeof module!=='undefined'&&module.exports)module.exports=api; else root.Lander=api;
})(globalThis);
