import {roleName} from './roles.mjs';
import {playerOutcome} from './outcome.mjs';
export const gangSize=n=>n===12?3:n>=7?2:1;
const living=s=>s.players.filter(p=>p.alive);
export function create(code,id,name){return {code,host:id,phase:'lobby',day:0,players:[{id,publicId:crypto.randomUUID(),name,alive:true}],messages:[],gangMessages:[],log:['The daawat is gathering.'],actions:{},votes:{},version:0};}
function phase(s,p,seconds,now){s.phase=p;s.deadline=now+seconds*1000;s.actions={};s.votes={};}
function winner(s){const a=living(s),m=a.filter(p=>p.role==='Mafia').length;if(!m)s.winner='The Feast';else if(m>=a.length-m)s.winner='Elaichi Gang';if(s.winner){s.phase='ended';s.log.push(s.winner+' wins!');}}
function tally(values){const counts={};for(const x of values)if(x)counts[x]=(counts[x]||0)+1;const ranked=Object.entries(counts).sort((a,b)=>b[1]-a[1]);return ranked.length&&(!ranked[1]||ranked[0][1]>ranked[1][1])?ranked[0][0]:null;}
function gangTarget(s){const gang=living(s).filter(p=>p.role==='Mafia');const choices=gang.map(p=>s.actions[p.id]);return gang.length&&choices.every(x=>x&&x===choices[0])?choices[0]:null;}
function nightReady(s){return !!gangTarget(s)&&living(s).filter(p=>['Doctor','Sheriff','Detective'].includes(p.role)).every(p=>s.actions[p.id]);}
function resolve(s,now){
 if(s.phase==='role_choice'){
 for(const p of s.players)if(p.role==='Ameen')p.role='Civilian';
 phase(s,'night',45,now);s.log.push('The kitchen lights are off. Night 1 begins.');
 }else if(s.phase==='night'){
 const a=living(s);const target=gangTarget(s);const saved=a.filter(p=>p.role==='Doctor').map(p=>s.actions[p.id]);
 for(const p of a){let t=s.players.find(t=>t.id===s.actions[p.id]);if(p.role==='Doctor')p.lastSaved=t?.id||null;if(t&&p.role==='Sheriff')p.intel.push('Night '+s.day+': '+t.name+(t.role==='Mafia'?' belongs to the Elaichi Gang.':' is not in the Elaichi Gang.'));if(t&&p.role==='Detective')p.intel.push('Night '+s.day+': '+t.name+' is '+roleName(t.role)+'.');}
 const dead=s.players.find(p=>p.id===target);if(dead&&dead.role!=='Immune'&&!saved.includes(target)){dead.alive=false;s.log.push('Dawn '+s.day+': '+dead.name+' lost their plate.');}else s.log.push('Dawn '+s.day+': every plate is safe.');
 phase(s,'discussion',90,now);winner(s);
 }else if(s.phase==='discussion'){phase(s,'vote',60,now);s.log.push('Voting is open. A tied vote means nobody is eliminated.');}
 else if(s.phase==='vote'){
 const target=tally(Object.values(s.votes).filter(x=>x!=='skip'));const dead=s.players.find(p=>p.id===target);if(dead){dead.alive=false;s.log.push(dead.name+' was voted out of the daawat.');if(dead.role==='Jester'){s.winner='The Aloo · '+dead.name;s.phase='ended';return;}}else s.log.push('No one was voted out.');
 winner(s);if(!s.winner){s.day++;phase(s,'night',45,now);}
 }
}
export function tick(s,now=Date.now()){if(['role_choice','night','discussion','vote'].includes(s.phase)&&now>=s.deadline)resolve(s,now);}
export function command(s,id,op,data={},now=Date.now()){
 tick(s,now);let p=s.players.find(p=>p.id===id);
 if(data.target&&data.target!=='skip'){data={...data,target:s.players.find(t=>t.publicId===data.target)?.id};}
 if(op==='join'){if(p)return;if(s.phase!=='lobby')throw Error('This game has already started.');if(s.players.length>=12)throw Error('This room is full.');const name=String(data.name||'').trim().slice(0,20);if(!name)throw Error('Enter a name.');if(s.players.some(p=>p.name.toLowerCase()===name.toLowerCase()))throw Error('That name is taken.');s.players.push({id,publicId:crypto.randomUUID(),name,alive:true});return;}
 if(!p)throw Error('Join this room first.');
 if(op==='start'){if(id!==s.host)throw Error('Only the host can start.');if(s.phase!=='lobby')throw Error('Game already started.');if(s.players.length<4)throw Error('At least 4 players are needed.');let n=s.players.length,m=gangSize(n);let deck=[...Array(m).fill('Mafia'),'Doctor','Sheriff'];if(n>=6)deck.push('Jester');if(n>=8)deck.push('Detective');deck.push('Ameen');while(deck.length<n)deck.push('Civilian');for(let i=deck.length-1;i>0;i--){let j=crypto.getRandomValues(new Uint32Array(1))[0]%(i+1);[deck[i],deck[j]]=[deck[j],deck[i]];}s.players.forEach((p,i)=>{p.role=deck[i];p.alive=true;p.intel=[];});s.day=1;phase(s,'role_choice',45,now);s.log.push('The Head Chef is choosing a secret specialty. Keep your role private.');return;}
 if(op==='choose'){if(s.phase!=='role_choice'||p.role!=='Ameen')throw Error('Only Ameen can choose during setup.');if(!['Mafia','Sheriff','Doctor','Detective','Jester','Civilian','Immune'].includes(data.role))throw Error('Choose a role from the menu.');if(data.role==='Mafia'){const gang=s.players.filter(t=>t.role==='Mafia');const replaced=gang[crypto.getRandomValues(new Uint32Array(1))[0]%gang.length];if(replaced)replaced.role='Civilian';}p.role=data.role;p.wasAmeen=true;phase(s,'night',45,now);s.log.push('The kitchen lights are off. Night 1 begins.');winner(s);return;}
 if(op==='rematch'){if(s.phase!=='ended')throw Error('Finish the game before reopening the lobby.');s.phase='lobby';delete s.winner;s.messages=[];s.gangMessages=[];s.log=['A fresh handi is gathering guests.'];s.players.forEach(p=>{delete p.role;delete p.intel;delete p.lastSaved;delete p.wasAmeen;delete p.lastGangChat;p.alive=true;});return;}
 if(op==='chat'){if(!['lobby','discussion','vote','ended'].includes(s.phase)||(!p.alive&&s.phase!=='ended'))throw Error('Chat is closed for you right now.');const text=String(data.text||'').trim().slice(0,280);if(text){if(now-(p.lastChat||0)<1200)throw Error('Give others a moment to speak.');p.lastChat=now;s.messages.push({name:p.name,text,at:now});s.messages=s.messages.slice(-80);}return;}
 if(op==='gangChat'){if(p.role!=='Mafia'||!p.alive||!['night','discussion','vote'].includes(s.phase))throw Error('Private gang chat is unavailable.');const text=String(data.text||'').trim().slice(0,280);if(text){if(now-(p.lastGangChat||0)<1200)throw Error('Give your partners a moment to speak.');p.lastGangChat=now;s.gangMessages??=[];s.gangMessages.push({name:p.name,text,at:now});s.gangMessages=s.gangMessages.slice(-80);}return;}
 if(op==='next'){if(id!==s.host||s.phase!=='discussion')throw Error('Only the host can open the vote during discussion.');resolve(s,now);return;}
 if(!p.alive)throw Error('You are spectating.');
 if(op==='action'){if(s.phase!=='night'||!['Mafia','Doctor','Sheriff','Detective'].includes(p.role))throw Error('No night action is available.');if(s.actions[id]&&p.role!=='Mafia')throw Error('Your action is locked.');const t=living(s).find(t=>t.id===data.target);if(!t)throw Error('Choose a living player.');if(p.role==='Mafia'&&t.role==='Mafia')throw Error('Choose someone outside the Elaichi Gang.');if(p.role!=='Doctor'&&t.id===id)throw Error('Choose another player.');if(p.role==='Doctor'&&p.lastSaved===t.id)throw Error('Choose a different person from last night.');s.actions[id]=t.id;if(nightReady(s))resolve(s,now);return;}
 if(op==='vote'){if(s.phase!=='vote')throw Error('Voting is closed.');if(s.votes[id])throw Error('Your vote is locked.');if(data.target!=='skip'&&!living(s).some(t=>t.id===data.target&&t.id!==id))throw Error('Choose another living player or abstain.');s.votes[id]=data.target;if(living(s).every(p=>s.votes[p.id]))resolve(s,now);return;}
 throw Error('Unknown action.');
}
export function view(s,id){const me=s.players.find(p=>p.id===id);if(!me)throw Error('Join this room first.');return {code:s.code,phase:s.phase,day:s.day,deadline:s.deadline,host:s.host===id,winner:s.winner,outcome:s.phase==='ended'?playerOutcome(s.winner,me):null,log:s.log.map(x=>x.replace(/\. (?:Their role: |They were ).*$/,'.')),messages:s.messages,gangMessages:me.role==='Mafia'&&me.alive&&s.phase!=='role_choice'?(s.gangMessages||[]):[],gangChoices:me.role==='Mafia'&&me.alive&&s.phase==='night'?living(s).filter(p=>p.role==='Mafia').map(p=>({id:p.publicId,name:p.name,target:s.players.find(t=>t.id===s.actions[p.id])?.publicId})):[],action:!!s.actions[id],vote:!!s.votes[id],me:{id:me.publicId,name:me.name,role:me.role,alive:me.alive,wasAmeen:!!me.wasAmeen,intel:me.intel||[],lastSaved:s.players.find(p=>p.id===me.lastSaved)?.publicId},players:s.players.map(p=>({id:p.publicId,name:p.name,alive:p.alive,host:p.id===s.host,role:s.phase!=='role_choice'&&s.phase!=='lobby'&&me.role==='Mafia'&&p.role==='Mafia'?'Mafia':undefined})),submitted:s.phase==='vote'?Object.keys(s.votes).length:undefined};}
