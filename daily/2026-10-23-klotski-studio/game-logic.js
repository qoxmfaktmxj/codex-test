(function(root,factory){const api=factory();if(typeof module!=='undefined')module.exports=api;root.KlotskiLogic=api;})(globalThis,function(){
 const initial=()=>[
  {id:'hero',x:1,y:0,w:2,h:2,label:'주인공'}, {id:'left',x:0,y:0,w:1,h:2,label:'왼쪽 활자'}, {id:'right',x:3,y:0,w:1,h:2,label:'오른쪽 활자'},
  {id:'dot-a',x:0,y:2,w:1,h:1,label:'활자 A'}, {id:'bar',x:1,y:2,w:2,h:1,label:'가로 활자'}, {id:'dot-b',x:3,y:2,w:1,h:1,label:'활자 B'},
  {id:'dot-c',x:0,y:3,w:1,h:1,label:'활자 C'}, {id:'dot-d',x:3,y:3,w:1,h:1,label:'활자 D'}
 ];
 const createGame=()=>({blocks:initial(),selected:null,moves:0});
 const selectBlock=(g,id)=>g.blocks.some(b=>b.id===id)?{...g,selected:id}:g;
 const overlaps=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
 const moveSelected=(g,direction)=>{const i=g.blocks.findIndex(b=>b.id===g.selected);if(i<0||winner(g))return g;const delta={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]}[direction];if(!delta)return g;const moved={...g.blocks[i],x:g.blocks[i].x+delta[0],y:g.blocks[i].y+delta[1]};if(moved.x<0||moved.y<0||moved.x+moved.w>4||moved.y+moved.h>5||g.blocks.some((b,n)=>n!==i&&overlaps(moved,b)))return g;const blocks=g.blocks.map((b,n)=>n===i?moved:b);return {...g,blocks,moves:g.moves+1};};
 const winner=g=>g.blocks.some(b=>b.id==='hero'&&b.x===1&&b.y===3);
 return {createGame,selectBlock,moveSelected,winner};
});
