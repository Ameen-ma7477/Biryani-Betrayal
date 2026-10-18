export const names={Mafia:'Elaichi Gang',Sheriff:'Masala Inspector',Doctor:'Raita Rescuer',Detective:'Recipe Reader',Jester:'The Aloo',Civilian:'Hungry Guest',Ameen:'Ameen — Head Chef',Immune:'Ameen — Night Immunity'};
export const info={
 Mafia:['🟢','THE SABOTEURS','Secretly choose a guest to remove each night. Your gang wins when it equals or outnumbers all other remaining guests. Every living gang member must choose the same target for one collective attack. Disagreement or a missing choice removes nobody.'],
 Sheriff:['🔍','SAVE THE BIRYANI','Check one guest each night to learn whether they belong to the Elaichi Gang. Help the feast remove every gang member.'],
 Doctor:['🥣','SAVE THE BIRYANI','Protect one guest each night, including yourself. You cannot protect the same guest on consecutive nights.'],
 Detective:['📜','SAVE THE BIRYANI','Read one guest’s exact role each night. Your private case notes hold the answer. Help remove every Elaichi Gang member.'],
 Jester:['🥔','THE WILDCARD','Convince the daawat to vote you out during the day, and win alone immediately. Being removed at night does not count.'],
 Civilian:['🍽️','SAVE THE BIRYANI','No night action. Listen, question the alibis, and vote to remove the Elaichi Gang.'],
 Ameen:['👨‍🍳','FIRST PICK OF THE MENU','Choose any standard role or permanent night immunity before the first night. Your choice is private and final. No choice within 45 seconds makes you a Hungry Guest.'],
 Immune:['🛡️','SAVE THE BIRYANI','You cannot be removed by night attacks for the entire match. You have no night action. You can still be voted out, and win with the feast when every gang member is gone.']
};
export const roleName=role=>names[role]||role;
