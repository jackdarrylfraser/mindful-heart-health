import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

 const neonSql = neon(process.env.DATABASE_URL);
 const drizzleDb = drizzle(neonSql, { });

 export { neonSql, drizzleDb };

