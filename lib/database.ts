import {neon} from '@neondatabase/serverless';
import {makeRoomStore} from './room-store.mjs';
export function databaseConfigured(){return !!process.env.DATABASE_URL;}
export function getRoomStore(){
 const connectionString=process.env.DATABASE_URL;
 if(!connectionString)throw new Error('DATABASE_URL is missing');
 const sql=neon(connectionString);
 return makeRoomStore((text:string,values:unknown[])=>sql.query(text,values));
}
