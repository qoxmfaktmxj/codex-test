(function(root,factory){const api=factory();if(typeof module!=='undefined')module.exports=api;root.QuoridorLogic=api;})(globalThis,function(){
 const createGame=()=>({pawns:{red:{row:4,col:2},blue:{row:0,col:2}},walls:{red:6,blue:6},placedWalls:[],current:'red'});
 const blocked=(g,a,b)=>g.placedWalls.some(w=>w.orientation==='h'&&a.col===b.col&&((a.row===w.row-1&&b.row===w.row)||(b.row===w.row-1&&a.row===w.row))&&(a.col===w.col||a.col===w.col+1)||w.orientation==='v'&&a.row===b.row&&((a.col===w.col-1&&b.col===w.col)||(b.col===w.col-1&&a.col===w.col))&&(a.row===w.row||a.row===w.row+1));
 const legalPawnMoves=(g,p)=>{const a=g.pawns[p],o=g.pawns[p==='red'?'blue':'red'];return [[-1,0],[1,0],[0,-1],[0,1]].map(x=>({row:a.row+x[0],col:a.col+x[1]})).filter(n=>n.row>=0&&n.row<5&&n.col>=0&&n.col<5&&(n.row!==o.row||n.col!==o.col)&&!blocked(g,a,n));};
 const connected=(g,p)=>{const target=p==='red'?0:4,q=[g.pawns[p]],seen=new Set([g.pawns[p].row+','+g.pawns[p].col]);while(q.length){const a=q.shift();if(a.row===target)return true;[[-1,0],[1,0],[0,-1],[0,1]].forEach(x=>{const n={row:a.row+x[0],col:a.col+x[1]},k=n.row+','+n.col;if(n.row>=0&&n.row<5&&n.col>=0&&n.col<5&&!seen.has(k)&&!blocked(g,a,n)){seen.add(k);q.push(n);}});}return false;};
 const placeWall=(g,w)=>{if(g.walls[g.current]===0||!['h','v'].includes(w.orientation)||w.row<1||w.row>3||w.col<1||w.col>3||g.placedWalls.some(x=>x.row===w.row&&x.col===w.col&&x.orientation===w.orientation))return g;const n={...g,placedWalls:[...g.placedWalls,w],walls:{...g.walls,[g.current]:g.walls[g.current]-1}};if(!connected(n,'red')||!connected(n,'blue'))return g;return {...n,current:g.current==='red'?'blue':'red'};};
 const movePawn=(g,d)=>legalPawnMoves(g,g.current).some(x=>x.row===d.row&&x.col===d.col)?{...g,pawns:{...g.pawns,[g.current]:d},current:g.current==='red'?'blue':'red'}:g;
 const winner=g=>g.pawns.red.row===0?'red':g.pawns.blue.row===4?'blue':null;
 return {createGame,legalPawnMoves,placeWall,movePawn,winner};
});
