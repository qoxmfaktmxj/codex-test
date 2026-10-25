(function(root,factory){const api=factory();if(typeof module!=='undefined')module.exports=api;root.NinepinsLogic=api;})(globalThis,function(){
 const createGame=()=>({pins:Array(9).fill(true),score:0,throws:0});
 const remainingPins=g=>g.pins.filter(Boolean).length;
 const isComplete=g=>g.throws>=2||remainingPins(g)===0;
 const roll=(g,hit)=>{if(isComplete(g))return g;const pins=g.pins.map((pin,index)=>pin&&!hit.includes(index));const knocked=remainingPins(g)-pins.filter(Boolean).length;return {...g,pins,score:g.score+knocked,throws:g.throws+1};};
 return {createGame,roll,remainingPins,isComplete};
});
