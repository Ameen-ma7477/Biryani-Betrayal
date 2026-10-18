import test from 'node:test';
import assert from 'node:assert/strict';
import {create,command,view,tick} from '../lib/game.mjs';
import {advanceBots} from '../lib/bots.mjs';
import {handleGame} from '../lib/game-service.mjs';
const host='host-session-1234567890123';
function room(n=3){const s=create('ABCDEF',host,'Host');command(s,host,'setBots',{count:n},100000);return s;}
test('only host can set lobby bots, with strict 12-seat cap',()=>{
 const s=room(11);assert.equal(s.players.length,12);assert.equal(s.players.filter(p=>p.bot).length,11);
 assert.throws(()=>command(s,host,'setBots',{count:12}),/12 guests/);
 assert.throws(()=>command(s,host,'setBots',{count:1.5}),/12 guests/);
 assert.throws(()=>command(s,s.players[1].id,'setBots',{count:0}),/Only the host/);
 command(s,host,'setBots',{count:3});assert.equal(s.players.length,4);
 command(s,host,'start',{},100000);assert.throws(()=>command(s,host,'setBots',{count:0},100001),/lobby/);
});
test('bots greet once, retain secret roles, and cannot be impersonated',async()=>{
 const s=room();advanceBots(s,100000);advanceBots(s,120000);advanceBots(s,122000);
 assert.equal(s.messages.length,3);assert.ok(s.messages.every(m=>m.bot));
 command(s,host,'start',{},130000);const out=view(s,host);assert.ok(out.players.filter(p=>p.bot).every(p=>!p.role));
 const store={get:async()=>({state:structuredClone(s),version:0}),compareAndSwap:async()=>true};
 await assert.rejects(handleGame({id:s.players[1].id,code:s.code,op:'poll'},store),/Bots cannot/);
});
test('bots use powers, chat, vote and complete mixed games across all roster sizes',()=>{
 for(const n of [3,5,6,7,11])for(let run=0;run<8;run++){
  const s=room(n);let now=100000;command(s,host,'start',{},now);
  for(let step=0;step<1000&&s.phase!=='ended';step++){
   now+=2000;tick(s,now);advanceBots(s,now);
   const v=view(s,host);
   if(v.phase==='role_choice'&&v.me.role==='Ameen')command(s,host,'choose',{role:'Sheriff'},now);
   else if(v.phase==='night'&&v.me.alive&&!v.action&&['Doctor','Sheriff','Detective','Mafia'].includes(v.me.role)){
    const t=v.players.find(p=>p.alive&&(v.me.role==='Doctor'?p.id!==v.me.lastSaved:p.id!==v.me.id)&&(v.me.role!=='Mafia'||p.role!=='Mafia'));
    if(t)command(s,host,'action',{target:t.id},now);
   }else if(v.phase==='vote'&&v.me.alive&&!v.vote)command(s,host,'vote',{target:'skip'},now);
  }
  assert.equal(s.phase,'ended',`roster ${n+1}, run ${run}`);
  assert.ok(s.messages.some(m=>m.bot));
  const publicState=JSON.stringify(view(s,host));for(const b of s.players.filter(p=>p.bot))assert.ok(!publicState.includes(b.id));
 }
});
test('gang bots follow a human partner collectively, public chat stays closed at night',()=>{
 const s=room(6);command(s,host,'start',{},100000);s.phase='night';s.deadline=145000;s.day=1;
 s.players.forEach((p,i)=>{p.role=i<2?'Mafia':'Civilian';p.intel=[];});
 const victim=s.players[3];command(s,host,'action',{target:victim.publicId},100001);
 advanceBots(s,100002);advanceBots(s,112000);
 assert.equal(s.phase,'discussion');assert.equal(victim.alive,false);assert.equal(s.messages.length,0);
 assert.equal(view(s,s.players[2].id).gangMessages.length,0);
 assert.ok(s.gangMessages.some(m=>m.bot&&m.text.includes(victim.name)));
});
