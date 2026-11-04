(function(root,factory){const api=factory();if(typeof module!=='undefined')module.exports=api;root.ShellBoxLogic=api;})(globalThis,function(){
  const createGame=()=>({tiles:[1,2,3,4,5,6,7,8,9],selected:[],roll:null,turns:0});
  const rollDice=(game,value)=>{
    if(game.roll!==null)throw new Error('숫자 조각을 먼저 닫아 주세요');
    if(!Number.isInteger(value)||value<1||value>12)throw new Error('주사위 값이 올바르지 않습니다');
    return {...game,roll:value,selected:[]};
  };
  const toggleTile=(game,tile)=>{
    if(game.roll===null)throw new Error('주사위를 먼저 굴려 주세요');
    if(!game.tiles.includes(tile))throw new Error('고를 수 없는 숫자입니다');
    const selected=game.selected.includes(tile)?game.selected.filter(n=>n!==tile):[...game.selected,tile].sort((a,b)=>a-b);
    if(selected.reduce((sum,n)=>sum+n,0)>game.roll)throw new Error('목표를 넘을 수 없습니다');
    return {...game,selected};
  };
  const closeSelection=game=>{
    if(game.roll===null)throw new Error('주사위를 먼저 굴려 주세요');
    if(game.selected.reduce((sum,n)=>sum+n,0)!==game.roll)throw new Error('선택한 숫자의 합이 목표와 다릅니다');
    return {...game,tiles:game.tiles.filter(tile=>!game.selected.includes(tile)),selected:[],roll:null,turns:game.turns+1};
  };
  const isComplete=game=>game.tiles.length===0;
  const hasMatch=(tiles,target)=>{
    const search=(index,sum)=>sum===target||(index<tiles.length&&sum<target&&(search(index+1,sum+tiles[index])||search(index+1,sum)));
    return search(0,0);
  };
  return {createGame,rollDice,toggleTile,closeSelection,isComplete,hasMatch};
});
