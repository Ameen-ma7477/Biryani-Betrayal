import {command,view} from './game.mjs';

// Decisions receive the same role-filtered snapshot as a human browser.
// Bots never read another guest's secret role or investigation notes.
const hash=text=>[...text].reduce((n,c)=>(Math.imul(n,31)+c.charCodeAt(0))>>>0,7);
const pick=(items,key)=>items.length?items[hash(key)%items.length]:null;
function suspects(v){
 const others=v.players.filter(p=>p.alive&&p.id!==v.me.id);
 const knownBad=others.filter(p=>v.me.intel.some(line=>line.includes(': '+p.name+' belongs to the Elaichi Gang.')||line.includes(': '+p.name+' is Elaichi Gang.')));
 const knownSafe=others.filter(p=>v.me.intel.some(line=>line.includes(': '+p.name+' is not in the Elaichi Gang.')||line.includes(': '+p.name+' is Raita Rescuer.')||line.includes(': '+p.name+' is Masala Inspector.')||line.includes(': '+p.name+' is Recipe Reader.')||line.includes(': '+p.name+' is Hungry Guest.')));
 return knownBad.length?knownBad:others.filter(p=>!knownSafe.includes(p));
}
function target(v,key){
 const candidates=v.me.role==='Mafia'?v.players.filter(p=>p.alive&&p.id!==v.me.id&&p.role!=='Mafia'):suspects(v);
 return pick(candidates,key)||pick(v.players.filter(p=>p.alive&&p.id!==v.me.id),key);
}
function speech(v,t,reply){
 const name=t?.name||'everyone';
 if(reply)return pick([`Fair question. What makes you suspect me? I'd like to hear ${name}'s account too.`,`I'm keeping my card private. Let's compare what happened at dawn before voting.`],v.me.id+v.day);
 if(v.me.role!=='Mafia'&&v.me.intel.length)return `My latest case note: ${v.me.intel.at(-1)}`;
 if(v.me.role==='Jester')return pick([`My alibi? I was stealing the potatoes. Surely that's suspicious enough?`,`I have absolutely no convincing explanation. You could always vote me out.`],v.me.id+v.day);
 return pick([`I'm watching ${name}, but it's a hunch, not proof. What do you think?`,`Before we vote, ${name}, what did you make of last night?`,`The diary gives us an outcome, not a role. Let's hear from ${name}.`,`I'm leaning toward ${name}. Can anyone share evidence before we decide?`],v.me.id+v.day+(v.phase==='vote'?'vote':''));
}
export function advanceBots(s,now=Date.now()){
 // Poll-driven, persisted scheduling works across stateless Vercel instances.
 for(const p of s.players.filter(p=>p.bot)){
  if(!p.alive||s.phase==='ended')continue;
  const key=`${s.phase}:${s.day}:${s.deadline||0}`;
  if(p.botTurn?.key!==key)p.botTurn={key,since:now};
  const turn=p.botTurn,age=now-turn.since,delay=4000+hash(p.publicId)%6000;
  let v=view(s,p.id);
  const send=(op,data)=>command(s,p.id,op,data,now);
  if(s.phase==='lobby'){
   if(age>=delay&&!turn.hello){send('chat',{text:'Ready for the daawat! I’m a bot guest; the host can adjust bots before starting.'});turn.hello=true;}
   continue;
  }
  if(age<delay)continue;
  if(v.phase==='role_choice'&&v.me.role==='Ameen'){
   send('choose',{role:pick(['Mafia','Sheriff','Doctor','Detective','Jester','Civilian','Immune'],p.publicId+s.code)});continue;
  }
  if(v.phase==='night'){
   if(v.me.role==='Mafia'){
    // Follow a human partner's submitted target; otherwise use a shared team plan.
    const humans=v.gangChoices.filter(g=>!v.players.find(x=>x.id===g.id)?.bot&&g.target);
    const chosen=humans[0]?.target||target(v,s.code+':gang:'+v.day)?.id;
    if(chosen&&turn.target!==chosen){
     if(now-(p.lastGangChat||0)>=1200)send('gangChat',{text:`Let's agree on ${v.players.find(x=>x.id===chosen)?.name}. One target together.`});
     turn.target=chosen;send('action',{target:chosen});
    }
   }else if(!v.action&&['Doctor','Sheriff','Detective'].includes(v.me.role)){
    const candidates=v.me.role==='Doctor'?v.players.filter(x=>x.alive&&x.id!==v.me.lastSaved):v.players.filter(x=>x.alive&&x.id!==v.me.id&&!v.me.intel.some(line=>line.includes(': '+x.name+' ')));
    const chosen=pick(candidates,p.publicId+v.day)||target(v,p.publicId+v.day);
    if(chosen)send('action',{target:chosen.id});
   }
   continue;
  }
  if(['discussion','vote'].includes(v.phase)){
   const t=target(v,p.publicId+':vote:'+v.day);
   if(!turn.spoke){send('chat',{text:speech(v,t,false)});turn.spoke=true;}
   else if(age>20000&&!turn.replied&&v.messages.some(m=>!m.bot&&m.at>turn.since&&m.text.toLowerCase().includes(p.name.toLowerCase()))){send('chat',{text:speech(v,t,true)});turn.replied=true;}
   if(v.phase==='vote'&&!v.vote&&age>delay+6000)send('vote',{target:t?.id||'skip'});
  }
 }
}
