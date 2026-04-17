import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}

export const neonClient = neon(process.env.DATABASE_URL);
export const drizzleClient = drizzle(neonClient, {});