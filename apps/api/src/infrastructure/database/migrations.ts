import fs from "node:fs/promises";
import path from "node:path";
import type pg from "pg";

const MIGRATIONS_TABLE = "schema_migrations";
const MIGRATIONS_DIR = path.resolve(process.cwd(), "migrations");

export async function runMigrations(pool: pg.Pool): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
      id SERIAL PRIMARY KEY,
      filename VARCHAR(255) NOT NULL UNIQUE,
      executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  const entries = await fs.readdir(MIGRATIONS_DIR, { withFileTypes: true });
  const migrationFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".sql"))
    .map((entry) => entry.name)
    .sort();

  const { rows } = await pool.query<{ filename: string }>(
    `SELECT filename FROM ${MIGRATIONS_TABLE}`,
  );
  const executed = new Set(rows.map((row) => row.filename));

  for (const filename of migrationFiles) {
    if (executed.has(filename)) continue;

    const sql = await fs.readFile(path.join(MIGRATIONS_DIR, filename), "utf-8");
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(sql);
      await client.query(`INSERT INTO ${MIGRATIONS_TABLE}(filename) VALUES ($1)`, [filename]);
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw new Error(`Failed to execute migration ${filename}: ${(error as Error).message}`);
    } finally {
      client.release();
    }
  }
}
