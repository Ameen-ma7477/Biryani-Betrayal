// Announcements use only public room data. Never inspect a player's role or
// private night action to decide what the rest of the room should see.
export function roundAnnouncement(room) {
 if (!room || !room.code || !room.day) return null;
 if (room.phase === 'night') return {
  id: `${room.code}:night:${room.day}:${room.deadline}`,
  kind: 'night', round: room.day,
  title: 'NIGHT FALLS.',
  message: 'The kitchen lights are off. Something smells suspicious.',
  detail: 'Make your secret move. Keep your alibi ready.'
 };
 if (!['discussion','ended'].includes(room.phase)) return null;
 const prefix = `Dawn ${room.day}: `;
 const logs = room.log || [];
 const line = [...logs].reverse().find(x => x.startsWith(prefix));
 if (!line) return null;
 // At game over, show dawn only if the night just caused the result.
 // A later daytime vote must not replay an earlier night's announcement.
 if (room.phase === 'ended' && logs.at(-2) !== line) return null;
 const removed = (room.players || []).find(p => !p.alive && line === `${prefix}${p.name} lost their plate.`);
 if (!removed && line !== `${prefix}every plate is safe.`) return null;
 return {
  id: `${room.code}:dawn:${room.day}:${room.deadline}:${line}`,
  kind: removed ? 'eliminated' : 'safe', round: room.day,
  title: removed ? 'PLATE TAKEN.' : 'EVERY PLATE IS SAFE!',
  name: removed?.name,
  message: removed ? 'was eliminated during the night.' : 'Nobody was eliminated during the night.',
  detail: removed ? 'Their role stays secret. Who will you trust now?' : 'The daawat lives to argue another day.'
 };
}
