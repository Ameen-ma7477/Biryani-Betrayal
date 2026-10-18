import {readFile} from 'node:fs/promises';
import {neon} from '@neondatabase/serverless';
if(!process.env.DATABASE_URL){console.error('Set DATABASE_URL in .env.local first. See .env.example.');process.exit(1);}
try {
 const sql=neon(process.env.DATABASE_URL);
 const migration=await readFile(new URL('../db/schema.sql',import.meta.url),'utf8');
 await sql.query(migration);
 console.log('Biryani Betrayal database is ready.');
} catch { console.error('Database setup failed. Check DATABASE_URL and the database connection.');process.exit(1); }
