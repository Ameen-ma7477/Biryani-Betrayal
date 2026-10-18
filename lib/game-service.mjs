import {create,command,tick,view} from './game.mjs';
export class GameError extends Error {}
export async function handleGame(body,store) {
 if(!body||typeof body!=='object'||Array.isArray(body))throw new GameError('Invalid request.');
 const id=String(body.id||'');
 if(!/^[a-zA-Z0-9-]{20,80}$/.test(id))throw new GameError('Invalid player session.');
 if(body.op==='create') {
  const name=String(body.name||'').trim().slice(0,20);
  if(!name)throw new GameError('Enter your name.');
  for(let i=0;i<5;i++) {
   const code=Array.from(crypto.getRandomValues(new Uint8Array(6)),x=>'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[x%32]).join('');
   const state=create(code,id,name);
   if(await store.insert(code,state))return view(state,id);
  }
  throw new GameError('Try creating a room again.');
 }
 const code=String(body.code||'').toUpperCase();
 if(!/^[A-Z2-9]{6}$/.test(code))throw new GameError('Enter the 6-character room code.');
 for(let i=0;i<12;i++) {
  const row=await store.get(code);
  if(!row)throw new GameError('Room not found. Check the code.');
  const state=row.state,before=JSON.stringify(state);
  try {
   if(body.op==='poll') {
    if(!state.players.some(p=>p.id===id))throw Error('Join this room first.');
    tick(state);
   }else command(state,id,body.op,body);
  } catch(error) { throw new GameError(error.message||'That action is unavailable.'); }
  if(JSON.stringify(state)!==before&&!await store.compareAndSwap(code,state,row.version)) {
   // Retrying applies the action to the latest committed room, preserving
   // other players' changes. Never retry a write after a network error.
   await new Promise(resolve=>setTimeout(resolve,5+Math.random()*15));
   continue;
  }
  return view(state,id);
 }
 throw new GameError('Room is busy. Try again.');
}
