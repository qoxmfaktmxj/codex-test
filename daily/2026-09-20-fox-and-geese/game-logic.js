(function(root){'use strict';
  const key=(x,y)=>`${x},${y}`, pos=k=>k.split(',').map(Number), inside=(x,y)=>x>=0&&x<=6&&y>=0&&y<=6;
  function createState(){return {phase:'playing',turn:'geese',fox:key(3,0),geese:new Set([...Array(7)].map((_,x)=>key(x,2)).concat([1,2,3,4,5].map(x=>key(x,3)))),captured:0,winner:null};}
  function move(s,from,to){if(s.phase!=='playing')throw Error('끝난 판입니다.');const [a,b]=pos(from),[x,y]=pos(to);if(!inside(x,y)||s.fox===to||s.geese.has(to))throw Error('빈 점으로만 움직일 수 있습니다.');let geese=new Set(s.geese),fox=s.fox,captured=s.captured;
    if(s.turn==='geese'){if(!geese.has(from)||Math.abs(x-a)+Math.abs(y-b)!==1||y<b)throw Error('거위는 가로 또는 아래로 한 점 움직입니다.');geese.delete(from);geese.add(to);}
    else {if(from!==fox)throw Error('여우를 선택하세요.');const dx=x-a,dy=y-b;if(Math.max(Math.abs(dx),Math.abs(dy))===1)fox=to;else if(Math.abs(dx)===2&&Math.abs(dy)===2||Math.abs(dx)===2&&dy===0||Math.abs(dy)===2&&dx===0){const mid=key(a+dx/2,b+dy/2);if(!geese.has(mid))throw Error('넘을 거위가 없습니다.');geese.delete(mid);fox=to;captured++;}else throw Error('여우는 한 점 또는 거위를 넘어 움직입니다.');}
    const winner=captured>=4?'fox':null;return {...s,fox,geese,captured,turn:winner?'fox':s.turn==='fox'?'geese':'fox',phase:winner?'finished':'playing',winner};}
  const api={createState,move};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.FoxGeese=api;
})(globalThis);
