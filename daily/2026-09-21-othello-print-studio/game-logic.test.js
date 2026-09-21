const {test}=require('node:test');
const assert=require('node:assert/strict');
const G=require('./game-logic.js');
test('시작 배치에는 흑과 백이 두 개씩 있고 흑부터 시작한다',()=>{const s=G.createState();assert.equal(s.turn,'black');assert.equal(G.count(s,'black'),2);assert.equal(G.count(s,'white'),2);});
test('흑은 첫 수로 백 돌을 한 개 뒤집는다',()=>{let s=G.createState();s=G.move(s,2,3);assert.equal(s.board[3][3],'black');assert.equal(s.board[3][2],'black');assert.equal(s.turn,'white');});
test('여러 방향으로 낀 돌을 한 번에 뒤집는다',()=>{let s={board:Array.from({length:8},()=>Array(8).fill(null)),turn:'black',phase:'playing',winner:null};s.board[1][3]='black';s.board[2][3]='white';s.board[3][1]='black';s.board[3][2]='white';s=G.move(s,3,3);assert.equal(s.board[2][3],'black');assert.equal(s.board[3][2],'black');assert.equal(s.board[3][3],'black');});
test('뒤집을 수 없는 칸은 거부한다',()=>{const s=G.createState();assert.throws(()=>G.move(s,0,0));assert.throws(()=>G.move(s,3,3));});
test('둘 곳이 없으면 자동 패스하고 양쪽이 없으면 점수로 끝난다',()=>{let s={board:Array.from({length:8},()=>Array(8).fill('black')),turn:'white',phase:'playing',winner:null};s=G.advance(s);assert.equal(s.phase,'finished');assert.equal(s.winner,'black');});
