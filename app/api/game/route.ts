import {databaseConfigured,getRoomStore} from '../../../lib/database';
import {GameError,handleGame} from '../../../lib/game-service.mjs';
export const dynamic='force-dynamic';
export const runtime='nodejs';
export const maxDuration=30;
const headers={'Cache-Control':'no-store'};
export async function POST(req:Request){
 if(!databaseConfigured())return Response.json({error:'The game database is not configured yet. The site owner needs to add DATABASE_URL and run db/schema.sql.'},{status:503,headers});
 let body:unknown;
 try{body=await req.json();}catch{return Response.json({error:'Invalid request.'},{status:400,headers});}
 try{return Response.json(await handleGame(body,getRoomStore()),{headers});}
 catch(error:unknown){
  if(error instanceof GameError)return Response.json({error:error.message},{status:400,headers});
  // Do not expose database credentials, queries, or server internals to visitors.
  return Response.json({error:'The game database could not be reached. Please try again. If this is a new deployment, check the database setup.'},{status:503,headers});
 }
}
