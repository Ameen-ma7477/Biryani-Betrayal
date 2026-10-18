// Parameterized SQL only. The version check prevents simultaneous requests
// from overwriting another player's join, chat, vote, or night action.
export function makeRoomStore(query) {
 return {
  async insert(code,state) {
   const rows=await query('INSERT INTO biryani_rooms (code, state, version) VALUES ($1, $2, 0) ON CONFLICT (code) DO NOTHING RETURNING code',[code,JSON.stringify(state)]);
   return rows.length===1;
  },
  async get(code) {
   const rows=await query('SELECT state, version FROM biryani_rooms WHERE code = $1',[code]);
   return rows[0] ? {state:JSON.parse(rows[0].state),version:rows[0].version} : null;
  },
  async compareAndSwap(code,state,version) {
   const rows=await query('UPDATE biryani_rooms SET state = $1, version = version + 1 WHERE code = $2 AND version = $3 RETURNING version',[JSON.stringify(state),code,version]);
   return rows.length===1;
  }
 };
}
