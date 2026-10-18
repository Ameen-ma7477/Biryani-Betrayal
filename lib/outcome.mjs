export function playerOutcome(winner, player) {
 if (!winner || !player) return null;
 if (winner === 'The Feast' || winner === 'Town') return ['Sheriff','Doctor','Detective','Civilian','Immune'].includes(player.role) ? 'win' : 'lose';
 if (winner === 'Elaichi Gang' || winner === 'Mafia') return player.role === 'Mafia' ? 'win' : 'lose';
 return player.role === 'Jester' && (winner === 'The Aloo · '+player.name || winner === 'Jester · '+player.name) ? 'win' : 'lose';
}
