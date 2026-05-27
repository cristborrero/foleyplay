import { getCloudflareContext } from '@opennextjs/cloudflare';
import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../db/schema';

export const getDb = async () => {
  const { env } = await getCloudflareContext({ async: true });
  const d1 = (env as any).DB;
  if (!d1) {
    throw new Error('Cloudflare D1 binding "DB" not found. Check wrangler.jsonc configuration.');
  }
  return drizzle(d1, { schema });
};

export type DbClient = Awaited<ReturnType<typeof getDb>>;
