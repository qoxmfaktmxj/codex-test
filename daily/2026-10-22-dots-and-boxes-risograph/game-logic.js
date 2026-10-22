(function(root,factory){const api=factory();if(typeof module!=='undefined')module.exports=api;root.DotsLogic=api;})(globalThis,function(){
 const edgeIds=()=>{const a=[];for(let r=0;r<4;r++)for(let c=0;c<3;c++)a.push(`h-${r}-${c}`);for(let r=0;r<3;r++)for(let c=0;c<4;c++)a.push(`v-${r}-${c}`);return a;};
 const createGame=()=>({edges:[],edgeOwners:{},boxes:{},scores:{magenta:0,teal:0},current:'magenta'});
 const boxEdges=(r,c)=>[`h-${r}-${c}`,`h-${r+1}-${c}`,`v-${r}-${c}`,`v-${r}-${c+1}`];
 const availableEdges=g=>edgeIds().filter(e=>!g.edges.includes(e));
 const addEdge=(g,id)=>{if(!edgeIds().includes(id)||g.edges.includes(id))return g;const edges=[...g.edges,id],edgeOwners={...g.edgeOwners,[id]:g.current},boxes={...g.boxes};for(let r=0;r<3;r++)for(let c=0;c<3;c++){const key=`${r}-${c}`;if(!boxes[key]&&boxEdges(r,c).every(e=>edges.includes(e)))boxes[key]=g.current;}const gained=Object.keys(boxes).filter(k=>!g.boxes[k]).length;const scores={...g.scores,[g.current]:g.scores[g.current]+gained};return {edges,edgeOwners,boxes,scores,current:gained?g.current:(g.current==='magenta'?'teal':'magenta')};};
 const winner=g=>Object.keys(g.boxes).length===9?(g.scores.magenta===g.scores.teal?'draw':g.scores.magenta>g.scores.teal?'magenta':'teal'):null;
 return {createGame,addEdge,availableEdges,winner};
});
