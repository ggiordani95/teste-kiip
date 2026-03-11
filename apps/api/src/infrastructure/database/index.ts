import { runMigrations } from "./migrations";
import { closePool, createPool } from "./pool";

export { getPool } from "./pool";
export { withTransaction } from "./transaction";

export async function initDatabase(): Promise<void> {
  const pool = createPool();
  await runMigrations(pool);
}

export async function closeDatabase(): Promise<void> {
  await closePool();
}
