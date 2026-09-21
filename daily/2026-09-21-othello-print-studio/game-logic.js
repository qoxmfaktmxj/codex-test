(function(root){'use strict';
  const dirs=[[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]],inside=(x,y)=>x>=0&&x<8&&y>=0&&y<8;
  function createState(){const board=Array.from({length:8},()=>Array(8).fill(null));board[3][3]='white';board[4][4]='white';board[3][4]='black';board[4][3]='black';return {board,turn:'black',phase:'playing',winner:null};}
  function flips(s,x,y,color=s.turn){if(!inside(x,y)||s.board[y][x])return [];const other=color==='black'?'white':'black',out=[];for(const[dX,dY]of dirs){let a=x+dX,b=y+dY,line=[];while(inside(a,b)&&s.board[b][a]===other){line.push([a,b]);a+=dX;b+=dY;}if(line.length&&inside(a,b)&&s.board[b][a]===color)out.push(...line);}return out;}
  function legal(s,color=s.turn){const out=[];for(let y=0;y<8;y++)for(let x=0;x<8;x++)if(flips(s,x,y,color).length)out.push([x,y]);return out;}
  function count(s,color){return s.board.flat().filter(v=>v===color).length;}
  function finish(s){const black=count(s,'black'),white=count(s,'white');return {...s,phase:'finished',winner:black===white?'draw':black>white?'black':'white'};}
  function advance(s){if(s.phase!=='playing')return s;if(legal(s,s.turn).length)return s;const next=s.turn==='black'?'white':'black';return legal(s,next).length?{...s,turn:next,passed:s.turn}:finish(s);}
  function move(s,x,y){if(s.phase!=='playing')throw Error('끝난 판입니다.');const taken=flips(s,x,y);if(!taken.length)throw Error('이 칸에는 둘 수 없습니다.');const board=s.board.map(row=>row.slice());board[y][x]=s.turn;taken.forEach(([a,b])=>board[b][a]=s.turn);return advance({...s,board,turn:s.turn==='black'?'white':'black',passed:null});}
  const api={createState,flips,legal,count,advance,move};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.Othello=api;
})(globalThis);
