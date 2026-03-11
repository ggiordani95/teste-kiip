import { closeDatabase, initDatabase } from "./index";

async function main() {
  await initDatabase();
  await closeDatabase();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
