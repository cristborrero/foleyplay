import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../db/schema';

export const getDb = () => {
  const d1 = (process.env as any).DB;
  if (!d1) {
    throw new Error('Cloudflare D1 Database binding "DB" was not found in process.env. Please verify your wrangler configuration.');
  }
  return drizzle(d1, { schema });
};

export type DbClient = ReturnType<typeof getDb>;
