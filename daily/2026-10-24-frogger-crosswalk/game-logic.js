(function(root,factory){const api=factory();if(typeof module!=='undefined')module.exports=api;root.FroggerLogic=api;})(globalThis,function(){
 const createGame=()=>({frog:{x:3,y:6},cars:[{x:0,y:1,speed:1},{x:4,y:1,speed:1},{x:2,y:2,speed:-1},{x:6,y:2,speed:-1},{x:1,y:3,speed:1},{x:5,y:3,speed:1},{x:0,y:4,speed:-1},{x:4,y:4,speed:-1},{x:2,y:5,speed:1}],ticks:0});
 const moveFrog=(g,d)=>{const delta={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[d];if(!delta||hasWon(g))return g;const frog={x:Math.max(0,Math.min(6,g.frog.x+delta[0])),y:Math.max(0,Math.min(6,g.frog.y+delta[1]))};return frog.x===g.frog.x&&frog.y===g.frog.y?g:{...g,frog};};
 const advanceTraffic=g=>({...g,cars:g.cars.map(c=>({...c,x:(c.x+c.speed+7)%7})),ticks:g.ticks+1});
 const hasCollision=g=>g.cars.some(c=>c.x===g.frog.x&&c.y===g.frog.y);
 const hasWon=g=>g.frog.y===0;
 return {createGame,moveFrog,advanceTraffic,hasCollision,hasWon};
});
