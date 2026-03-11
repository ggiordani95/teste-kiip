import pg from "pg";
import { env } from "../../config/env";

const { Pool } = pg;

let pool: pg.Pool;

export function createPool(): pg.Pool {
  pool = new Pool({
    connectionString: env.databaseUrl,
  });
  return pool;
}

export function getPool(): pg.Pool {
  if (!pool) throw new Error("Database not initialized");
  return pool;
}

export async function closePool(): Promise<void> {
  if (pool) await pool.end();
}
